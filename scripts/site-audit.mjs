#!/usr/bin/env node
/**
 * Crawl aiworkspacehq.com (or SITE_AUDIT_BASE) for status, links, meta, and forbidden text.
 * Exit 1 on failures. Writes docs/site-audit-report.json and docs/site-audit-report.md
 *
 * Usage: node scripts/site-audit.mjs
 * Env: SITE_AUDIT_BASE (default https://aiworkspacehq.com)
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const BASE = (process.env.SITE_AUDIT_BASE || "https://aiworkspacehq.com").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/about",
  "/building",
  "/checkout",
  "/contact",
  "/delivery",
  "/enterprise",
  "/our-work",
  "/platform",
  "/pricing",
  "/principles",
  "/privacy",
  "/process",
  "/products",
  "/products/warrant",
  "/products/warrant-mcp",
  "/refunds",
  "/resources",
  "/security",
  "/services",
  "/technology",
  "/terms",
  "/trust",
  "/what-we-havent-built",
];

const DEVANAGARI = /[\u0900-\u097F]/;
const PLACEHOLDER = /\b(TODO|FIXME|lorem ipsum)\b|\{\{[A-Z0-9_]+\}\}/i;
// "placeholder" alone is used in honest gap-list copy — only flag HTML form placeholders leaking as {{}}
const UA = "AIWorkspaceHQ-site-audit/1.0";

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
  });
  const text = await res.text();
  return { status: res.status, url: res.url, text, ok: res.status >= 200 && res.status < 400 };
}

function extractMeta(html) {
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || null;
  const desc =
    (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) ||
      [])[1] || null;
  return { title, description: desc };
}

function extractLinks(html, pageUrl) {
  const hrefs = [];
  const re = /<a\b[^>]*href=["']([^"'#]+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:"))
      continue;
    try {
      hrefs.push(new URL(raw, pageUrl).href);
    } catch {
      /* ignore */
    }
  }
  return [...new Set(hrefs)];
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

const failures = [];
const pages = [];
const linkStatus = new Map();

console.log(`Auditing ${BASE} (${ROUTES.length} routes)…`);

for (const path of ROUTES) {
  const url = `${BASE}${path}`;
  let result;
  try {
    result = await fetchText(url);
  } catch (e) {
    failures.push({ type: "fetch", path, error: String(e) });
    pages.push({ path, status: 0, error: String(e) });
    continue;
  }
  const meta = extractMeta(result.text);
  const visible = stripTags(result.text);
  const issues = [];
  if (!result.ok) issues.push(`HTTP ${result.status}`);
  if (!meta.title) issues.push("missing <title>");
  if (!meta.description) issues.push("missing meta description");

  // canonical
  const canon = (result.text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    result.text.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i) || [])[1];
  if (!canon) issues.push("missing canonical");
  // JSON-LD parse
  const ldBlocks = [...result.text.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, raw] of ldBlocks) {
    try { JSON.parse(raw); } catch { issues.push("invalid JSON-LD"); break; }
  }
  if (path === "/" && ldBlocks.length < 1) issues.push("home missing JSON-LD");

  if (DEVANAGARI.test(result.text)) issues.push("Devanagari characters present");
  if (PLACEHOLDER.test(visible)) issues.push("TODO/FIXME/lorem/{{PLACEHOLDER}} in visible text");
  // /products should land on our-work
  if (path === "/products" && !/our-work|Our Work/i.test(result.url + visible.slice(0, 500))) {
    issues.push("/products did not resolve to Our Work content");
  }
  for (const issue of issues) failures.push({ type: "page", path, issue });
  const links = extractLinks(result.text, result.url);
  pages.push({
    path,
    finalUrl: result.url,
    status: result.status,
    title: meta.title,
    description: meta.description,
    issues,
    linkCount: links.length,
    links,
  });
  process.stdout.write(issues.length ? "F" : ".");
}


// --- SEO / discoverability resources ---
const SEO_PATHS = [
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/og.png",
];

console.log("Checking SEO resources…");
const seoResources = {};
for (const path of SEO_PATHS) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    const text = path.endsWith(".png") ? "" : await res.text();
    const issues = [];
    if (!(res.status >= 200 && res.status < 400)) issues.push(`HTTP ${res.status}`);
    if (path === "/sitemap.xml") {
      if (!text.includes("<urlset") || !text.includes("<loc>")) issues.push("sitemap missing urlset/loc");
      if (!text.includes("aiworkspacehq.com")) issues.push("sitemap missing host");
    }
    if (path === "/robots.txt") {
      if (!/sitemap:\s*https:\/\/aiworkspacehq\.com\/sitemap\.xml/i.test(text))
        issues.push("robots.txt missing Sitemap line");
      for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
        if (!text.includes(bot)) issues.push(`robots.txt missing ${bot}`);
      }
    }
    if (path === "/llms.txt") {
      if (!/AI Workspace/i.test(text) || !/contact/i.test(text)) issues.push("llms.txt incomplete");
    }
    if (path === "/llms-full.txt" && text.length < 400) issues.push("llms-full.txt too short");
    seoResources[path] = { status: res.status, issues };
    for (const issue of issues) failures.push({ type: "seo", path, issue });
    process.stdout.write(issues.length ? "F" : ".");
  } catch (e) {
    failures.push({ type: "seo", path, error: String(e) });
    seoResources[path] = { error: String(e) };
    process.stdout.write("F");
  }
}
process.stdout.write("\n");

process.stdout.write("\nChecking unique same-origin + selected external links…\n");

const toCheck = new Set();
for (const page of pages) {
  for (const href of page.links || []) {
    const u = new URL(href);
    if (u.origin === new URL(BASE).origin || href.includes("github.com/rmanish2000-del") || href.includes("jachega.in") || href.includes("eduos.global") || href.includes("urjaops.com") || href.includes("upwork.com/services") || href.includes("hf.space") || href.includes("youtu")) {
      // skip assets
      if (/\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)(\?|$)/i.test(u.pathname)) continue;
      toCheck.add(href.split("#")[0]);
    }
  }
}

for (const href of [...toCheck].sort()) {
  if (linkStatus.has(href)) continue;
  try {
    const res = await fetch(href, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": UA },
    });
    // Upwork often 403 bots — treat 403 as soft warn, not failure
    const soft = res.status === 403 && href.includes("upwork.com");
    linkStatus.set(href, { status: res.status, ok: res.status >= 200 && res.status < 400, soft });
    if (!(res.status >= 200 && res.status < 400) && !soft) {
      failures.push({ type: "link", href, status: res.status });
    }
  } catch (e) {
    linkStatus.set(href, { status: 0, ok: false, error: String(e) });
    failures.push({ type: "link", href, error: String(e) });
  }
}


// --- Portfolio product-list consistency (SSOT: src/content/products.json) ---
{
  const portfolio = JSON.parse(
    readFileSync(join(root, "src/content/products.json"), "utf8"),
  );
  const EXPECTED_PRODUCTS = portfolio.products.map((p) => p.name);
  console.log(`Checking product SSOT consistency (${EXPECTED_PRODUCTS.join(", ")})…`);
  for (const path of ["/", "/our-work", "/llms.txt", "/llms-full.txt"]) {
    const url = `${BASE}${path}`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      const text = await res.text();
      const missing = EXPECTED_PRODUCTS.filter((name) => !text.includes(name));
      if (missing.length) {
        failures.push({ type: "products", path, issue: `missing products: ${missing.join(", ")}` });
        process.stdout.write("F");
      } else process.stdout.write(".");
    } catch (e) {
      failures.push({ type: "products", path, error: String(e) });
      process.stdout.write("F");
    }
  }
  process.stdout.write("\n");
}

const report = {
  auditedAt: new Date().toISOString(),
  base: BASE,
  routeCount: ROUTES.length,
  failureCount: failures.length,
  failures,
  pages: pages.map(({ links, ...rest }) => rest),
  links: Object.fromEntries(linkStatus),
  seoResources,
};

mkdirSync(join(root, "docs"), { recursive: true });
const jsonPath = join(root, "docs/site-audit-report.json");
const mdPath = join(root, "docs/site-audit-report.md");
writeFileSync(jsonPath, JSON.stringify(report, null, 2));

const md = [
  `# Site audit report`,
  ``,
  `- Base: ${BASE}`,
  `- Audited at: ${report.auditedAt}`,
  `- Routes: ${ROUTES.length}`,
  `- Failures: ${failures.length}`,
  ``,
  `## Failures`,
  failures.length
    ? failures.map((f) => `- \`${JSON.stringify(f)}\``).join("\n")
    : "_None_",
  ``,
  `## Pages`,
  `| Path | Status | Title | Issues |`,
  `| --- | --- | --- | --- |`,
  ...pages.map(
    (p) =>
      `| ${p.path} | ${p.status} | ${(p.title || "").replace(/\|/g, "/")} | ${(p.issues || []).join("; ") || "ok"} |`,
  ),
  ``,
];
writeFileSync(mdPath, md.join("\n"));

console.log(`Wrote ${jsonPath}`);
console.log(`Wrote ${mdPath}`);
if (failures.length) {
  console.error(`${failures.length} failure(s)`);
  process.exit(1);
}
console.log("Audit clean.");

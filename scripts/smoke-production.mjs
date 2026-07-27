/**
 * smoke-production.mjs — drive a live deployment in real browsers.
 *
 *   node scripts/smoke-production.mjs https://origin
 *
 * The header and cache checks in verify-production.mjs are protocol-level.
 * This is what a visitor actually experiences: does the page render, does
 * anything error in the console, does every asset resolve, does the browser
 * accept the CSP, and does the site keep its promise of no cookies, no
 * storage and no third-party traffic.
 *
 * Runs in Chromium, Firefox and WebKit — a CSP parse error or a storage write
 * can differ by engine, and CSP-1 was a defect only a real parser exposed.
 *
 * Read-only. Navigates and observes; submits nothing.
 */
import { chromium, firefox, webkit } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const origin = (process.argv[2] ?? '').replace(/\/$/, '');
if (!origin) {
  console.error('Usage: node scripts/smoke-production.mjs <origin>');
  process.exit(2);
}

const ROUTES = [
  '/',
  '/platform',
  '/principles',
  '/about',
  '/contact',
  '/privacy',
  '/this-route-404s',
];
const ENGINES = [
  ['chromium', chromium],
  ['firefox', firefox],
  ['webkit', webkit],
];

const originHost = new URL(origin).host;
const failures = [];
let totalAxe = 0;
let routeLoads = 0;

for (const [engineName, engine] of ENGINES) {
  let browser;
  try {
    browser = await engine.launch();
  } catch (error) {
    // Firefox will not start on this Windows machine — known-limitations L-11.
    console.log(`\n${engineName.toUpperCase()} — SKIPPED: ${String(error.message).split('\n')[0]}`);
    continue;
  }

  console.log(`\n${engineName.toUpperCase()}`);

  for (const route of ROUTES) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const problems = [];
    const thirdParty = [];

    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      // The 404 route's own document legitimately responds 404; the browser
      // logs that as a failed resource load. Everything else is real.
      const expected404 = route === '/this-route-404s' && /status of 404/.test(m.text());
      if (!expected404) problems.push(`console: ${m.text()}`);
    });
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) =>
      problems.push(`asset failed: ${r.url()} — ${r.failure()?.errorText}`),
    );
    page.on('request', (r) => {
      const host = new URL(r.url()).host;
      if (host !== originHost && !r.url().startsWith('data:')) thirdParty.push(r.url());
    });
    page.on('response', (r) => {
      if (r.status() >= 400 && !r.url().endsWith('/this-route-404s')) {
        problems.push(`${r.status()} on ${r.url()}`);
      }
    });

    await page.goto(origin + route, { waitUntil: 'networkidle' });

    // `08` §9.1 — no cookies, no storage. Asserted in the browser, not inferred.
    const cookies = await context.cookies();
    if (cookies.length) problems.push(`${cookies.length} cookie(s) set`);

    const storage = await page.evaluate(() => ({
      /**
       * The `no-restricted-globals` ban on storage exists to keep it out of
       * page code (P-07). This runs inside the BROWSER, in a verification
       * script, and reads the counts precisely to prove they are zero —
       * the opposite of what the rule guards against. Scoped to these two
       * reads; the ban stays in force everywhere else.
       */
      // eslint-disable-next-line no-restricted-globals
      local: localStorage.length,
      // eslint-disable-next-line no-restricted-globals
      session: sessionStorage.length,
    }));
    if (storage.local || storage.session) {
      problems.push(`storage written: local=${storage.local} session=${storage.session}`);
    }

    if (thirdParty.length) problems.push(`third-party request(s): ${thirdParty.join(', ')}`);

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    totalAxe += axe.violations.length;
    for (const v of axe.violations) {
      problems.push(`axe ${v.id} (${v.impact}): ${v.nodes.length} node(s)`);
    }

    routeLoads += 1;
    if (problems.length === 0) {
      console.log(
        `  ✓ ${route.padEnd(20)} 0 console errors · 0 cookies · 0 storage · 0 third-party · ${axe.passes.length} axe checks`,
      );
    } else {
      console.log(`  ✗ ${route.padEnd(20)} ${problems.length} problem(s)`);
      for (const p of problems) console.log(`      ${p}`);
      failures.push(`${engineName} ${route}`);
    }

    await context.close();
  }

  await browser.close();
}

/* ── Static assets, fetched directly ─────────────────────────────────────── */

console.log('\nASSETS');
for (const asset of [
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/site.webmanifest',
  '/browserconfig.xml',
  '/robots.txt',
  '/sitemap.xml',
]) {
  const r = await fetch(origin + asset, { signal: AbortSignal.timeout(15_000) });
  const size = (await r.arrayBuffer()).byteLength;
  if (r.status === 200 && size > 0) {
    console.log(
      `  ✓ ${asset.padEnd(24)} ${r.status} · ${size} B · ${r.headers.get('content-type')}`,
    );
  } else {
    console.log(`  ✗ ${asset.padEnd(24)} ${r.status} · ${size} B`);
    failures.push(asset);
  }
}

console.log(
  `\n  ${routeLoads - failures.filter((f) => f.includes(' /')).length}/${routeLoads} route-loads clean · ` +
    `${totalAxe} accessibility violations · ${failures.length} failure(s)\n`,
);
if (failures.length) process.exit(1);

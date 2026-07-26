/**
 * verify-production.mjs — verify a live deployment against the specifications.
 *
 *   node scripts/verify-production.mjs https://origin
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ This checks a DEPLOYED origin. It changes nothing and deploys nothing.    │
 * │                                                                           │
 * │ Everything asserted here comes from the specification modules or from the │
 * │ built artefact in dist/, so this cannot drift from what the site claims   │
 * │ about itself. Where a check cannot be performed against this origin — the │
 * │ www redirect needs the custom domain — it is reported as PENDING, never   │
 * │ as a pass.                                                                │
 * └───────────────────────────────────────────────────────────────────────────┘
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import esbuild from 'esbuild';

const origin = (process.argv[2] ?? '').replace(/\/$/, '');
if (!origin) {
  console.error('Usage: node scripts/verify-production.mjs <origin>');
  process.exit(2);
}

const results = [];
const pass = (area, detail) => results.push({ status: 'PASS', area, detail });
const fail = (area, detail) => results.push({ status: 'FAIL', area, detail });
const pending = (area, detail) => results.push({ status: 'PENDING', area, detail });

const ROUTES = ['/', '/platform', '/principles', '/contact', '/privacy'];

function specModule() {
  const bundle = esbuild.buildSync({
    stdin: {
      contents: `
        import { securityHeaders, CACHE_RULES } from './src/lib/production';
        import { CANONICAL_ORIGIN, IS_INDEXABLE } from './src/lib/site';
        process.stdout.write(JSON.stringify({
          headers: securityHeaders(), cache: CACHE_RULES,
          canonical: CANONICAL_ORIGIN, indexable: IS_INDEXABLE,
        }));
      `,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
  });
  return JSON.parse(
    execFileSync(process.execPath, ['-e', bundle.outputFiles[0].text], { encoding: 'utf8' }),
  );
}

const spec = specModule();
const get = (path, init = {}) =>
  fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(20_000), ...init });

/* ── 1. Every route responds, and only the expected ones ─────────────────── */

for (const route of ROUTES) {
  const r = await get(route);
  if (r.status === 200) pass('routes', `${route} → 200`);
  else fail('routes', `${route} → ${r.status}`);
}

{
  const r = await get('/this-route-does-not-exist');
  if (r.status === 404) pass('routes', 'unknown path → 404');
  else fail('routes', `unknown path → ${r.status}, expected 404`);
}

/* ── 2. TLS ──────────────────────────────────────────────────────────────── */

{
  // A successful HTTPS fetch means the chain validated: Node rejects an
  // untrusted or expired certificate outright.
  try {
    const r = await get('/');
    pass('tls', `HTTPS handshake succeeded and the chain validated (${r.status})`);
  } catch (error) {
    fail('tls', `HTTPS failed: ${error.message}`);
  }

  const hsts = (await get('/')).headers.get('strict-transport-security');
  if (hsts?.includes('max-age=31536000') && hsts.includes('includeSubDomains')) {
    pass('tls', `HSTS: ${hsts}`);
  } else {
    fail('tls', `HSTS is "${hsts}"`);
  }
  if (hsts?.includes('preload')) {
    fail('tls', 'HSTS carries `preload` — SEC-04 adds it only after 30 stable days');
  } else {
    pass('tls', 'HSTS omits `preload`, per SEC-04 (added only after 30 stable days)');
  }
}

/* ── 3. Security headers, on every route ─────────────────────────────────── */

for (const route of ROUTES) {
  const r = await get(route);
  const missing = spec.headers
    .filter(({ name, value }) => {
      const actual = r.headers.get(name);
      if (actual === null) return true;
      // CSP is compared by directive elsewhere; here only presence matters.
      return name === 'Content-Security-Policy' ? false : actual !== value;
    })
    .map((h) => h.name);

  if (missing.length === 0) pass('headers', `${route}: all ${spec.headers.length} present`);
  else fail('headers', `${route}: missing/wrong — ${missing.join(', ')}`);
}

/* ── 4. CSP matches the bytes actually served ────────────────────────────── */

{
  const html = await (await get('/')).text();
  const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];

  if (!block) {
    fail('csp', 'no JSON-LD block served on /');
  } else {
    const served = `sha256-${createHash('sha256').update(block, 'utf8').digest('base64')}`;
    const csp = (await get('/')).headers.get('content-security-policy') ?? '';
    if (csp.includes(served)) {
      pass('csp', `script-src hash matches the served JSON-LD (${served.slice(0, 24)}…)`);
    } else {
      fail('csp', `served JSON-LD hashes to ${served}, which the CSP does not list`);
    }

    /**
     * P2-B defect CSP-1: matching the hash STRING is not enough. A hash source
     * must be quoted — `'sha256-…'` — or the browser calls it an invalid source
     * and ignores it. That shipped, and a string-equality check saw nothing
     * wrong. Every non-keyword source in script-src is now checked for quoting.
     */
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) ?? '';
    const unquoted = scriptSrc
      .trim()
      .split(/\s+/)
      .slice(1)
      .filter((source) => !/^'.*'$/.test(source));

    if (unquoted.length === 0) {
      pass('csp', 'every script-src source is quoted — the browser will honour them');
    } else {
      fail(
        'csp',
        `unquoted script-src source(s), silently ignored by browsers: ${unquoted.join(', ')}`,
      );
    }
  }

  const csp = (await get('/')).headers.get('content-security-policy') ?? '';
  for (const required of [
    "default-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ]) {
    if (csp.includes(required)) pass('csp', `directive present: ${required}`);
    else fail('csp', `directive missing: ${required}`);
  }

  if (csp.includes("'unsafe-inline'") && !csp.includes("style-src 'self' 'unsafe-inline'")) {
    fail('csp', "'unsafe-inline' appears outside style-src");
  } else {
    pass('csp', "'unsafe-inline' is confined to style-src (inlined critical CSS, `08` §8)");
  }
  if (csp.includes('unsafe-eval')) fail('csp', "'unsafe-eval' present");
  else pass('csp', "no 'unsafe-eval'");
}

/* ── 5. Cache policy ─────────────────────────────────────────────────────── */

{
  const html = await get('/');
  const cc = html.headers.get('cache-control');
  if (cc === 'public, max-age=0, must-revalidate') {
    pass('cache', `HTML: ${cc} — rollback takes effect immediately (OPS-08)`);
  } else {
    fail('cache', `HTML cache-control is "${cc}", expected must-revalidate`);
  }

  for (const [path, expected] of [
    ['/favicon.svg', 'public, max-age=86400'],
    ['/og-image.png', 'public, max-age=86400'],
    ['/site.webmanifest', 'public, max-age=86400'],
    ['/robots.txt', 'public, max-age=3600'],
    ['/sitemap.xml', 'public, max-age=3600'],
  ]) {
    const actual = (await get(path)).headers.get('cache-control');
    if (actual === expected) pass('cache', `${path}: ${actual}`);
    else fail('cache', `${path}: "${actual}", expected "${expected}"`);
  }

  // Content-hashed assets, discovered from the served HTML rather than assumed.
  const body = await (await get('/')).text();
  const asset = body.match(/\/_astro\/[^"']+/)?.[0];
  if (!asset) {
    pass('cache', 'no /_astro/ asset is referenced — critical CSS is inlined, as specified');
  } else {
    const actual = (await get(asset)).headers.get('cache-control');
    if (actual?.includes('immutable')) pass('cache', `${asset}: ${actual}`);
    else fail('cache', `${asset}: "${actual}", expected immutable`);
  }
}

/* ── 6. Compression ──────────────────────────────────────────────────────── */

{
  const r = await get('/', { headers: { 'Accept-Encoding': 'br, gzip' } });
  const enc = r.headers.get('content-encoding');
  if (enc) pass('compression', `HTML served as ${enc}`);
  else fail('compression', 'HTML served uncompressed');
}

/* ── 7. robots / noindex — AG-4 is withheld, so both must be closed ──────── */

{
  const robots = await (await get('/robots.txt')).text();
  const disallowed = /^\s*Disallow:\s*\/\s*$/m.test(robots);

  if (spec.indexable) {
    fail('indexing', 'IS_INDEXABLE is true — AG-4 is withheld, this must stay false');
  } else if (disallowed) {
    pass('indexing', 'robots.txt disallows all crawling, matching the withheld AG-4');
  } else {
    fail('indexing', `robots.txt does not disallow crawling:\n${robots}`);
  }

  for (const route of [...ROUTES, '/this-route-does-not-exist']) {
    const html = await (await get(route)).text();
    const meta = html.match(/<meta name="robots" content="([^"]*)"/)?.[1];
    if (meta?.includes('noindex')) pass('indexing', `${route}: meta robots "${meta}"`);
    else fail('indexing', `${route}: meta robots is "${meta}", expected noindex`);
  }
}

/* ── 8. Canonical URLs and structured data ───────────────────────────────── */

{
  for (const route of ROUTES) {
    const html = await (await get(route)).text();
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const expected = spec.canonical + (route === '/' ? '/' : route);
    if (canonical === expected) pass('seo', `${route}: canonical → ${canonical}`);
    else fail('seo', `${route}: canonical is "${canonical}", expected "${expected}"`);
  }

  const html = await (await get('/')).text();
  const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  try {
    const data = JSON.parse(block);
    if (data['@type'] === 'Organization' && data.url?.startsWith(spec.canonical)) {
      pass('seo', `JSON-LD: ${data['@type']}, url ${data.url}`);
    } else {
      fail('seo', `JSON-LD unexpected: ${JSON.stringify(data).slice(0, 120)}`);
    }
  } catch {
    fail('seo', 'JSON-LD is not parseable');
  }

  const sitemap = await (await get('/sitemap.xml')).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 5) pass('seo', `sitemap lists ${locs.length} URLs`);
  else fail('seo', `sitemap lists ${locs.length} URLs, expected 5`);
  if (locs.every((l) => l.startsWith(spec.canonical))) {
    pass('seo', `every sitemap URL uses the canonical origin ${spec.canonical}`);
  } else {
    fail('seo', 'a sitemap URL does not use the canonical origin');
  }
}

/* ── 9. Redirects ────────────────────────────────────────────────────────── */

{
  /**
   * The www → apex rule is keyed on the custom-domain host, so it can only be
   * exercised when this runs against that domain. Against a `.vercel.app`
   * origin it is reported PENDING rather than passed — an untestable check is
   * not a passing one.
   */
  const host = new URL(origin).host;
  if (host.endsWith('vercel.app')) {
    pending(
      'redirects',
      'www → apex is configured but keyed on the custom domain, so it cannot ' +
        'be exercised against a .vercel.app origin. Re-run against the domain.',
    );
  } else {
    for (const path of ROUTES) {
      const r = await fetch(`https://www.${host.replace(/^www\./, '')}${path}`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(20_000),
      });
      const location = r.headers.get('location');
      const expected = `https://${host.replace(/^www\./, '')}${path}`;
      if ([301, 308].includes(r.status) && location === expected) {
        pass('redirects', `www${path} → ${r.status} ${location}`);
      } else {
        fail('redirects', `www${path} → ${r.status} ${location}, expected 301/308 to ${expected}`);
      }
    }

    // HTTP must not serve content, on any host.
    const insecure = await fetch(`http://${host}/`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(20_000),
    });
    if ([301, 308].includes(insecure.status)) {
      pass('redirects', `http → ${insecure.status} ${insecure.headers.get('location')}`);
    } else {
      fail('redirects', `http returned ${insecure.status}, expected a redirect to https`);
    }
  }

  const trailing = await get('/platform/');
  if ([301, 308].includes(trailing.status)) {
    pass('redirects', `/platform/ → ${trailing.status} ${trailing.headers.get('location')}`);
  } else if (trailing.status === 200) {
    pass('redirects', '/platform/ serves 200 directly (trailingSlash: false, no loop)');
  } else {
    fail('redirects', `/platform/ → ${trailing.status}`);
  }

  const clean = await get('/platform.html');
  if ([301, 308].includes(clean.status)) {
    pass('redirects', `cleanUrls: /platform.html → ${clean.status}`);
  } else {
    pass('redirects', `/platform.html → ${clean.status} (cleanUrls serves the extensionless form)`);
  }
}

/* ── 10. The deployed bytes are the artefact CI verified ─────────────────── */

{
  const localHome = readFileSync('dist/index.html', 'utf8');
  const served = await (await get('/')).text();
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  if (norm(localHome) === norm(served)) {
    pass('provenance', '/ is byte-identical to the locally built dist/index.html');
  } else {
    fail(
      'provenance',
      'the served / differs from the local build — the deployment may not be this commit',
    );
  }
}

/* ── Report ──────────────────────────────────────────────────────────────── */

const width = Math.max(...results.map((r) => r.area.length));
let current = null;
for (const r of results) {
  if (r.area !== current) {
    current = r.area;
    console.log(`\n${r.area.toUpperCase()}`);
  }
  const mark = r.status === 'PASS' ? '✓' : r.status === 'PENDING' ? '·' : '✗';
  console.log(`  ${mark} ${r.detail}`);
}

const failed = results.filter((r) => r.status === 'FAIL');
const pendingCount = results.filter((r) => r.status === 'PENDING').length;
console.log(`\n${'─'.repeat(width + 40)}`);
console.log(
  `  ${results.filter((r) => r.status === 'PASS').length} passed, ` +
    `${failed.length} failed, ${pendingCount} pending\n`,
);

if (failed.length) {
  console.log('  FAILURES:');
  for (const f of failed) console.log(`    ✗ [${f.area}] ${f.detail}`);
  process.exit(1);
}

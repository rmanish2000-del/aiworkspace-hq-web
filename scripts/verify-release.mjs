/**
 * verify-release.mjs — every non-deployment release check, in one command.
 *
 *   npm run verify:release
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ THIS VERIFIES A RELEASE CANDIDATE. IT DOES NOT RELEASE ANYTHING.          │
 * │                                                                           │
 * │ No credential, no network dependency beyond the local preview server, no  │
 * │ vendor, no deployment. It can run on a clean checkout with no             │
 * │ configuration.                                                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Ordering is deliberate: cheapest and most localising first, so a failure
 * points at the smallest possible cause. A type error should surface in
 * seconds, not after a four-minute browser matrix.
 *
 * It stops at the FIRST material failure. A release verification that keeps
 * going produces a wall of consequential errors and buries the real one.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const started = Date.now();
const results = [];

function run(label, command, { optional = false } = {}) {
  process.stdout.write(`\n▶ ${label}\n`);
  const at = Date.now();
  try {
    execSync(command, { stdio: 'inherit', env: { ...process.env, FORCE_COLOR: '1' } });
    results.push({ label, status: 'pass', ms: Date.now() - at });
  } catch {
    results.push({ label, status: optional ? 'skipped' : 'FAIL', ms: Date.now() - at });
    if (!optional) finish(1);
  }
}

function check(label, fn) {
  process.stdout.write(`\n▶ ${label}\n`);
  const at = Date.now();
  try {
    const detail = fn();
    results.push({ label, status: 'pass', ms: Date.now() - at });
    if (detail) console.log(`  ${detail}`);
  } catch (error) {
    results.push({ label, status: 'FAIL', ms: Date.now() - at });
    console.error(`  ${error.message}`);
    finish(1);
  }
}

function finish(code) {
  const width = Math.max(...results.map((r) => r.label.length), 10);
  console.log(`\n${'─'.repeat(width + 20)}`);
  for (const r of results) {
    const mark = r.status === 'pass' ? '✓' : r.status === 'skipped' ? '–' : '✗';
    console.log(`  ${mark} ${r.label.padEnd(width)}  ${String(r.ms).padStart(6)} ms`);
  }
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`${'─'.repeat(width + 20)}`);
  console.log(
    `  ${results.filter((r) => r.status === 'pass').length} passed, ${failed} failed` +
      `, ${results.filter((r) => r.status === 'skipped').length} skipped` +
      `  (${((Date.now() - started) / 1000).toFixed(1)}s total)\n`,
  );
  if (code === 0) {
    console.log('  RELEASE CANDIDATE VERIFIED — locally. This is not production evidence,');
    console.log(
      '  and it authorizes no deployment. See docs/reviews/release-candidate-report.md.\n',
    );
  }
  process.exit(code);
}

/* -------------------------------------------------------------------------- */
/* 1. Static analysis — cheapest first                                        */
/* -------------------------------------------------------------------------- */

check('the running Node version satisfies the pin', () => {
  /**
   * `npm ci` only WARNS when the runtime is below the `engines` floor, so a
   * clean install can succeed on an unsupported version and nobody notices —
   * which is exactly what happened during the P1-M clean run (v22.14.0 against
   * a `>=22.22.3` floor). Verification evidence produced on the wrong runtime
   * is weaker than it looks, so this says so out loud.
   *
   * Hard failure in CI, where the runtime comes from `.nvmrc` and there is no
   * excuse. A warning locally, because blocking every developer whose Node is
   * a patch behind would push people to stop running this at all.
   */
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const range = pkg.engines?.node ?? '';
  const pinned = existsSync('.nvmrc') ? readFileSync('.nvmrc', 'utf8').trim() : null;
  const actual = process.versions.node;

  const floor = range.match(/>=\s*(\d+)\.(\d+)\.(\d+)/);
  if (!floor) return `no floor declared; running ${actual}`;

  const asNumbers = (v) => v.split('.').map(Number);
  const [major, minor, patch] = asNumbers(actual);
  const wanted = [Number(floor[1]), Number(floor[2]), Number(floor[3])];
  const below =
    major < wanted[0] ||
    (major === wanted[0] && minor < wanted[1]) ||
    (major === wanted[0] && minor === wanted[1] && patch < wanted[2]);

  if (!below) return `${actual} satisfies ${range}${pinned ? ` (.nvmrc ${pinned})` : ''}`;

  const message = `Node ${actual} is below the ${range} floor${pinned ? `; .nvmrc pins ${pinned}` : ''}`;
  if (process.env.CI) throw new Error(message);

  console.log(`  ⚠ ${message}`);
  console.log('    Everything may still pass, but this is not the pinned runtime.');
  return `${actual} — BELOW the pin, see warning above`;
});

run('format', 'npm run format:check');
run('lint', 'npm run lint');
run('types', 'npm run check:types');

/* -------------------------------------------------------------------------- */
/* 2. Unit tests — copy gates, tokens, design system, production config       */
/* -------------------------------------------------------------------------- */

run('unit tests', 'npm run test:unit');

/* -------------------------------------------------------------------------- */
/* 3. Build                                                                   */
/* -------------------------------------------------------------------------- */

run('build', 'npm run build');
run('html validity', 'npm run test:html');

/**
 * The host configuration is generated from `src/lib/production.ts`, because
 * Vercel reads `vercel.json` before the build runs and it is therefore the one
 * place the `08` §9.2 headers and `08` §8 cache policy could drift away from
 * the module the unit tests assert against.
 *
 * This gate runs after the build because the CSP hash is computed over the
 * JSON-LD bytes in `dist/index.html` — the actual served bytes, not a copy.
 */
run('vercel.json matches the spec modules', 'node scripts/generate-vercel-json.mjs --check');

/* -------------------------------------------------------------------------- */
/* 4. Built-output invariants — the things that must never ship               */
/* -------------------------------------------------------------------------- */

const DIST = 'dist';

const htmlFiles = () =>
  readdirSync(DIST, { recursive: true })
    .filter((f) => String(f).endsWith('.html'))
    .map((f) => join(DIST, String(f)));

check('build output exists', () => {
  if (!existsSync(DIST)) throw new Error('dist/ is missing — the build did not run');
  const files = htmlFiles();
  if (files.length !== 15) {
    throw new Error(`expected 15 route documents, found ${files.length}`);
  }
  return `${files.length} routes built`;
});

check('no build-time placeholder reaches output', () => {
  const leaks = [];
  for (const file of htmlFiles()) {
    const matches = readFileSync(file, 'utf8').match(/\{\{[^}]+\}\}/g);
    if (matches) leaks.push(`${file}: ${[...new Set(matches)].join(', ')}`);
  }
  if (leaks.length) throw new Error(leaks.join('\n  '));
  return 'none';
});

check('no [LEGAL] review marker reaches output', () => {
  const leaks = htmlFiles().filter((f) => readFileSync(f, 'utf8').includes('[LEGAL'));
  if (leaks.length) throw new Error(`markers in ${leaks.join(', ')}`);
  return 'none';
});

check('no superseded copy reaches output', () => {
  // P1-J §10 replaced the `04` §11 404 string; it must appear nowhere.
  const stale = 'There is only one page here at the moment';
  const leaks = htmlFiles().filter((f) => readFileSync(f, 'utf8').includes(stale));
  if (leaks.length) throw new Error(`superseded 404 string in ${leaks.join(', ')}`);
  return 'none';
});

check('no internal comment reaches output', () => {
  // Template comments once carried placeholder names into /privacy.
  const withComments = htmlFiles().filter((f) => readFileSync(f, 'utf8').includes('<!--'));
  if (withComments.length) throw new Error(`HTML comments in ${withComments.join(', ')}`);
  return 'none';
});

check('no client JavaScript ships', () => {
  const js = readdirSync(DIST, { recursive: true }).filter((f) => String(f).endsWith('.js'));
  if (js.length) throw new Error(`${js.length} script file(s) in dist/`);

  for (const file of htmlFiles()) {
    const scripts = [...readFileSync(file, 'utf8').matchAll(/<script([^>]*)>/g)].map((m) => m[1]);
    const executable = scripts.filter((attrs) => !attrs.includes('application/ld+json'));
    if (executable.length) throw new Error(`${file} has ${executable.length} executable script(s)`);
  }
  return '0 bytes';
});

check('no web font ships', () => {
  const fonts = readdirSync(DIST, { recursive: true }).filter((f) =>
    /\.(woff2?|ttf|otf)$/.test(String(f)),
  );
  if (fonts.length) throw new Error(`${fonts.length} font file(s) in dist/`);
  return '0 files';
});

check('transfer budget holds on every route', () => {
  // `08` §8: <=60 KB gzipped, target <=35 KB.
  const report = [];
  for (const file of htmlFiles()) {
    const gz = gzipSync(readFileSync(file)).length;
    if (gz > 60 * 1024) throw new Error(`${file} is ${gz} B gzipped, over the 60 KB budget`);
    if (gz > 35 * 1024) throw new Error(`${file} is ${gz} B gzipped, over the 35 KB target`);
    report.push(`${file.replace(`${DIST}/`, '')} ${(gz / 1024).toFixed(1)}KB`);
  }
  return report.join(' · ');
});

check('robots.txt and the noindex meta tag agree', () => {
  // `08` SEO-10 names indexing mistakes in BOTH directions as the common
  // failure. One constant drives both; this proves they did not diverge.
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');

  const disallowed = robots.includes('Disallow: /');
  const noindexed = /name="robots" content="[^"]*noindex/.test(home);

  if (disallowed !== noindexed) {
    throw new Error(
      `robots.txt ${disallowed ? 'disallows' : 'allows'} crawling but the page is ` +
        `${noindexed ? 'noindex' : 'indexable'} — these must agree`,
    );
  }
  return disallowed ? 'both closed (non-production)' : 'both open (production)';
});

check('the sitemap lists exactly the indexable routes', () => {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  // AIWHQ-CODEX-BTFDR-005 extends the indexable set with the product family.
  if (locs.length !== 8) throw new Error(`expected 8 URLs, found ${locs.length}`);
  for (const forbidden of ['/404', '/docs', '/research']) {
    if (xml.includes(forbidden)) throw new Error(`sitemap contains ${forbidden}`);
  }
  return `${locs.length} URLs`;
});

check('deferred files are not emitted', () => {
  const deferred = ['.well-known/security.txt', 'humans.txt', 'feed.xml', 'rss.xml'];
  const emitted = deferred.filter((f) => existsSync(join(DIST, f)));
  if (emitted.length) throw new Error(`${emitted.join(', ')} emitted but still blocked`);
  return 'all absent';
});

check('static assets are present and non-empty', () => {
  const assets = [
    'favicon.svg',
    'favicon.ico',
    'apple-touch-icon.png',
    'og-image.png',
    'site.webmanifest',
    'browserconfig.xml',
    'robots.txt',
    'sitemap.xml',
  ];
  for (const asset of assets) {
    const path = join(DIST, asset);
    if (!existsSync(path)) throw new Error(`${asset} is missing`);
    if (statSync(path).size === 0) throw new Error(`${asset} is empty`);
  }

  // `04` §8 — the social card must stay 1200x630.
  const png = readFileSync(join(DIST, 'og-image.png'));
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== 1200 || height !== 630) {
    throw new Error(`og-image.png is ${width}x${height}, expected 1200x630`);
  }

  return `${assets.length} assets`;
});

check('no unapproved brand mark in any asset', () => {
  // P-15. The favicon must stay a plain glyph; the social card must stay type.
  const favicon = readFileSync(join(DIST, 'favicon.svg'), 'utf8');
  if (/<text|<tspan|font-family/i.test(favicon)) {
    throw new Error('favicon.svg contains a letterform — P-15 blocks a monogram');
  }

  const card = readFileSync(join(DIST, 'og-image.svg'), 'utf8');
  if (/<image\b|xlink:href/i.test(card)) {
    throw new Error('og-image.svg embeds a raster — it must stay type only');
  }
  if (/[™®]/.test(card)) throw new Error('og-image.svg contains a trademark symbol — P-15');

  return 'favicon glyph-only, card type-only';
});

check('the CSP hash covers the JSON-LD actually served', () => {
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const block = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!block) throw new Error('no JSON-LD block found on /');

  const data = JSON.parse(block);
  if (data['@type'] !== 'Organization') throw new Error('JSON-LD is not an Organization');
  if (data.logo) throw new Error('JSON-LD carries a logo — P-15 blocks brand assets');

  // Recompute the way src/lib/structured-data.ts does and compare byte for byte.
  const expected = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Workspace',
    url: 'https://aiworkspacehq.com/',
    description: data.description,
  });
  if (expected !== block) {
    throw new Error('the served JSON-LD does not match the serialisation the CSP hash uses');
  }
  return 'byte-identical';
});

/* -------------------------------------------------------------------------- */
/* 4a. Design-system gates — CC-004 §9 via CC-005                             */
/*                                                                            */
/* Recomputes the 38-pair contrast table from the token file, verifies        */
/* gradient worst-stops (veil composited), asserts the reduced-motion build   */
/* carries zero transform transitions, holds the CC-004 budgets on the built  */
/* gallery, re-checks zero fonts, checks tier-token resolution, and asserts   */
/* the holding page is byte-identical to the recorded DS-D2 baseline with no  */
/* gallery artifact in dist/.                                                 */
/* -------------------------------------------------------------------------- */

run('design-system gates (CC-004 §9)', 'npm run ds:gates');

/* -------------------------------------------------------------------------- */
/* 4b. G-C13 — C-13 verified, not asserted (CC-006)                           */
/*                                                                            */
/* Zero cookies and zero client storage beyond DS-D1's single `theme` key,    */
/* empty sessionStorage/indexedDB/CacheStorage, zero third-party origins and  */
/* no Set-Cookie header — on every route and on the gallery, on load and      */
/* after a full interaction pass. The same spec also runs inside the browser  */
/* matrix; this named gate keeps its result visible on its own line.          */
/* -------------------------------------------------------------------------- */

run(
  'C-13 verification (G-C13)',
  'npx playwright test tests/e2e/c13-verification.spec.ts --project=chromium-light --project=chromium-dark',
);

/* -------------------------------------------------------------------------- */
/* 4c. G-LEDGER — every rendered public string traces to the claims ledger    */
/* (CC-008): orphan strings fail, G-4 runs over the ledger files, withheld    */
/* blocks stay withheld, negative claims stay dated (T-3).                    */
/* -------------------------------------------------------------------------- */

run('claim-ledger gate (G-LEDGER)', 'node scripts/ledger-gate.mjs');

/* -------------------------------------------------------------------------- */
/* 5. Browser matrix — accessibility, routes, viewports, three engines        */
/* -------------------------------------------------------------------------- */

/**
 * P1-M §3 requires all three engines. An engine that will not launch must be
 * reported by name, never quietly dropped and never allowed to masquerade as a
 * pass — so each is probed first.
 *
 * In CI a missing engine is a hard failure: the Ubuntu runner installs all
 * three and there is no excuse for one being absent. Locally it is reported as
 * a stated limitation, because a developer machine can legitimately lack one
 * and blocking the whole release verification on that would push people to stop
 * running it at all.
 */
const ENGINES = ['chromium', 'firefox', 'webkit'];
const unavailable = [];

check('every browser engine launches', () => {
  for (const engine of ENGINES) {
    try {
      execSync(`node -e "require('playwright-core').${engine}.launch().then(b=>b.close())"`, {
        stdio: 'pipe',
      });
    } catch (error) {
      /**
       * Pull out the line that actually says what went wrong. Playwright's
       * stderr opens with Node's uncaught-exception preamble and closes with a
       * dumped error object, so a naive "first line containing Error" returns
       * `name: 'Error'` — which tells a reader nothing, and naming the reason
       * is the entire point of this gate.
       */
      const lines = String(error.stderr ?? error.message)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const reason =
        lines.find((line) => /^(browserType|browserContext)\.\w+:/.test(line)) ??
        lines.find((line) =>
          /spawn|ENOENT|Executable doesn't exist|missing dependencies/i.test(line),
        ) ??
        lines.find((line) => /^\w*Error:/.test(line));

      unavailable.push({ engine, reason: reason ?? 'unknown launch failure' });
    }
  }

  if (unavailable.length === 0) return `${ENGINES.length}/3 available`;

  const detail = unavailable.map((u) => `${u.engine}: ${u.reason}`).join('; ');
  if (process.env.CI) throw new Error(`engine(s) unavailable in CI — ${detail}`);

  console.log(`  ⚠ NOT ALL ENGINES RAN. ${detail}`);
  console.log('    Recorded in docs/reviews/known-limitations.md. CI covers all three.');
  return `${ENGINES.length - unavailable.length}/3 available — see warning above`;
});

/** Which playwright.config.ts projects each engine owns. */
const PROJECTS = {
  chromium: ['chromium-light', 'chromium-dark', 'chromium-mobile'],
  firefox: ['firefox', 'firefox-dark'],
  webkit: ['webkit', 'webkit-dark'],
};

const runnable = ENGINES.filter((e) => !unavailable.some((u) => u.engine === e));

run(
  `browser matrix (${runnable.join(', ')})`,
  unavailable.length === 0
    ? 'npm run test:e2e'
    : `npx playwright test ${runnable
        .flatMap((e) => PROJECTS[e])
        .map((p) => `--project=${p}`)
        .join(' ')}`,
);

/* -------------------------------------------------------------------------- */
/* 6. Performance                                                             */
/* -------------------------------------------------------------------------- */

run('lighthouse (local baseline)', 'npm run test:lighthouse');

/* -------------------------------------------------------------------------- */
/* 7. Supply chain                                                            */
/* -------------------------------------------------------------------------- */

run('dependency audit', 'npm run audit:deps');

check('the lockfile is committed and in step with package.json', () => {
  if (!existsSync('package-lock.json')) throw new Error('package-lock.json is missing');
  // `npm ci` fails if the lockfile disagrees with package.json, so a successful
  // clean install is the real proof; this catches the obvious omission.
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  if (lock.version !== pkg.version) {
    throw new Error(`lockfile version ${lock.version} != package.json ${pkg.version}`);
  }
  return `v${pkg.version}`;
});

check('no secret-bearing variable has a value in .env.example', () => {
  const example = readFileSync('.env.example', 'utf8');
  const assigned = example
    .split('\n')
    .filter((line) => /^[A-Z][A-Z0-9_]*=\s*\S/.test(line))
    .map((line) => line.split('=')[0]);
  if (assigned.length) throw new Error(`values assigned to ${assigned.join(', ')}`);
  return 'all empty';
});

finish(0);

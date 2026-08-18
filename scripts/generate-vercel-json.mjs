/**
 * generate-vercel-json.mjs — emit `vercel.json` from the specification modules.
 *
 *   node scripts/generate-vercel-json.mjs           # write
 *   node scripts/generate-vercel-json.mjs --check   # verify, exit 1 on drift
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS IS GENERATED RATHER THAN HAND-WRITTEN                            │
 * │                                                                           │
 * │ Vercel reads `vercel.json` from the repository root before the build      │
 * │ runs, so it cannot be produced by the build. That makes it the one place  │
 * │ where the `08` §9.2 headers and the `08` §8 cache policy could silently   │
 * │ drift away from `src/lib/production.ts`, which is the specification's     │
 * │ machine-readable form and what the unit tests assert against.             │
 * │                                                                           │
 * │ So it is generated from that module, and `--check` runs as a release      │
 * │ gate. Editing `vercel.json` by hand fails the gate; change                │
 * │ `production.ts` and regenerate.                                           │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * TDR-03 signed the hosting platform as Vercel Pro (founder override, P2-A.1),
 * which is what makes emitting a vendor-specific file legitimate. Before that
 * signature the policy was deliberately held host-agnostic.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import esbuild from 'esbuild';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'vercel.json';

/* -------------------------------------------------------------------------- */
/* The inline JSON-LD hash — read from the build, never guessed               */
/* -------------------------------------------------------------------------- */

function jsonLdHash() {
  if (!existsSync('dist/index.html')) {
    throw new Error('dist/index.html is missing — run `npm run build` first');
  }
  const home = readFileSync('dist/index.html', 'utf8');
  const block = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!block) throw new Error('no JSON-LD block found in dist/index.html');
  return `sha256-${createHash('sha256').update(block, 'utf8').digest('base64')}`;
}

/* -------------------------------------------------------------------------- */
/* Load the specification module (TypeScript) via a throwaway transpile        */
/* -------------------------------------------------------------------------- */

function loadProduction(hash) {
  /**
   * `securityHeaders()` lives in TypeScript; rather than duplicate its values
   * here — which is precisely the drift this script exists to prevent — the
   * module is bundled and executed, and the result read back.
   *
   * esbuild rather than Node's `--experimental-strip-types`: `production.ts`
   * imports `./site` without a file extension, which type-stripping cannot
   * resolve under ESM. esbuild resolves it the same way the real build does,
   * so this evaluates the identical code the site ships.
   */
  const bundle = esbuild.buildSync({
    stdin: {
      contents: `
        import { securityHeaders, checkoutSecurityHeaders } from './src/lib/production';
        process.stdout.write(JSON.stringify({
          site: securityHeaders(${JSON.stringify([hash])}),
          checkout: checkoutSecurityHeaders(),
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

  const out = execFileSync(process.execPath, ['-e', bundle.outputFiles[0].text], {
    encoding: 'utf8',
  });
  return JSON.parse(out);
}

/* -------------------------------------------------------------------------- */
/* Build the configuration                                                    */
/* -------------------------------------------------------------------------- */

/**
 * @param {{ prebuilt?: boolean }} options
 *   `prebuilt: true` omits the build settings, for deploying an already-built
 *   `dist/` directly. Same headers, same redirects, same single source — only
 *   the build instructions differ, because there is nothing left to build.
 *   Used by `--prebuilt` so a direct upload cannot drift from the committed
 *   configuration in the parts that actually reach a visitor.
 */
function build({ prebuilt = false } = {}) {
  const hash = jsonLdHash();
  const production = loadProduction(hash);
  const headers = production.site.map(({ name, value }) => ({ key: name, value }));
  const checkoutHeaders = production.checkout.map(({ name, value }) => ({ key: name, value }));

  /**
   * The Warrant demo console is proxied under /warrant (see `rewrites` below).
   * Its page carries an inline module script and same-origin fetches that this
   * site's CSP would block, so the CSP — and only the CSP — is scoped off the
   * /warrant subtree. Every other security header still applies there, and
   * every header still applies everywhere else. `production.ts` stays the
   * single source of the header VALUES; this is a routing-scope decision, so
   * it lives with the routes.
   */
  const cspHeaders = headers.filter(({ key }) => key === 'Content-Security-Policy');
  const nonCspHeaders = headers.filter(({ key }) => key !== 'Content-Security-Policy');

  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',

    ...(prebuilt
      ? {}
      : {
          // Astro emits a fully static site; Vercel must serve it, not rebuild it.
          framework: 'astro',
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          installCommand: 'npm ci',
        }),

    // `04` §11 — the 404 document is a real route, not a rewrite target.
    cleanUrls: true,
    trailingSlash: false,

    headers: [
      // `08` §9.2 — every security header except the CSP, on every response.
      { source: '/(.*)', headers: nonCspHeaders },

      // The CSP everywhere EXCEPT the proxied /warrant subtree and the single
      // /checkout payment surface (R4-CHECKOUT). /warranty-style paths still
      // get it. The console's own deployment governs its content; /checkout
      // gets its OWN stricter-than-nothing policy below.
      { source: '/((?!warrant/|warrant$|checkout$).*)', headers: cspHeaders },

      // R4-CHECKOUT (2026-08-18): the payment surface's own CSP + payment=(self)
      // Permissions-Policy — Razorpay's checkout origins and nothing more.
      // Values come from checkoutSecurityHeaders() in production.ts.
      {
        source: '/checkout',
        headers: checkoutHeaders.filter(
          ({ key }) => key === 'Content-Security-Policy' || key === 'Permissions-Policy',
        ),
      },

      // `08` §8 / OPS-08 — HTML must revalidate so a rollback takes effect at
      // once. A long-lived document cache would keep serving the rolled-back
      // page from the edge and from every visitor's browser.
      {
        source: '/((?!_astro/).*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },

      // Content-hashed assets: the filename changes when the bytes change, so
      // the response can never be wrong.
      {
        source: '/_astro/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },

      // Not content-hashed. A long cache would pin a stale icon; one day is
      // long enough to matter and short enough to fix.
      {
        source:
          '/(favicon.svg|favicon.ico|apple-touch-icon.png|og-image.png|og-image.svg|site.webmanifest|browserconfig.xml)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },

      // Crawler-facing. An hour bounds how long a stale directive survives a
      // correction — which matters while the site is deliberately `noindex`.
      {
        source: '/(robots.txt|sitemap.xml)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
      },
    ],

    /**
     * The Warrant demo console — a separate deployment, proxied under
     * /warrant. The page URL is /warrant/console, deliberately slash-free:
     * `trailingSlash: false` 308-strips a bare `/warrant/`, so a
     * trailing-slash page URL cannot exist on this site, and the console's
     * relative `api/…` and module URLs need a path segment after /warrant/ to
     * resolve into the proxied subtree. The catch-all rewrite then carries
     * those subpaths to the console's own deployment.
     */
    rewrites: [
      { source: '/warrant/console', destination: 'https://warrant-t1bh.onrender.com/' },
      { source: '/warrant/:path*', destination: 'https://warrant-t1bh.onrender.com/:path*' },
    ],

    // `08` SEO-06 — one canonical host. www redirects to the apex permanently,
    // matching CANONICAL_ORIGIN in src/lib/site.ts.
    redirects: [
      // The advertised /warrant lands on the console's page URL. Temporary,
      // so the demo's post-event removal does not leave a cached permanent
      // redirect behind.
      { source: '/warrant', destination: '/warrant/console', permanent: false },

      // Founder ruling 2026-08-13 (UNIFY-LEGAL-SURFACE): ROOT is canonical for
      // all six legal routes — one domain, one entity, one tree. The former
      // /warrant-guardian/* mounts redirect back so links minted under the
      // Option A remount keep resolving. Temporary, like /warrant, so any
      // future re-mount is not fighting cached permanents.
      { source: '/warrant-guardian/terms', destination: '/terms', permanent: false },
      { source: '/warrant-guardian/refunds', destination: '/refunds', permanent: false },
      { source: '/warrant-guardian/delivery', destination: '/delivery', permanent: false },
      { source: '/warrant-guardian/privacy', destination: '/privacy', permanent: false },
      { source: '/warrant-guardian/contact', destination: '/contact', permanent: false },
      { source: '/warrant-guardian/about', destination: '/about', permanent: false },
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'www.aiworkspacehq.com' }],
        destination: 'https://aiworkspacehq.com/$1',
        permanent: true,
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */

const prebuilt = process.argv.includes('--prebuilt');
const generated = `${JSON.stringify(build({ prebuilt }), null, 2)}\n`;

if (prebuilt) {
  // Written to stdout, never to the repository: the committed vercel.json is
  // the git-connected one. This variant exists only so a direct upload of an
  // already-built dist/ carries byte-identical headers and redirects.
  process.stdout.write(generated);
  process.exit(0);
}

if (process.argv.includes('--check')) {
  if (!existsSync(OUT)) {
    console.error(`${OUT} is missing. Run: node scripts/generate-vercel-json.mjs`);
    process.exit(1);
  }
  const current = readFileSync(OUT, 'utf8');
  if (current !== generated) {
    console.error(
      `${OUT} has drifted from src/lib/production.ts.\n` +
        '  Do not edit it by hand — change production.ts and regenerate:\n' +
        '    node scripts/generate-vercel-json.mjs',
    );
    process.exit(1);
  }
  console.log(`${OUT} matches src/lib/production.ts`);
} else {
  writeFileSync(OUT, generated);
  console.log(`wrote ${OUT}`);
}

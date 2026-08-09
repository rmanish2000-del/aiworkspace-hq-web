import { gzipSync } from 'node:zlib';

import { expect, test } from '@playwright/test';

import { organizationJsonLd } from '../../src/lib/structured-data';

/**
 * Production support files, served and correct.
 *
 * The unit suite asserts what the generators produce; this asserts what the
 * built site actually serves, which is the thing a crawler or a browser sees.
 */

const ROUTES = [
  '/',
  '/trust',
  '/technology',
  '/what-we-havent-built',
  '/enterprise',
  '/security',
  '/platform',
  '/products',
  '/products/warrant',
  '/products/warrant-mcp',
  '/principles',
  '/about',
  '/contact',
  '/privacy',
  '/404',
] as const;

/* -------------------------------------------------------------------------- */
/* Crawler-facing files                                                       */
/* -------------------------------------------------------------------------- */

test('robots.txt permits crawling and points at the sitemap', async ({ request }) => {
  // P2-E: AG-4 granted. robots.txt and the per-route meta tag are generated
  // from one constant, so they cannot disagree — which is the SEO-10 failure.
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/plain');

  const body = await res.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Allow: /');
  expect(body).not.toMatch(/^\s*Disallow:\s*\/\s*$/m);
  expect(body).toContain('Sitemap: https://aiworkspacehq.com/sitemap.xml');
});

test('the deferred files are not served', async ({ request }) => {
  // Each is scaffolded in src/lib/deferred-static.ts and blocked on a named
  // item. Serving any of them would publish something nobody approved.
  for (const url of ['/.well-known/security.txt', '/humans.txt', '/feed.xml', '/rss.xml']) {
    const res = await request.get(url);
    expect(res.status(), `${url} is being served but is still blocked`).toBe(404);
  }
});

/* -------------------------------------------------------------------------- */
/* Static asset integrity                                                     */
/* -------------------------------------------------------------------------- */

test('every icon and manifest asset is served with the right type', async ({ request }) => {
  const assets: Array<[string, string]> = [
    ['/favicon.svg', 'svg'],
    ['/favicon.ico', ''],
    ['/apple-touch-icon.png', 'png'],
    ['/og-image.png', 'png'],
    ['/site.webmanifest', ''],
    ['/browserconfig.xml', 'xml'],
  ];

  for (const [url, typeFragment] of assets) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    if (typeFragment) {
      expect(res.headers()['content-type'], url).toContain(typeFragment);
    }
    expect((await res.body()).length, `${url} is empty`).toBeGreaterThan(0);
  }
});

test('the social card is exactly 1200x630 and carries no mark', async ({ request }) => {
  // `04` §8. The dimensions matter: a card of the wrong aspect ratio is
  // cropped unpredictably by each platform.
  const png = await (await request.get('/og-image.png')).body();

  // PNG IHDR: width and height are big-endian uint32 at offsets 16 and 20.
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);

  // The SVG source must stay type-only — no embedded raster, no logo path.
  const svg = await (await request.get('/og-image.svg')).text();
  expect(svg).not.toMatch(/<image\b/i);
  expect(svg).not.toMatch(/xlink:href/i);
  expect(svg).toContain('AI Workspace');
  expect(svg).toContain('ENTERPRISE AI OPERATING LAYER');
});

test('the favicon carries no letterform, monogram, or wordmark', async ({ request }) => {
  // P-15 — unchanged from P1-H, re-asserted now that the set has grown.
  const svg = await (await request.get('/favicon.svg')).text();
  expect(svg).not.toMatch(/<text\b/i);
  expect(svg).not.toMatch(/<tspan\b/i);
  expect(svg).not.toMatch(/font-family/i);
});

test('browserconfig declares a colour and no tile image', async ({ request }) => {
  // A tile image would be a brand asset (P-15). Windows falls back to a
  // screenshot, which asserts nothing.
  const raw = await (await request.get('/browserconfig.xml')).text();
  // Strip comments first: the file explains which tile-image elements to add
  // when P-15 lifts, and naming them is not the same as declaring them.
  const xml = raw.replace(/<!--[\s\S]*?-->/g, '');

  expect(xml).toContain('<TileColor>');
  expect(xml).not.toMatch(/logo>/i);
});

test('the manifest stays a page, not an app', async ({ request }) => {
  const manifest = JSON.parse(await (await request.get('/site.webmanifest')).text());

  expect(manifest.name).toBe('AI Workspace');
  expect(manifest.short_name).toBe('AI Workspace');
  // `07` §11 — no `display`. Adding `standalone` makes it installable, which is
  // a product decision nobody has taken.
  expect(manifest.display).toBeUndefined();
  // P-14 — asserts no host.
  expect(JSON.stringify(manifest)).not.toMatch(/https?:\/\//);
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
});

/* -------------------------------------------------------------------------- */
/* Metadata regression, across every route                                    */
/* -------------------------------------------------------------------------- */

for (const route of ROUTES) {
  test(`${route} references the full icon and social set`, async ({ page }) => {
    await page.goto(route);

    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
    await expect(page.locator('meta[name="msapplication-config"]')).toHaveCount(1);

    // `04` §8 / P1-J §4.3 — one card on every route, with alt text.
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://aiworkspacehq.com/og-image.png',
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      'AI Workspace — Enterprise AI Operating Layer',
    );
  });
}

/* -------------------------------------------------------------------------- */
/* Print — every route, not just the home page                                */
/* -------------------------------------------------------------------------- */

for (const route of ROUTES) {
  test(`${route} prints as black on white with no interactive chrome`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(route);
    await page.emulateMedia({ media: 'print', colorScheme: 'dark' });

    const colours = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      return { color: body.color, background: body.backgroundColor };
    });

    expect(colours.color, route).toBe('rgb(0, 0, 0)');
    expect(colours.background, route).toBe('rgb(255, 255, 255)');

    await expect(page.locator('.skip-link'), route).toBeHidden();
    await expect(page.locator('h1'), route).toBeVisible();
  });
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/* -------------------------------------------------------------------------- */

test('the JSON-LD parses and asserts only what `08` SEO-07 permits', async ({ page }) => {
  await page.goto('/');

  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw!);

  expect(Object.keys(data).sort()).toEqual(
    ['@context', '@type', 'description', 'name', 'url'].sort(),
  );
  expect(data['@context']).toBe('https://schema.org');
  expect(data['@type']).toBe('Organization');
  expect(data.url).toBe('https://aiworkspacehq.com/');

  // `logo` is a brand asset — P-15.
  expect(data.logo).toBeUndefined();
});

/* -------------------------------------------------------------------------- */
/* Bundle budgets — `08` §8, measured on what is actually served              */
/* -------------------------------------------------------------------------- */

/** `08` §8: total transferred (HTML+CSS+JS, gzipped) <= 60 KB, target <= 35 KB. */
const TRANSFER_BUDGET_GZ = 60 * 1024;
const TRANSFER_TARGET_GZ = 35 * 1024;

for (const route of ROUTES) {
  test(`${route} stays inside the transfer budget`, async ({ request }) => {
    const body = await (await request.get(route)).body();
    const gz = gzipSync(body).length;

    expect(gz, `${route} is ${gz} B gzipped`).toBeLessThanOrEqual(TRANSFER_BUDGET_GZ);
    // Not merely the budget — the target. Crossing it still passes `08` §8 but
    // means the headroom has gone, which is worth failing on while it is cheap.
    expect(gz, `${route} exceeded the 35 KB target`).toBeLessThanOrEqual(TRANSFER_TARGET_GZ);
  });
}

test('no route ships client JavaScript or a web font', async ({ page, request }) => {
  // `08` ARCH-06 (<=10 KB gz) is met by shipping nothing at all.
  for (const route of ROUTES) {
    await page.goto(route);

    const executable = await page.evaluate(() =>
      [...document.querySelectorAll('script')]
        .filter((s) => s.type !== 'application/ld+json')
        .map((s) => s.src || 'inline'),
    );
    expect(executable, route).toEqual([]);

    const html = await (await request.get(route)).text();
    expect(html, route).not.toMatch(/@font-face/);
    expect(html, route).not.toMatch(/\.woff2?/);
  }
});

/* -------------------------------------------------------------------------- */
/* The CSP hash must cover the block that is actually served                  */
/* -------------------------------------------------------------------------- */

test('the served JSON-LD is byte-identical to what the CSP hash is computed over', async ({
  request,
}) => {
  // If these drift, the CSP silently stops covering the block — and a page that
  // loses its structured data reports nothing a visitor would notice.
  const html = await (await request.get('/')).text();
  const served = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];

  expect(served, 'no JSON-LD block served on /').toBeTruthy();

  const description = JSON.parse(served!).description;
  expect(organizationJsonLd(description)).toBe(served);
});

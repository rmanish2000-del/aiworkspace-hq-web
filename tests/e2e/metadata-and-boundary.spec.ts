import { expect, test } from '@playwright/test';

/**
 * Two things are asserted here.
 *
 * 1. Metadata matches `04` §1 and §8 exactly (`08` SEO-01/02/03, SEO-10).
 * 2. The safe-development boundary in AWHQ-AUT-P1F §8 holds in the *rendered
 *    output*, not merely in the source. A boundary that is only asserted
 *    against source can be crossed by a dependency; these checks watch the wire.
 */

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

test('the home route emits the approved title, description and canonical', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('AI Workspace — Enterprise AI Operating Layer');

  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'AI Workspace is an Enterprise AI Operating Layer, designed to connect the enterprise systems you already run, understand your organization, and orchestrate AI agents.',
  );

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://aiworkspacehq.com/',
  );

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the home route emits the approved Open Graph tags', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'AI Workspace',
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'AI Workspace — Enterprise AI Operating Layer',
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );

  // P1-L added the social card (`04` §8). It carries only the two approved
  // strings set in the `07` §3 system stack — type, not a logotype.
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://aiworkspacehq.com/og-image.png',
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    'AI Workspace — Enterprise AI Operating Layer',
  );
});

test('public routes are indexable and /404 is not', async ({ page }) => {
  /**
   * `08` SEO-10 names indexing mistakes in BOTH directions — a live site nobody
   * can find, and an error page that gets indexed. P2-E enabled indexing, so
   * this asserts the shape rather than a single global answer.
   */
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');

  await page.goto('/404');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('the viewport meta imposes no scale restriction', async ({ page }) => {
  // `08` HTML-10 / `07` §9 — pinch zoom must work.
  await page.goto('/');

  const content = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(content).toBe('width=device-width, initial-scale=1');
  expect(content).not.toContain('maximum-scale');
  expect(content).not.toContain('user-scalable');
});

/* -------------------------------------------------------------------------- */
/* Boundary — AWHQ-AUT-P1F §8                                                 */
/* -------------------------------------------------------------------------- */

test('no build-time {{placeholder}} survives into rendered output', async ({ page }) => {
  // `04` header note — these must never reach the browser.
  for (const route of ['/', '/404']) {
    await page.goto(route);
    const html = await page.content();
    expect(html, `placeholder leaked on ${route}`).not.toMatch(/\{\{[^}]+\}\}/);
  }
});

test('the site sets zero cookies', async ({ page, context }) => {
  // Binding commitment C-13. This is the mechanical check behind the claim.
  await page.goto('/');
  await page.goto('/404');

  expect(await context.cookies()).toEqual([]);
});

test('the page uses no client-side storage', async ({ page }) => {
  // P-07 / MF-2.
  await page.goto('/');

  const storage = await page.evaluate(() => ({
    local: window.localStorage.length,
    session: window.sessionStorage.length,
  }));

  expect(storage).toEqual({ local: 0, session: 0 });
});

test('first render makes zero third-party requests and loads zero web fonts', async ({ page }) => {
  // `08` §8 — web fonts: 0; third-party requests on first render: 0.
  const requests: Array<{ url: string; type: string }> = [];

  page.on('request', (request) => {
    requests.push({ url: request.url(), type: request.resourceType() });
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const origin = new URL(page.url()).origin;

  const thirdParty = requests.filter(
    (request) => !request.url.startsWith(origin) && !request.url.startsWith('data:'),
  );
  expect(thirdParty).toEqual([]);

  const fonts = requests.filter((request) => request.type === 'font');
  expect(fonts).toEqual([]);
});

test('the page ships no JavaScript', async ({ page }) => {
  // `08` ARCH-01/02/06. Nothing in this scope needs a client runtime, so the
  // <=10 KB budget is met by shipping zero bytes. A script arriving here is a
  // signal that something out of scope was added.
  await page.goto('/');

  // JSON-LD is data, not code — it does not execute and ships no runtime.
  // P1-J §4.3 requires it on `/`; everything else must still be script-free.
  const executable = await page.evaluate(() =>
    [...document.querySelectorAll('script')]
      .filter((script) => script.type !== 'application/ld+json')
      .map((script) => script.src || 'inline'),
  );

  expect(executable).toEqual([]);
});

test('primary content is present without executing JavaScript', async ({ browser }) => {
  // `08` ARCH-02 / ARCH-04.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('We are building an enterprise AI operating layer.');
  // CC-008: the landing page renders its ledger blocks without JavaScript.
  await expect(page.locator('[data-block="CB-04"]')).toBeVisible();

  await context.close();
});

test('the built HTML references no image at all', async ({ page }) => {
  // `07` §11 — image weight in the page's own content is 0 bytes.
  await page.goto('/');
  await expect(page.locator('img')).toHaveCount(0);
});

import { expect, test } from '@playwright/test';

/** Brand V1.2 identity assets and the print stylesheet. */

/* -------------------------------------------------------------------------- */
/* Identity assets                                                            */
/* -------------------------------------------------------------------------- */

test('the favicon is served and is referenced from the document', async ({ page, request }) => {
  await page.goto('/');

  // P1-L added favicon.ico beside it, so this scopes to the SVG.
  const icon = page.locator('link[rel="icon"][type="image/svg+xml"]');
  await expect(icon).toHaveAttribute('href', '/favicon.svg');

  const response = await request.get('/favicon.svg');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('svg');
});

test('the favicon carries the approved symbol without embedded typography', async ({ request }) => {
  const svg = await (await request.get('/favicon.svg')).text();

  expect(svg).not.toMatch(/<text\b/i);
  expect(svg).not.toMatch(/<tspan\b/i);
  expect(svg).not.toMatch(/font-family/i);
  expect(svg).toContain('M32 24l8 8-8 8-8-8z');
  expect(svg).toContain('aria-label="AI Workspace"');
});

test('the manifest is served, valid, and introduces no new string', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');

  const response = await request.get('/site.webmanifest');
  expect(response.status()).toBe(200);

  const manifest = JSON.parse(await response.text());

  // Only the approved public product string (`04` §2, §8).
  expect(manifest.name).toBe('AI Workspace');
  expect(manifest.short_name).toBe('AI Workspace');

  // `07` §11 — this is a page, not an app.
  expect(manifest.display).toBeUndefined();

  // P-14 — the manifest must not name a live host.
  expect(manifest.start_url).toBe('/');
  expect(JSON.stringify(manifest)).not.toMatch(/https?:\/\//);

  expect(manifest.icons?.[0]?.src).toBe('/favicon.svg');
});

test('a theme colour is declared for each colour scheme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
});

/* -------------------------------------------------------------------------- */
/* Print                                                                      */
/* -------------------------------------------------------------------------- */

test.describe('print stylesheet', () => {
  test.use({ colorScheme: 'dark' });

  test('print renders dark mode as black on white', async ({ page }) => {
    // Printing the dark palette wastes a cartridge and renders as a grey slab.
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });

    const colours = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      return { color: body.color, background: body.backgroundColor };
    });

    expect(colours.color).toBe('rgb(0, 0, 0)');
    expect(colours.background).toBe('rgb(255, 255, 255)');
  });
});

test('print hides navigation actions and the skip link', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });

  const actions = page.locator('.action-row');
  await expect(actions).toHaveCount(2);
  for (const action of await actions.all()) await expect(action).toBeHidden();
  await expect(page.locator('.skip-link')).toBeHidden();
});

test('print keeps the headline and stage disclosure; /principles prints its five', async ({
  page,
}) => {
  // CC-008: the principles print on /principles, where they now live.
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.home-hero__stage')).toBeVisible();

  await page.goto('/principles');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.term-list--heading > li')).toHaveCount(5);
  for (let i = 0; i < 5; i += 1) {
    await expect(page.locator('.term-list--heading > li').nth(i)).toBeVisible();
  }
});

test('print does not expand link hrefs into visible text', async ({ page }) => {
  // `content: attr(href)` would put a host name on the page as visible copy,
  // which `04` does not specify.
  await page.goto('/404');
  await page.emulateMedia({ media: 'print' });

  // P1-J §10 adds two recovery links, so scope this to the home link.
  const link = page.locator('.notfound__link').first();
  await expect(link).toHaveText('Go to the AI Workspace home page');
});

test('the 404 route prints its content', async ({ page }) => {
  await page.goto('/404');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.notfound__body')).toBeVisible();
});

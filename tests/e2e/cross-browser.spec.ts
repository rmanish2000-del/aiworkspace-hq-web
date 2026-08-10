import { expect, test } from '@playwright/test';

/**
 * P1-M §3 — the engine-sensitive behaviours.
 *
 * Everything here is something that genuinely differs between Blink, Gecko and
 * WebKit, and that this site depends on. Assertions that would be identical in
 * every engine belong in the other specs; repeating them three times would cost
 * CI time and buy no signal.
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

test('no route logs a console error or a page error', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    // A favicon 404 would show here; every asset must actually resolve.
    problems.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText}`);
  });

  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: 'networkidle' });
  }

  expect(problems).toEqual([]);
});

test('dark mode resolves to the `07` §2 tokens in this engine', async ({ page }) => {
  // `prefers-color-scheme` plumbing and `color-scheme` support differ; this
  // pins the actual computed values rather than trusting the media query.
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  const colours = await page.evaluate(() => {
    const s = getComputedStyle(document.body);
    return { bg: s.backgroundColor, fg: s.color };
  });

  expect(colours.bg).toBe('rgb(11, 13, 14)'); // --bg dark
  expect(colours.fg).toBe('rgb(242, 244, 245)'); // --fg dark
});

test('light mode resolves to the `07` §2 tokens in this engine', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const colours = await page.evaluate(() => {
    const s = getComputedStyle(document.body);
    return { bg: s.backgroundColor, fg: s.color };
  });

  expect(colours.bg).toBe('rgb(255, 255, 255)');
  expect(colours.fg).toBe('rgb(17, 19, 21)');
});

test('the print stylesheet forces black on white in this engine', async ({ page }) => {
  // WebKit and Gecko apply `print-color-adjust` and forced backgrounds
  // differently from Blink, so this is checked per engine.
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.emulateMedia({ media: 'print', colorScheme: 'dark' });

  const colours = await page.evaluate(() => {
    const s = getComputedStyle(document.body);
    return { bg: s.backgroundColor, fg: s.color };
  });

  expect(colours.fg).toBe('rgb(0, 0, 0)');
  expect(colours.bg).toBe('rgb(255, 255, 255)');
  await expect(page.locator('#interest')).toBeHidden();
});

test('the skip link works as a real control in this engine', async ({ page, browserName }) => {
  // Focus-on-fragment and `:focus-visible` support are the two places engines
  // most often diverge for a skip link.
  await page.goto('/');

  // WebKit only tabs between form controls by default (a Safari preference, not
  // a page defect), so focus it directly there. What follows — that activating
  // it moves focus into `#main` — is the part that actually varies by engine.
  if (browserName === 'webkit') {
    await page.locator('.skip-link').focus();
  } else {
    await page.keyboard.press('Tab');
  }

  const focused = page.locator(':focus');
  await expect(focused).toHaveClass(/skip-link/);
  await expect(focused).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#main')).toBeVisible();
});

test('the asset references resolve in this engine', async ({ page, request }) => {
  await page.goto('/');

  const refs = await page.evaluate(() => ({
    iconSvg: document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute('href'),
    iconIco: document.querySelector('link[rel="icon"][sizes="32x32"]')?.getAttribute('href'),
    apple: document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href'),
    manifest: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
  }));

  for (const [name, href] of Object.entries(refs)) {
    expect(href, `${name} is not referenced`).toBeTruthy();
    const res = await request.get(href!);
    expect(res.status(), `${name} -> ${href}`).toBe(200);
  }
});

test('the JSON-LD is present and parseable in this engine', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  expect(() => JSON.parse(raw!)).not.toThrow();
  expect(JSON.parse(raw!)['@type']).toBe('Organization');
});

test('a CSP-equivalent restriction does not break the page in this engine', async ({ browser }) => {
  /**
   * `08` §9.2's CSP cannot be applied without a host, so this approximates the
   * part that could actually break something: the page must not depend on any
   * inline or external executable script.
   *
   * Blocking every script URL and asserting the page still renders proves the
   * document has no script dependency to lose — which is what makes
   * `script-src 'self'` safe here.
   */
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('h1'), route).toBeVisible();
    const navigationLink = page
      .locator('nav[aria-label="Main"] a:visible, nav[aria-label="Mobile navigation"] a:visible')
      .first();
    if ((await navigationLink.count()) === 0) {
      await page.locator('.mobile-menu__trigger:visible').click();
    }
    await expect(
      page
        .locator('nav[aria-label="Main"] a:visible, nav[aria-label="Mobile navigation"] a:visible')
        .first(),
      route,
    ).toBeVisible();
  }

  await context.close();
});

test('the 404 route renders its corrected copy in this engine', async ({ page }) => {
  await page.goto('/404');
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.locator('.notfound__body')).toHaveText(
    'That page does not exist, or it has moved.',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

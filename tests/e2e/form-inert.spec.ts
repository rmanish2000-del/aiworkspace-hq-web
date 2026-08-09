import { expect, test } from '@playwright/test';

/**
 * The candidate deliberately removes the old visual-only interest form. These
 * checks preserve the stronger privacy boundary: there is no collection UI,
 * submission endpoint, client storage, or network side effect.
 */

test('the public routes expose no collection form', async ({ page }) => {
  for (const route of [
    '/',
    '/platform',
    '/products',
    '/products/warrant',
    '/products/warrant-mcp',
  ]) {
    await page.goto(route);
    await expect(page.locator('form'), `${route}: collection form returned`).toHaveCount(0);
    await expect(
      page.locator('input, textarea, select'),
      `${route}: collection control returned`,
    ).toHaveCount(0);
  }
});

test('the primary review action resolves locally without a request side effect', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.goto('/');
  requests.length = 0;

  const cta = page.locator('nav[aria-label="Main"] .site-nav__cta');
  await expect(cta).toHaveText('View verified evidence');
  await expect(cta).toHaveAttribute('href', '/platform#verified-capability-heading');
  await cta.click();

  await expect(page).toHaveURL(/\/platform#verified-capability-heading$/);
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('the candidate creates no browser state', async ({ page, context }) => {
  await page.goto('/');
  await page.locator('.home-hero .action-row a').first().click();

  expect(await context.cookies()).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
});

test('tab order begins with skip link, compact navigation, then main actions', async ({ page }) => {
  await page.goto('/');

  const order: string[] = [];
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press('Tab');
    order.push(
      await page.evaluate(() => {
        const element = document.activeElement;
        if (!element) return 'none';
        return (
          element.id ||
          [...element.classList].find((name) => name.includes('__')) ||
          element.tagName.toLowerCase()
        );
      }),
    );
  }

  expect(order).toEqual([
    'a',
    'site-nav__link',
    'site-nav__link',
    'site-nav__link',
    'site-nav__link',
    'site-nav__cta',
    'a',
    'a',
  ]);
});

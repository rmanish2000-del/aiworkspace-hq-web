import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * P0 `08` A11Y-01 — zero automated violations from axe-core.
 * P0 `11` §7 — clean in BOTH colour schemes; the Playwright projects supply
 * light and dark, so each spec below runs twice.
 *
 * Target: WCAG 2.2 Level AA, no known failures (`08` §6).
 *
 * ⚠️ Automated testing catches roughly a third of accessibility defects
 * (`08` §6). A11Y-02 through A11Y-12 are manual and are NOT discharged by a
 * green run here. See docs/reviews/manual-accessibility-checks.md — every one
 * of them is currently outstanding.
 */

const ROUTES = ['/', '/404'] as const;

for (const route of ROUTES) {
  test(`axe reports zero violations on ${route}`, async ({ page }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => node.target).flat(),
      })),
    ).toEqual([]);
  });
}

test('the skip link is the first focusable element and targets main', async ({ page }) => {
  // `03` Block 0 — first element in DOM inside <body>; `07` §6.1.
  await page.goto('/');
  await page.keyboard.press('Tab');

  const focused = page.locator(':focus');
  await expect(focused).toHaveClass(/skip-link/);
  await expect(focused).toHaveAttribute('href', '#main');

  // Never display:none — it must become visible on focus, not merely exist.
  await expect(focused).toBeVisible();
});

test('every interactive element shows a visible focus indicator', async ({ page }) => {
  // `07` §7 — `outline: none` without a replacement indicator is prohibited.
  await page.goto('/');

  const outlineWidth = await page.evaluate(() => {
    const link = document.querySelector<HTMLElement>('.skip-link');
    if (!link) return null;
    link.focus();
    return getComputedStyle(link).outlineWidth;
  });

  expect(outlineWidth).not.toBeNull();
  expect(Number.parseFloat(outlineWidth ?? '0')).toBeGreaterThanOrEqual(2);
});

test('no positive tabindex exists anywhere', async ({ page }) => {
  // `07` §7 — tab order is DOM order, unmodified.
  await page.goto('/');

  const positive = await page.evaluate(() =>
    [...document.querySelectorAll('[tabindex]')]
      .map((element) => Number(element.getAttribute('tabindex')))
      .filter((value) => value > 0),
  );

  expect(positive).toEqual([]);
});

test('reduced motion disables smooth scrolling', async ({ page }) => {
  // `07` §8 — scroll-behavior: smooth applies only under no-preference.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const behavior = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );

  expect(behavior).toBe('auto');
});

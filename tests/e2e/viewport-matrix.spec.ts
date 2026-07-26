import { expect, test } from '@playwright/test';

/**
 * The viewport matrix required by P1-M §4.
 *
 * `07` §5 declares 320px the minimum supported width and defines behaviour at
 * three ranges. This walks eight real device-class widths through both colour
 * schemes and asserts the two failures that actually matter to a reader:
 * horizontal scrolling, and content that has been clipped away.
 *
 * Every case runs in all three engines (see playwright.config.ts), so the
 * matrix is 8 widths × 2 schemes × 3 engines.
 */

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568, note: 'iPhone SE 1st gen — the declared minimum' },
  { name: '360x800', width: 360, height: 800, note: 'common Android' },
  { name: '390x844', width: 390, height: 844, note: 'iPhone 14/15' },
  { name: '768x1024', width: 768, height: 1024, note: 'iPad portrait — the sm breakpoint' },
  { name: '1024x768', width: 1024, height: 768, note: 'iPad landscape — the lg breakpoint' },
  { name: '1280x720', width: 1280, height: 720, note: 'laptop' },
  { name: '1440x900', width: 1440, height: 900, note: 'larger laptop' },
  { name: '1920x1080', width: 1920, height: 1080, note: 'desktop' },
] as const;

const ROUTES = ['/', '/platform', '/principles', '/contact', '/privacy', '/404'] as const;

for (const viewport of VIEWPORTS) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`${viewport.name} ${scheme}: no horizontal scroll and no clipped content`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ colorScheme: scheme });

      const failures: string[] = [];

      for (const route of ROUTES) {
        await page.goto(route);

        const result = await page.evaluate(() => {
          const doc = document.documentElement;
          const overflowing = [...document.querySelectorAll<HTMLElement>('body *')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              // A few px of tolerance for sub-pixel rounding.
              return r.right > doc.clientWidth + 1 || r.left < -1;
            })
            .map((el) => `${el.tagName}.${el.className}`.slice(0, 40));

          return {
            scrolls: doc.scrollWidth > doc.clientWidth + 1,
            overflowing: [...new Set(overflowing)].slice(0, 5),
            h1Visible: Boolean(document.querySelector('h1')?.getBoundingClientRect().height),
            mainHasContent: (document.querySelector('main')?.textContent ?? '').trim().length > 50,
          };
        });

        if (result.scrolls) failures.push(`${route}: horizontal scroll`);
        if (result.overflowing.length > 0) {
          failures.push(`${route}: overflows — ${result.overflowing.join(', ')}`);
        }
        if (!result.h1Visible) failures.push(`${route}: h1 not rendered`);
        if (!result.mainHasContent) failures.push(`${route}: main is empty`);
      }

      expect(failures, `${viewport.name} ${scheme} (${viewport.note})`).toEqual([]);
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Orientation — `07` §5: "the page works in portrait and landscape"          */
/* -------------------------------------------------------------------------- */

test('rotating a phone between portrait and landscape loses nothing', async ({ page }) => {
  for (const [w, h] of [
    [390, 844],
    [844, 390],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');

    const scrolls = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(scrolls, `${w}x${h}`).toBe(false);
    await expect(page.locator('h1'), `${w}x${h}`).toBeVisible();
    await expect(page.locator('#work-email'), `${w}x${h}`).toBeVisible();
  }
});

/* -------------------------------------------------------------------------- */
/* `07` §3 — input text never below 16px, at any width                        */
/* -------------------------------------------------------------------------- */

test('form inputs never render below 16px, which would trigger iOS auto-zoom', async ({ page }) => {
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    const sizes = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          'input[type="email"], input[type="text"], textarea',
        ),
      ].map((el) => Number.parseFloat(getComputedStyle(el).fontSize)),
    );

    for (const size of sizes) {
      expect(size, `${viewport.name}: input font-size ${size}px`).toBeGreaterThanOrEqual(16);
    }
  }
});

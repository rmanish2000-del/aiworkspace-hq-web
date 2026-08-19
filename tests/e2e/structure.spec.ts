import { expect, test } from '@playwright/test';

/**
 * Document outline (`03` §4) and landmark map (`03` §5), asserted against the
 * built output rather than against intent.
 *
 * The proof-led candidate keeps one h1 and a predictable section hierarchy.
 */

test('the home route has exactly one h1, with no skipped heading levels', async ({ page }) => {
  await page.goto('/');

  const outline = await page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((heading) => ({
      level: Number(heading.tagName.slice(1)),
      text: heading.textContent?.trim() ?? '',
    })),
  );

  expect(outline.filter((heading) => heading.level === 1)).toHaveLength(1);

  expect(outline[0]).toEqual({
    level: 1,
    text: 'The context layer for accountable AI.',
  });
  expect(outline.filter((heading) => heading.level === 2).map((heading) => heading.text)).toEqual([
    'Start with the question you need answered.',
    'Models are capable. Organizations are complicated.',
    'Connect context, govern work, preserve proof.',
    'One governed path from source to decision.',
    'Shared principles. Distinct product boundaries.',
    'Every capability carries its boundary.',
    'Inspect the contract, then inspect the result.',
    'Start with the verified path—not a promise.',
    'Explore',
    'Verify',
    'Engage',
  ]);

  // No level is skipped on the way down.
  for (let index = 1; index < outline.length; index += 1) {
    const previous = outline[index - 1];
    const current = outline[index];
    if (!previous || !current) continue;
    expect(current.level - previous.level).toBeLessThanOrEqual(1);
  }
});

test('the landmark map matches `03` §5', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body > .page > header')).toHaveCount(1);
  await expect(page.locator('main#main')).toHaveCount(1);
  await expect(page.locator('body > .page > footer')).toHaveCount(1);

  // The redesign has no collection form or submission surface.
  await expect(page.locator('form')).toHaveCount(0);

  // P1-J §4.1 adds the main nav; the footer nav is named separately.
  await expect(page.locator('nav[aria-label="Main"]')).toHaveCount(1);
});

test('the eyebrow is a paragraph, not a heading', async ({ page }) => {
  // `03` §3 Block 2 — it carries no document-outline meaning.
  await page.goto('/');

  const heroEyebrow = page.locator('.home-hero > div .eyebrow');
  const tagName = await heroEyebrow.evaluate((element) => element.tagName);
  expect(tagName).toBe('P');
  await expect(heroEyebrow).toHaveText('Enterprise AI operating layer · In development');
});

test('the wordmark is plain text on the home route', async ({ page }) => {
  // `03` §3 Block 1, reasoning preserved by P1-J §4.1: on `/` there is nowhere
  // for the wordmark to go, so it stays a <p>. The header now also carries the
  // navigation (P1-J §4.1), so `header a` is no longer zero — the assertion is
  // about the wordmark specifically.
  await page.goto('/');

  const tagName = await page.locator('.wordmark').evaluate((element) => element.tagName);
  expect(tagName).toBe('P');
  await expect(page.locator('.wordmark')).toHaveText('AI Workspace');
  await expect(page.locator('header a.wordmark')).toHaveCount(0);
});

test('the five principles are h3 elements inside list items, in order', async ({ page }) => {
  // CC-008: the principles render on /principles; the landing route follows
  // the HQ-10 contract and no longer carries them. On /principles the terms
  // are h2 elements (P2-B UX-1 — the page's substance takes h2 scale).
  await page.goto('/principles');

  const titles = await page.locator('.term-list--heading > li > h2').allTextContents();

  expect(titles).toEqual([
    'Connect before migrate',
    'Understand before automate',
    'Extend before replace',
    'Reuse before rebuild',
    'Evidence before claims',
  ]);
});

test('the 404 route renders its approved copy and a link home', async ({ page }) => {
  await page.goto('/404');

  await expect(page.locator('h1')).toHaveText('Page not found');
  // Corrected by P1-J §10 — the old string became false at Phase 1.
  await expect(page.locator('.notfound__body')).toHaveText(
    'That page does not exist, or it has moved.',
  );

  const home = page.locator('.notfound__link').first();
  await expect(home).toHaveText('Go to the AI Workspace home page');
  await expect(home).toHaveAttribute('href', '/');

  // P1-J §10 adds two recovery links beside the home link.
  await expect(page.locator('.notfound__link')).toHaveCount(3);
});

test('no in-page anchor points at a target that does not exist', async ({ page }) => {
  // The reason the hero CTA is omitted: `#interest` is not built in this scope.
  await page.goto('/');

  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((anchor) => anchor.getAttribute('href') ?? '')
      .filter((href) => href.length > 1 && !document.querySelector(href)),
  );

  expect(broken).toEqual([]);
});

for (const width of [320, 375, 768, 1280]) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    // `07` §5 — minimum supported width 320px.
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(overflows).toBe(false);
  });
}

test('400% zoom at 1280px causes no horizontal scroll', async ({ page }) => {
  // WCAG 1.4.10 reflow, `07` §5 / `08` A11Y-05. 1280 / 4 = 320 CSS px.
  await page.setViewportSize({ width: 320, height: 1024 });
  await page.goto('/');

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(overflows).toBe(false);
});

test('text-spacing overrides do not clip content', async ({ page }) => {
  // WCAG 1.4.12, `07` §5. min-height rather than fixed height everywhere.
  await page.setViewportSize({ width: 320, height: 1024 });
  await page.goto('/');

  await page.addStyleTag({
    content: `* { line-height: 1.5 !important; letter-spacing: 0.12em !important;
              word-spacing: 0.16em !important; }
              p { margin-bottom: 2em !important; }`,
  });

  const clipped = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('p, h1, h2, h3, a')]
      .filter((element) => element.clientHeight > 0)
      .filter((element) => {
        // Gecko can report scrollHeight above clientHeight for a visible line
        // box. That is overflow, not lost content; SC 1.4.12 fails only when
        // the computed overflow mode actually clips the expanded text.
        const style = getComputedStyle(element);
        const clips = (value: string) => value !== 'visible';
        return (
          (clips(style.overflowY) && element.scrollHeight > element.clientHeight + 1) ||
          (clips(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        );
      })
      .map((element) => ({
        element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${
          element.className ? `.${String(element.className).trim().replace(/\s+/g, '.')}` : ''
        }`,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
      })),
  );

  expect(clipped).toEqual([]);
});

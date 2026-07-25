import { expect, test } from '@playwright/test';

/**
 * Document outline (`03` §4) and landmark map (`03` §5), asserted against the
 * built output rather than against intent.
 *
 * Since P1-H the outline matches `03` §4 exactly — Block 4 is present, so the
 * trailing `h2 Register interest` is back.
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

  expect(outline).toEqual([
    { level: 1, text: 'The layer between your enterprise systems and your AI agents' },
    { level: 2, text: 'How we are building it' },
    { level: 3, text: 'Connect before migrate' },
    { level: 3, text: 'Understand before automate' },
    { level: 3, text: 'Extend before replace' },
    { level: 3, text: 'Reuse before rebuild' },
    { level: 3, text: 'Evidence before claims' },
    { level: 2, text: 'Register interest' },
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

  // `03` §5 — exactly one form landmark, and it carries an accessible name.
  await expect(page.locator('form[aria-label]')).toHaveCount(1);
});

test('the eyebrow is a paragraph, not a heading', async ({ page }) => {
  // `03` §3 Block 2 — it carries no document-outline meaning.
  await page.goto('/');

  const tagName = await page.locator('.eyebrow').evaluate((element) => element.tagName);
  expect(tagName).toBe('P');
  await expect(page.locator('.eyebrow')).toHaveText('Enterprise AI Operating Layer');
});

test('the wordmark is plain text, never an anchor', async ({ page }) => {
  // `03` §3 Block 1 — not a link at P0, and never an anchor to `#`.
  await page.goto('/');

  const tagName = await page.locator('.wordmark').evaluate((element) => element.tagName);
  expect(tagName).not.toBe('A');
  await expect(page.locator('.wordmark')).toHaveText('AI Workspace');
  await expect(page.locator('header a')).toHaveCount(0);
});

test('the five principles are h3 elements inside list items, in order', async ({ page }) => {
  // `03` §3 Block 3 — h3, NOT <strong>, because `03` §4 requires five h3s.
  await page.goto('/');

  const titles = await page.locator('.principles__list > li > h3').allTextContents();

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
  await expect(page.locator('.notfound__body')).toHaveText(
    'There is only one page here at the moment.',
  );

  const link = page.locator('.notfound__link');
  await expect(link).toHaveText('Go to the AI Workspace home page');
  await expect(link).toHaveAttribute('href', '/');
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
    [...document.querySelectorAll<HTMLElement>('p, h1, h2, h3, a')].some(
      (element) => element.scrollHeight > element.clientHeight + 1 && element.clientHeight > 0,
    ),
  );

  expect(clipped).toBe(false);
});

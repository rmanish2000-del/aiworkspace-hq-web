import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * The Phase 1 route map — P1-J §3.
 *
 * Six routes build; two are deferred. `/docs` and `/research` must not exist,
 * must not be linked, and must not appear in the sitemap (P1-J §12, §13, §15).
 */

const ROUTES = [
  {
    path: '/',
    title: 'AI Workspace — Enterprise AI Operating Layer',
    h1: 'The layer between your enterprise systems and your AI agents',
  },
  {
    path: '/platform',
    title: 'Platform — AI Workspace',
    h1: 'What an Enterprise AI Operating Layer is',
  },
  { path: '/principles', title: 'Principles — AI Workspace', h1: 'How we are building it' },
  { path: '/contact', title: 'Contact — AI Workspace', h1: 'Contact' },
  { path: '/privacy', title: 'Privacy notice — AI Workspace', h1: 'Privacy notice' },
  { path: '/404', title: 'Page not found — AI Workspace', h1: 'Page not found' },
] as const;

/** The five indexable routes — everything except /404. */
const SITEMAP_ROUTES = ROUTES.filter((r) => r.path !== '/404');

/* -------------------------------------------------------------------------- */
/* Every route renders                                                        */
/* -------------------------------------------------------------------------- */

for (const route of ROUTES) {
  test(`${route.path} renders with its approved title and single h1`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} did not return 200`).toBeLessThan(400);

    await expect(page).toHaveTitle(route.title);

    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toHaveText(route.h1);
  });

  test(`${route.path} has no accessibility violations`, async ({ page }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();

    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target).flat() })),
    ).toEqual([]);
  });

  test(`${route.path} has the landmark map and no skipped heading level`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.locator('body > .page > header')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('body > .page > footer')).toHaveCount(1);
    // Header nav + footer nav, each with a distinct accessible name.
    await expect(page.locator('nav[aria-label]')).toHaveCount(2);

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName.slice(1))),
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i]! - levels[i - 1]!, `level skipped on ${route.path}`).toBeLessThanOrEqual(1);
    }
  });

  test(`${route.path} emits a self-referencing canonical and is noindex`, async ({ page }) => {
    await page.goto(route.path);

    const expected =
      route.path === '/' ? 'https://aiworkspacehq.com/' : `https://aiworkspacehq.com${route.path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected);

    // Nothing is deployed, so every route is noindex (`08` SEO-10, P-01).
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test(`${route.path} leaks no build-time placeholder and ships no script`, async ({ page }) => {
    await page.goto(route.path);
    const html = await page.content();

    expect(html, `placeholder leaked on ${route.path}`).not.toMatch(/\{\{[^}]+\}\}/);
    expect(html, `[LEGAL] marker leaked on ${route.path}`).not.toContain('[LEGAL');

    // JSON-LD is data, not code; no executable script anywhere.
    const executable = await page.evaluate(() =>
      [...document.querySelectorAll('script')]
        .filter((s) => s.type !== 'application/ld+json')
        .map((s) => s.src || 'inline'),
    );
    expect(executable).toEqual([]);
  });
}

/* -------------------------------------------------------------------------- */
/* Navigation — P1-J §4.1                                                     */
/* -------------------------------------------------------------------------- */

test('the nav carries four items in the specified order', async ({ page }) => {
  await page.goto('/');

  const labels = await page.locator('nav[aria-label="Main"] li').allInnerTexts();
  expect(labels.map((l) => l.trim())).toEqual([
    'Platform',
    'Principles',
    'Contact',
    'Register interest',
  ]);
});

test('the active route is marked with aria-current on every route', async ({ page }) => {
  for (const path of ['/platform', '/principles', '/contact']) {
    await page.goto(path);
    const current = page.locator(`nav[aria-label="Main"] a[aria-current="page"]`);
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', path);
  }
});

test('the wordmark links home on every route except home', async ({ page }) => {
  // `03` §3 Block 1 reasoning preserved by P1-J §4.1: on `/` there is nowhere
  // to go, and a link back to where you already are does nothing.
  await page.goto('/');
  await expect(page.locator('header a.wordmark')).toHaveCount(0);
  await expect(page.locator('header p.wordmark')).toHaveText('AI Workspace');

  for (const path of ['/platform', '/principles', '/contact', '/privacy', '/404']) {
    await page.goto(path);
    await expect(page.locator('header a.wordmark'), path).toHaveAttribute('href', '/');
  }
});

test('the nav contains no disclosure menu', async ({ page }) => {
  // P1-J §4.1 prohibits one: four items do not need it, and it would add the
  // first interactive JavaScript to a site that has almost none.
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  await expect(nav.locator('[aria-expanded]')).toHaveCount(0);
  await expect(nav.locator('[role="menu"]')).toHaveCount(0);
  await expect(nav.locator('button')).toHaveCount(0);
});

/* -------------------------------------------------------------------------- */
/* Deferred routes must not exist — P1-J §12, §13, §15                        */
/* -------------------------------------------------------------------------- */

test('no route links to /docs or /research anywhere', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
    );
    for (const href of hrefs) {
      expect(href, `${route.path} links to a deferred route`).not.toMatch(/\/(docs|research)\b/);
    }
  }
});

test('every internal link resolves to a route that exists', async ({ page, request }) => {
  // P1-J §15: "No link targets a route that does not exist."
  const seen = new Set<string>();

  for (const route of ROUTES) {
    await page.goto(route.path);
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
    );

    for (const href of hrefs) {
      if (href.startsWith('#') || href.startsWith('mailto:')) continue;
      const path = href.split('#')[0]!;
      if (path === '' || seen.has(path)) continue;
      seen.add(path);
      const res = await request.get(path);
      expect(res.status(), `${route.path} -> ${href}`).toBeLessThan(400);
    }
  }

  expect(seen.size).toBeGreaterThan(0);
});

/* -------------------------------------------------------------------------- */
/* Sitemap and structured data — P1-J §4.3                                    */
/* -------------------------------------------------------------------------- */

test('the sitemap lists exactly the five indexable routes', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);

  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

  expect(locs).toEqual(
    SITEMAP_ROUTES.map((r) =>
      r.path === '/' ? 'https://aiworkspacehq.com/' : `https://aiworkspacehq.com${r.path}`,
    ),
  );

  // /404 is excluded (P1-J §10); deferred routes are absent (§12, §13).
  expect(xml).not.toContain('/404');
  expect(xml).not.toContain('/docs');
  expect(xml).not.toContain('/research');
});

test('Organization JSON-LD appears on / only, and asserts nothing prohibited', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks).toHaveLength(1);

  const data = JSON.parse(blocks[0]!);
  expect(data['@type']).toBe('Organization');
  expect(data.name).toBe('AI Workspace');
  // `logo` is a brand asset — P-15 blocks it while IP ownership is unevidenced.
  expect(data.logo).toBeUndefined();

  // DEC-031 / `08` SEO-07 — none of these types may appear.
  const forbidden = [
    'Product',
    'SoftwareApplication',
    'AggregateRating',
    'Offer',
    'FAQPage',
    'BreadcrumbList',
    'Article',
  ];
  for (const type of forbidden) {
    expect(blocks[0]!).not.toContain(type);
  }

  for (const path of ['/platform', '/principles', '/contact', '/privacy', '/404']) {
    await page.goto(path);
    await expect(page.locator('script[type="application/ld+json"]'), path).toHaveCount(0);
  }
});

/* -------------------------------------------------------------------------- */
/* Copy integrity across routes                                               */
/* -------------------------------------------------------------------------- */

test('the superseded 404 string appears nowhere in the build', async ({ page }) => {
  // P1-J §10 acceptance. "There is only one page here at the moment." became
  // false the moment a second content route shipped.
  for (const route of ROUTES) {
    await page.goto(route.path);
    const html = await page.content();
    expect(html, route.path).not.toContain('There is only one page here at the moment');
  }
});

test('the five principles are byte-identical on / and /principles', async ({ page }) => {
  // P1-J §7.3 / §11 — one copy entry, referenced twice. Divergence here is
  // exactly the failure the single-entry rule exists to prevent.
  await page.goto('/');
  const onHome = await page.locator('.principles__list .principles__title').allTextContents();
  const glossHome = await page.locator('.principles__list .principles__gloss').allTextContents();

  await page.goto('/principles');
  const onPage = await page.locator('.principles__list .principles__title').allTextContents();
  const glossPage = await page.locator('.principles__list .principles__gloss').allTextContents();

  expect(onPage).toEqual(onHome);
  expect(glossPage).toEqual(glossHome);
  expect(onHome).toHaveLength(5);
});

test('/platform makes no present-tense capability claim', async ({ page }) => {
  // P1-J §6.4 — every pillar reads "is designed to".
  await page.goto('/platform');
  const pillars = await page.locator('.principles__gloss').allTextContents();
  expect(pillars).toHaveLength(3);
  for (const body of pillars) {
    expect(body).toContain('is designed to');
  }
});

test('/contact publishes no address and no form', async ({ page }) => {
  // P1-J §8.1: "A contact page that publishes a non-existent address is worse
  // than no contact page." Open Item C is open.
  await page.goto('/contact');

  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('input, textarea, select')).toHaveCount(0);

  /**
   * P1-M defect CONTACT-1 — two of the four specified sections are withheld.
   *
   * "General enquiries" and "Where we are" have no body that is not a withheld
   * placeholder ({{PRIVACY_EMAIL}}; {{LEGAL_ENTITY_NAME}} + {{REGISTERED_ADDRESS}}).
   * They previously rendered as a heading followed by nothing — a gap on screen
   * and silence to a screen reader.
   *
   * That is the same failure §8.1 names above, one step removed: a section that
   * announces a contact route and then supplies none is worse than no section.
   * Both headings remain untouched in the copy module and return the moment
   * Open Items B and C resolve.
   *
   * FLAGGED FOR FOUNDER CONFIRMATION — see release-candidate-report.md.
   */
  const headings = await page.locator('main h2').allTextContents();
  expect(headings).toEqual(['Privacy and data requests', 'Security']);

  // The withheld headings are absent from the page, not merely hidden.
  const html = await page.content();
  for (const withheld of ['General enquiries', 'Where we are']) {
    expect(html, `${withheld} still reaches the document`).not.toContain(withheld);
  }
});

test('/privacy renders all twelve sections in order, with no leaked text', async ({ page }) => {
  // P1-J §9 acceptance: twelve h2s in P0 order.
  await page.goto('/privacy');

  const headings = await page.locator('article.prose > h2').allTextContents();
  expect(headings).toEqual([
    'Who we are',
    'What we collect',
    'Cookies',
    'Why we use it, and on what basis',
    'How long we keep it',
    'Who we share it with',
    'Where your information is held',
    'Your rights and how to use them',
    'How we protect it',
    'Children',
    'Changes to this notice',
    'Contact',
  ]);

  const body = (await page.textContent('body')) ?? '';

  // `06` §7 must not be published in its current form.
  expect(body).not.toContain('may store and process information outside');
  // The single-page claim is false at Phase 1.
  expect(body).not.toContain('This site is a single page');
  // No processing this build does not perform.
  expect(body).not.toContain('we measure aggregate usage');
  expect(body).not.toContain('bot check provided by');

  // Binding commitment C-13 is present.
  expect(body).toContain('We do not use tracking cookies on this site.');
});

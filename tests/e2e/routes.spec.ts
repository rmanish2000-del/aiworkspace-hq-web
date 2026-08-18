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
    title: 'AI Workspace — Governed enterprise AI operations',
    // CC-008 CB-01 — FD-POS1 category claim on the landing route.
    h1: 'Put organizational context behind every AI-assisted action.',
  },
  {
    path: '/trust',
    title: 'Trust — AI Workspace',
    h1: 'What we can be held to, and what we cannot.',
  },
  {
    path: '/technology',
    title: 'Technology — AI Workspace',
    h1: 'What we run on, and what happens if we are wrong about it.',
  },
  {
    path: '/what-we-havent-built',
    title: 'What we have not built — AI Workspace',
    h1: 'What we have not built.',
  },
  {
    path: '/enterprise',
    title: 'For enterprise — AI Workspace',
    h1: 'Five enterprise questions we can answer with evidence today.',
  },
  {
    path: '/security',
    title: 'Security — AI Workspace',
    h1: 'Security: what we can say, and what we cannot.',
  },
  {
    path: '/platform',
    title: 'Platform — AI Workspace',
    h1: 'What an Enterprise AI Operating Layer is',
  },
  {
    path: '/products',
    title: 'Products — AI Workspace',
    h1: 'Authorization products for agents that act.',
  },
  {
    path: '/products/warrant',
    title: 'Warrant — AI Purchasing Authorization — AI Workspace',
    h1: 'Decide whether an AI purchasing agent is allowed to spend',
  },
  {
    path: '/products/warrant-mcp',
    title: 'Warrant MCP — Deterministic AI Tool Policy — AI Workspace',
    h1: 'Rules an AI agent cannot talk its way past',
  },
  {
    path: '/principles',
    title: 'Principles — AI Workspace',
    h1: 'How we are building it',
  },
  // UNIFY-LEGAL-SURFACE (founder ruling 2026-08-13): the six legal routes are
  // canonical at root, serving the certified frozen Kartavya text.
  { path: '/about', title: 'About — AI Workspace', h1: 'About' },
  { path: '/contact', title: 'Contact — AI Workspace', h1: 'Contact' },
  {
    path: '/privacy',
    title: 'Privacy Policy — AI Workspace',
    h1: 'Privacy Policy',
  },
  {
    path: '/terms',
    title: 'Terms of Service — AI Workspace',
    h1: 'Terms of Service',
  },
  {
    path: '/refunds',
    title: 'Refund and Cancellation Policy — AI Workspace',
    h1: 'Refund and Cancellation Policy',
  },
  {
    path: '/delivery',
    title: 'Delivery Policy — AI Workspace',
    h1: 'Delivery Policy',
  },
  {
    // PRICING-SEAL: the amounts on this route come only from the sealed config.
    path: '/pricing',
    title: 'Pricing — AI Workspace',
    h1: 'Pricing',
  },
  {
    path: '/404',
    title: 'Page not found — AI Workspace',
    h1: 'Page not found',
  },
] as const;

/** FD-AG4 wave 1 (CC-009 §0) — exactly these five routes are indexable. */
const WAVE_1 = [
  '/',
  '/trust',
  '/technology',
  '/what-we-havent-built',
  '/privacy',
  '/products',
  '/products/warrant',
  '/products/warrant-mcp',
];
const SITEMAP_ROUTES = ROUTES.filter((r) => WAVE_1.includes(r.path));

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
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target).flat(),
      })),
    ).toEqual([]);
  });

  test(`${route.path} has the landmark map and no skipped heading level`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.locator('body > .page > header')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('body > .page > footer')).toHaveCount(1);
    // Three purpose-led footer groups are always present; home also has an
    // audience-path landmark. At desktop the main navigation adds one. At
    // phone/tablet widths the native disclosure adds it only while open.
    const landmarks = page.locator('nav[aria-label]:visible, nav[aria-labelledby]:visible');
    const mobileTrigger = page.locator('.mobile-menu__trigger:visible');
    const isMobile = (await mobileTrigger.count()) === 1;
    const closedCount = (route.path === '/' ? 4 : 3) + (isMobile ? 0 : 1);
    await expect(landmarks).toHaveCount(closedCount);

    if (isMobile) {
      await mobileTrigger.click();
      await expect(page.locator('nav[aria-label="Mobile navigation"]')).toBeVisible();
      await expect(landmarks).toHaveCount(closedCount + 1);
    }

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName.slice(1))),
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i]! - levels[i - 1]!, `level skipped on ${route.path}`).toBeLessThanOrEqual(1);
    }
  });

  test(`${route.path} emits a self-referencing canonical and the right robots directive`, async ({
    page,
  }) => {
    await page.goto(route.path);

    const expected =
      route.path === '/' ? 'https://aiworkspacehq.com/' : `https://aiworkspacehq.com${route.path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected);

    /**
     * P2-E: AG-4 granted, indexing enabled. The six public routes are
     * `index, follow`; `/404` stays `noindex` — an error page in the index is
     * a defect, and `08` SEO-10 names indexing mistakes in BOTH directions.
     */
    // FD-AG4 wave 1 (CC-009 §0): the wave-1 routes index. The six legal routes
    // have carried `index, follow` since PUBLISH-GUARDIAN-PAGES (#33) and keep
    // it at their canonical root paths (UNIFY-LEGAL-SURFACE, 2026-08-13) —
    // same directives, new paths, sitemap unchanged. Everything else noindex.
    const LEGAL_ROUTES = ['/about', '/contact', '/privacy', '/terms', '/refunds', '/delivery'];
    const expectedRobots =
      WAVE_1.includes(route.path) || LEGAL_ROUTES.includes(route.path)
        ? /^index, follow$/
        : /noindex/;
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', expectedRobots);
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

test('the nav carries the specified items in order', async ({ page }) => {
  await page.goto('/');

  const labels = await page.locator('nav[aria-label="Main"] li').allInnerTexts();
  expect(labels.map((l) => l.trim())).toEqual([
    'Platform',
    'Products',
    'Trust',
    'Technology',
    'View verified evidence',
  ]);
});

test('the active route is marked with aria-current on every primary route', async ({ page }) => {
  for (const path of ['/platform', '/products', '/trust']) {
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
      if (href.startsWith('#') || href.startsWith('mailto:') || /^https?:\/\//.test(href)) continue;
      // FD-W1: /warrant/* exists only at the edge rewrite (PR #19), never as
      // a local file. CC-009's live post-launch checks cover it.
      if (href.startsWith('/warrant')) continue;
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

test('the sitemap lists exactly the indexable routes', async ({ request }) => {
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

test('the five principles render on /principles; the landing route follows its contract', async ({
  page,
}) => {
  // CC-008: `/` renders the HQ-10 landing contract, so the principles live on
  // /principles alone. The single-entry rule (P1-J §11) still holds — one
  // copy entry, one render site.
  await page.goto('/principles');
  const onPage = await page.locator('.term-list--heading .term-list__term').allTextContents();
  expect(onPage).toHaveLength(5);

  await page.goto('/');
  await expect(page.locator('.term-list--heading')).toHaveCount(0);
  await expect(page.locator('[data-block="CB-84"]')).toBeVisible();
});

test('/platform preserves intent tense and renders only verified Assignment capabilities', async ({
  page,
}) => {
  // The category pillars remain design intentions.
  await page.goto('/platform');
  const pillars = await page.locator('.pillar-grid article p').allTextContents();
  expect(pillars).toHaveLength(3);
  for (const body of pillars) {
    expect(body).toContain('is designed to');
  }

  const capability = page.locator('[data-block="CB-80"]');
  await expect(capability).toContainText('created from a Work Item');
  await expect(capability).toContainText('governed Assignment lifecycle');
  await expect(capability).toContainText('dossier view opens directly');
  await expect(capability.locator('.ledger-badge')).toContainText('VERIFIED · 2026-08-07');

  const routingCapability = page.locator('[data-block="CB-81"]');
  await expect(routingCapability).toContainText('validate readiness');
  await expect(routingCapability).toContainText('actionable failures');
  await expect(routingCapability).toContainText('eligible Executors');
  await expect(routingCapability).toContainText('governed lifecycle');
  await expect(routingCapability).toContainText('routing audit record');
  await expect(routingCapability.locator('.ledger-badge')).toContainText('VERIFIED · 2026-08-07');

  const activationCapability = page.locator('[data-block="CB-82"]');
  await expect(activationCapability).toContainText('properly routed Assignment');
  await expect(activationCapability).toContainText('accountable Attempt');
  await expect(activationCapability).toContainText('time-bounded fenced lease');
  await expect(activationCapability).toContainText('invalid, stale, or unauthorized');
  await expect(activationCapability).toContainText('remain auditable');
  await expect(activationCapability.locator('.ledger-badge')).toContainText(
    'VERIFIED · 2026-08-07',
  );

  const completionCapability = page.locator('[data-block="CB-83"]');
  await expect(completionCapability).toContainText('evidence-backed submitted result');
  await expect(completionCapability).toContainText('deterministic verification');
  await expect(completionCapability).toContainText('authorized human approval or rejection');
  await expect(completionCapability).toContainText('Remediable failures create a new Attempt');
  await expect(completionCapability).toContainText('remain inspectable and unchanged');
  await expect(completionCapability.locator('.ledger-badge')).toContainText(
    'VERIFIED · 2026-08-07',
  );

  const knowledgeCapability = page.locator('[data-block="CB-84"]');
  await expect(knowledgeCapability).toContainText('ingest governed organizational knowledge');
  await expect(knowledgeCapability).toContainText('from an approved source');
  await expect(knowledgeCapability).toContainText('retrieve scoped context');
  await expect(knowledgeCapability).toContainText('exact source provenance');
  await expect(knowledgeCapability.locator('.ledger-badge')).toContainText('VERIFIED · 2026-08-08');

  const knowledgeCopy = (await knowledgeCapability.textContent()) ?? '';
  for (const unsupported of ['Google Drive', 'Slack', 'vector', 'knowledge graph']) {
    expect(knowledgeCopy).not.toContain(unsupported);
  }
});

test('/contact publishes the entity block and no form', async ({ page }) => {
  /**
   * UNIFY-LEGAL-SURFACE (founder ruling 2026-08-13) supersedes P1-J §8.1's
   * no-address rule and P1-M CONTACT-1: /contact now serves the certified
   * frozen Kartavya text, and the entity block is CONTENT — merchant
   * verification reads it off the page. What must still be true: a real
   * entity is named, and no form ships (the no-forms invariant is unchanged).
   */
  await page.goto('/contact');

  const body = (await page.textContent('body')) ?? '';
  expect(body).toContain('Kartavya CSC Digital Seva');
  expect(body).toContain('GSTIN: 23AKZPP1502D1ZB');
  expect(body).toContain('Within 3 business days');

  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('input, textarea, select')).toHaveCount(0);
});

test('/privacy names the controller and carries a real date', async ({ page }) => {
  /**
   * UNIFY-LEGAL-SURFACE (founder ruling 2026-08-13): /privacy serves the
   * certified frozen Guardian policy. The twelve-section P1-J §9 pin is
   * superseded — structure and wording are now hash-locked by the content
   * freeze. What a test still adds: the controller is NAMED and the policy is
   * DATED — the two defects the ruling exists to fix — and the no-tracking
   * commitment survives in the frozen wording.
   */
  await page.goto('/privacy');

  const body = (await page.textContent('body')) ?? '';
  expect(body).toContain('Kartavya CSC Digital Seva');
  expect(body).toMatch(/Effective: \d{4}-\d{2}-\d{2}/);
  expect(body).toContain('Cookies, analytics, pixels, trackers - none.');
  expect(body).not.toMatch(/\{\{[^}]+\}\}/);
});

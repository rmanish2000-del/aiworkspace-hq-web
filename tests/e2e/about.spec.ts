import { expect, test } from '@playwright/test';

import { about, shared, nav } from '../../src/content/copy';

/**
 * `/about` — `AWHQ-WEB-P2C` §2.
 *
 * The interesting assertions here are the NEGATIVE ones. P2-C §2.3 withholds a
 * fifth section — "Who is behind this" — and is emphatic that it is *omitted,
 * not explained*: no heading, no placeholder, no reserved space, no comment.
 * "Omitting silently is correct; announcing an omission reveals internal state
 * and invites the question."
 *
 * A test that only checked the four present sections would pass just as
 * happily with a "Coming soon" block sitting underneath them.
 */

/* -------------------------------------------------------------------------- */
/* The four approved sections, and only those                                 */
/* -------------------------------------------------------------------------- */

test('/about renders exactly the four approved sections in order', async ({ page }) => {
  await page.goto('/about');

  const headings = await page.locator('main h2').allTextContents();
  expect(headings).toEqual([
    about.whyHeading,
    about.todayHeading,
    about.claimsHeading,
    about.contactHeading,
  ]);

  // P2-C §2.1: one h1, no level skipped, no h3.
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveText(about.heading);
  await expect(page.locator('main h3')).toHaveCount(0);
});

test('/about renders every approved string, byte for byte', async ({ page }) => {
  await page.goto('/about');
  const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ');

  for (const string of [
    about.heading,
    shared.coreProposition,
    about.whyHeading,
    about.whyBody,
    about.todayHeading,
    shared.stageDisclosure,
    about.todayBody,
    about.claimsHeading,
    about.claimsLead,
    ...about.claims,
    about.contactHeading,
    about.contactBody,
  ]) {
    expect(body, `missing or altered: ${string.slice(0, 48)}…`).toContain(
      string.replace(/\s+/g, ' '),
    );
  }
});

test('the three claim bullets are a real list, not styled paragraphs', async ({ page }) => {
  // P2-C A-2. A screen-reader user gets "list, 3 items" from a <ul> and nothing
  // at all from three <p>s that happen to look like one.
  await page.goto('/about');
  const items = page.locator('main ul li');
  await expect(items).toHaveCount(3);
  expect((await items.allTextContents()).map((t) => t.trim())).toEqual([...about.claims]);
});

/* -------------------------------------------------------------------------- */
/* The withheld section — P2-C §2.3, UX-11                                    */
/* -------------------------------------------------------------------------- */

test('/about ships no trace of the withheld identity section', async ({ page }) => {
  await page.goto('/about');
  const html = await page.content();

  // The heading itself, in any casing.
  expect(html.toLowerCase(), 'the withheld heading reached the page').not.toContain(
    'who is behind this',
  );

  // Anything that announces the omission rather than performing it.
  for (const tell of ['coming soon', 'to be announced', 'more about us', 'watch this space']) {
    expect(html.toLowerCase(), `"${tell}" announces the omission`).not.toContain(tell);
  }

  // No comment survives into the served markup to describe what is missing.
  expect(html, 'an HTML comment reached the page').not.toContain('<!--');

  // The identity facts the section would have carried (P2-C §2.3).
  for (const term of [
    'founder',
    'incorporat',
    'registered office',
    'registered address',
    'private limited',
    'pvt ltd',
    'llp',
  ]) {
    expect(html.toLowerCase(), `identity detail "${term}" appeared`).not.toContain(term);
  }

  // No year that could read as a founding date.
  expect(html, 'a founding-year-like string appeared').not.toMatch(/\b(19|20)\d{2}\b/);
});

test('/about emits no structured data at all', async ({ page }) => {
  /**
   * P2-C §7.2. `AboutPage` is harmless but adds nothing; `Person` would publish
   * founder identity through metadata — the exact thing §2.3 withholds from the
   * body. Withholding it in the copy and emitting it in JSON-LD would be a
   * governance failure, not a technical detail.
   */
  await page.goto('/about');
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);

  const html = await page.content();
  for (const schema of [
    'AboutPage',
    'Person',
    'Product',
    'SoftwareApplication',
    'Offer',
    'Review',
    'Rating',
    'AggregateRating',
    'FAQPage',
    'BreadcrumbList',
  ]) {
    expect(html, `${schema} schema emitted`).not.toContain(schema);
  }
});

/* -------------------------------------------------------------------------- */
/* Navigation placement — P2-C §8.1                                           */
/* -------------------------------------------------------------------------- */

test('About is a footer link and is absent from primary navigation', async ({ page }) => {
  // §8.2: primary nav is a promise of substance, and this route's
  // distinguishing section is withheld. Promote when that section publishes.
  for (const route of ['/', '/about', '/platform']) {
    await page.goto(route);

    const primary = (await page.locator('nav[aria-label="Main"] a').allTextContents()).map((t) =>
      t.trim(),
    );
    expect(primary, `${route}: About reached primary nav`).not.toContain(nav.about);

    const footer = (await page.locator('nav[aria-label="Footer"] a').allTextContents()).map((t) =>
      t.trim(),
    );
    expect(footer, `${route}: About missing from the footer`).toContain(nav.about);
  }
});

test('the footer lists exactly the approved links, in order', async ({ page }) => {
  // P2-C §8.3 caps growth: "a footer that lists every route is a sitemap, and
  // a sitemap is not navigation."
  await page.goto('/about');
  const labels = await page.locator('nav[aria-label="Footer"] a').allTextContents();
  // CC-008 adds the two secondary evidence routes ahead of the P2-C five.
  expect(labels.map((l) => l.trim())).toEqual([
    'For enterprise',
    'Security',
    'Warrant console',
    'Platform',
    'Principles',
    'About',
    'Contact',
    'Privacy notice',
  ]);
});

/* -------------------------------------------------------------------------- */
/* Deferred routes stay deferred — P2-C §12.2                                 */
/* -------------------------------------------------------------------------- */

test('deferred routes exist nowhere', async ({ page, request }) => {
  // CC-008 shipped /trust; /developers, /docs and /research stay deferred.
  for (const path of ['/developers', '/docs', '/research']) {
    const response = await request.get(path);
    expect(response.status(), `${path} exists`).toBe(404);
  }

  for (const route of ['/', '/about', '/platform', '/principles', '/contact', '/privacy']) {
    await page.goto(route);
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
    );
    for (const href of hrefs) {
      expect(href, `${route} links to a deferred route`).not.toMatch(
        /\/(developers|docs|research)\b/,
      );
    }
  }
});

/* -------------------------------------------------------------------------- */
/* Shared strings are referenced, not copied — P2-C §5                        */
/* -------------------------------------------------------------------------- */

test('the shared strings render identically on every route that uses them', async ({ page }) => {
  /**
   * The copy module guarantees one definition; this proves the routes actually
   * render that definition. A drifted copy would still type-check.
   */
  const seen = async (route: string) => {
    await page.goto(route);
    return (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  };

  const home = await seen('/');
  const aboutText = await seen('/about');
  const principlesText = await seen('/principles');

  // CC-008: the landing route renders the HQ-10 contract, so the shared
  // proposition now renders on /about (and the pillar pages), not on /.
  const proposition = shared.coreProposition.replace(/\s+/g, ' ');
  expect(aboutText).toContain(proposition);

  const disclosure = shared.stageDisclosure.replace(/\s+/g, ' ');
  expect(home).toContain(disclosure);
  expect(aboutText).toContain(disclosure);

  const noPrice = shared.noPricePlan.replace(/\s+/g, ' ');
  expect(principlesText).toContain(noPrice);
  expect(aboutText).toContain(noPrice);
});

/* -------------------------------------------------------------------------- */
/* Claims discipline — P2-C §6                                                */
/* -------------------------------------------------------------------------- */

test('/about makes no present-tense product-capability claim', async ({ page }) => {
  /**
   * P2-C §6.1: AC-1 and AC-4 are the only capability statements and both are
   * Approved-direction tier. The wording "is designed to" IS the disclaimer.
   */
  await page.goto('/about');
  const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ');

  for (const forbidden of [
    'AI Workspace connects',
    'AI Workspace understands',
    'AI Workspace orchestrates',
    'AI Workspace provides',
    'AI Workspace delivers',
    'AI Workspace enables',
  ]) {
    expect(body, `present-tense capability claim: "${forbidden}"`).not.toContain(forbidden);
  }

  // The one capability sentence reads "is designed to".
  expect(body).toContain('AI Workspace is designed to connect');
});

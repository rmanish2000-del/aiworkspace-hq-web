/**
 * smoke-production.mjs — drive a live deployment in a real browser.
 *
 *   node scripts/smoke-production.mjs https://origin
 *
 * The header and cache checks in verify-production.mjs are protocol-level.
 * This is what a visitor actually experiences: does the page render, does
 * anything error in the console, does every asset resolve, and does axe-core
 * find a violation against the real origin rather than a local preview.
 *
 * Read-only. Navigates and observes; submits nothing.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const origin = (process.argv[2] ?? '').replace(/\/$/, '');
if (!origin) {
  console.error('Usage: node scripts/smoke-production.mjs <origin>');
  process.exit(2);
}

const ROUTES = ['/', '/platform', '/principles', '/contact', '/privacy', '/this-route-404s'];

const browser = await chromium.launch();
const failures = [];
let violations = 0;

for (const route of ROUTES) {
  const context = await browser.newContext();
  const page = await context.newPage();

  const problems = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    // The 404 route's own document legitimately responds 404; the browser logs
    // that as a failed resource load. Everything else is a real problem.
    const expected404 = route === '/this-route-404s' && /status of 404/.test(m.text());
    if (!expected404) problems.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) =>
    problems.push(`asset failed: ${r.url()} — ${r.failure()?.errorText}`),
  );
  page.on('response', (r) => {
    // A 404 is expected for the deliberately-missing route, not for its assets.
    if (r.status() >= 400 && !r.url().endsWith('/this-route-404s')) {
      problems.push(`${r.status()} on ${r.url()}`);
    }
  });

  await page.goto(origin + route, { waitUntil: 'networkidle' });

  const h1 = await page.locator('h1').first().textContent();
  const title = await page.title();

  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  violations += axe.violations.length;
  for (const v of axe.violations) {
    problems.push(`axe ${v.id} (${v.impact}): ${v.nodes.length} node(s)`);
  }

  const label = route.padEnd(22);
  if (problems.length === 0) {
    console.log(
      `  ✓ ${label} h1 "${(h1 ?? '').trim().slice(0, 44)}" · ${axe.passes.length} axe checks passed`,
    );
  } else {
    console.log(`  ✗ ${label} ${problems.length} problem(s)`);
    for (const p of problems) console.log(`      ${p}`);
    failures.push(route);
  }

  console.log(`      title: ${title}`);
  await context.close();
}

await browser.close();

console.log(
  `\n  ${ROUTES.length - failures.length}/${ROUTES.length} routes clean · ${violations} accessibility violations`,
);
if (failures.length) process.exit(1);

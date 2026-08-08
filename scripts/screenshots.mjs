/**
 * screenshots.mjs — captures the review set for a handoff.
 *
 * Not part of the build and not a CI gate. It exists so that "here is what it
 * looks like" is reproducible rather than hand-assembled.
 *
 *   npm run build
 *   npx astro preview --host 127.0.0.1 --port 4321
 *   node scripts/screenshots.mjs
 *
 * Output goes to screenshots/, which is git-ignored: images are a review
 * artifact, not source, and committing them would bloat history for no gain.
 */
import { mkdir, rm } from 'node:fs/promises';
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4321';
const OUT = 'screenshots';

/** `07` §5 — the three ranges the responsive rules actually distinguish. */
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const SCHEMES = /** @type {const} */ (['light', 'dark']);

/** Every Phase 1 route (P1-J §3). `/docs` and `/research` are deferred. */
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/platform', name: 'platform' },
  { path: '/products', name: 'products' },
  { path: '/products/warrant', name: 'warrant-product' },
  { path: '/products/warrant-mcp', name: 'warrant-mcp-product' },
  { path: '/principles', name: 'principles' },
  { path: '/contact', name: 'contact' },
  { path: '/privacy', name: 'privacy' },
  { path: '/404', name: '404' },
];

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const captured = [];

  try {
    for (const viewport of VIEWPORTS) {
      for (const scheme of SCHEMES) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          colorScheme: scheme,
          deviceScaleFactor: 2,
        });
        const page = await context.newPage();

        // Every route at desktop; the narrower widths only need the two
        // routes whose layout actually differs by width.
        const routes =
          viewport.name === 'desktop'
            ? ROUTES
            : ROUTES.filter((r) => r.path === '/' || r.path === '/platform');

        for (const route of routes) {
          await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' });
          const file = `${OUT}/${route.name}-${viewport.name}-${scheme}.png`;
          await page.screenshot({ path: file, fullPage: true });
          captured.push(file);
        }

        await context.close();
      }
    }

    // Keyboard focus, so the focus indicator is visible in the review set.
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        colorScheme: 'light',
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      await page.locator('#work-email').focus();
      await page.locator('#interest').scrollIntoViewIfNeeded();
      const focus = `${OUT}/form-focus-desktop-light.png`;
      await page.screenshot({ path: focus });
      captured.push(focus);
      await context.close();
    }

    // Print: both an emulated-media screenshot and the real PDF.
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        colorScheme: 'dark', // proves the print sheet forces black on white
      });
      const page = await context.newPage();
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });

      const printPng = `${OUT}/home-print.png`;
      await page.screenshot({ path: printPng, fullPage: true });
      captured.push(printPng);

      const printPdf = `${OUT}/home-print.pdf`;
      await page.pdf({ path: printPdf, format: 'A4', printBackground: false });
      captured.push(printPdf);

      await context.close();
    }
  } finally {
    await browser.close();
  }

  for (const file of captured) console.log(file);
  console.log(`\n${captured.length} files written to ${OUT}/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

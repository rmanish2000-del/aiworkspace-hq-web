import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

/**
 * G-C13 — C-13 verification suite (AWHQ-WEB-CC006).
 *
 * C-13 is a committed public string: "we do not use tracking cookies on this
 * site." This suite converts it from asserted to verified for the current
 * artifact: zero cookies, zero client storage beyond DS-D1's single `theme`
 * key (and that key only after the user operates the toggle), empty
 * sessionStorage / indexedDB / CacheStorage, zero third-party requests, and
 * no Set-Cookie header on any response.
 *
 * Two surfaces:
 *   - the production build (dist/, served by the Playwright web server) —
 *     the seven public routes, which must show NO storage of any kind;
 *   - the design-system gallery build (dist-ds/, served ephemerally below) —
 *     the only surface with a toggle, which may write exactly `theme`.
 *
 * SCOPE LIMITATION (CC-006): this verifies the current artifact in a local
 * environment. Edge injection by a hosting platform is re-verified at first
 * deployment (CC-007).
 */

const ROUTES = [
  '/',
  '/trust',
  '/technology',
  '/what-we-havent-built',
  '/enterprise',
  '/security',
  '/about',
  '/contact',
  '/platform',
  '/products',
  '/products/warrant',
  '/products/warrant-mcp',
  '/principles',
  '/privacy',
  '/404.html',
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

interface StorageSnapshot {
  /** From Playwright's CDP-backed jar — sees HttpOnly cookies too. */
  cookies: string[];
  localKeys: string[];
  sessionKeys: string[];
  idbNames: string[];
  cacheKeys: string[];
}

async function storageSnapshot(page: Page): Promise<StorageSnapshot> {
  const jar = await page.context().cookies();
  const storage = await page.evaluate(async () => ({
    localKeys: Object.keys(localStorage),
    sessionKeys: Object.keys(sessionStorage),
    idbNames: (await indexedDB.databases()).map((db) => db.name ?? '(unnamed)'),
    cacheKeys: await caches.keys(),
  }));
  return { cookies: jar.map((cookie) => cookie.name), ...storage };
}

/** Attaches request/response recorders before any navigation. */
function recordTraffic(page: Page) {
  const origins = new Set<string>();
  const setCookieHeaders: string[] = [];
  page.on('request', (request) => {
    origins.add(new URL(request.url()).origin);
  });
  page.on('response', (response) => {
    const header = response.headers()['set-cookie'];
    if (header) setCookieHeaders.push(`${response.url()}: ${header}`);
  });
  return { origins, setCookieHeaders };
}

function expectClean(snapshot: StorageSnapshot, context: string, allowTheme = false) {
  expect(snapshot.cookies, `${context}: the cookie jar must be empty`).toEqual([]);
  const allowed = allowTheme ? ['theme'] : [];
  expect(
    snapshot.localKeys.filter((key) => !allowed.includes(key)),
    `${context}: localStorage beyond ${JSON.stringify(allowed)}`,
  ).toEqual([]);
  expect(snapshot.sessionKeys, `${context}: sessionStorage`).toEqual([]);
  expect(snapshot.idbNames, `${context}: indexedDB databases`).toEqual([]);
  expect(snapshot.cacheKeys, `${context}: CacheStorage`).toEqual([]);
}

/* -------------------------------------------------------------------------- */
/* The seven public routes — no storage of any kind, ever                     */
/* -------------------------------------------------------------------------- */

for (const route of ROUTES) {
  test(`C13-01 ${route}: no cookie, no storage, no third-party, no Set-Cookie`, async ({
    page,
    baseURL,
  }) => {
    const traffic = recordTraffic(page);
    await page.goto(route);

    // Interaction pass: operate what the route offers, then re-check.
    for (const link of await page.locator('nav a:visible').all()) await link.hover();
    const field = page.locator('input[type="email"]').first();
    if ((await field.count()) > 0) {
      await field.fill('probe@example.invalid');
      await page.keyboard.press('Tab');
    }

    const snapshot = await storageSnapshot(page);
    expectClean(snapshot, route);
    expect(traffic.setCookieHeaders, `${route}: Set-Cookie observed`).toEqual([]);
    expect(
      [...traffic.origins].filter((origin) => origin !== new URL(baseURL ?? '').origin),
      `${route}: third-party origins`,
    ).toEqual([]);
  });
}

test('C13-02 routes stay clean under reduced motion and after navigation pass', async ({
  page,
  baseURL,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const traffic = recordTraffic(page);
  for (const route of ROUTES) await page.goto(route);
  const snapshot = await storageSnapshot(page);
  expectClean(snapshot, 'navigation pass');
  expect(traffic.setCookieHeaders).toEqual([]);
  expect([...traffic.origins].filter((origin) => origin !== new URL(baseURL ?? '').origin)).toEqual(
    [],
  );
});

/* -------------------------------------------------------------------------- */
/* The gallery — the only surface allowed the single DS-D1 `theme` key        */
/* -------------------------------------------------------------------------- */

test.describe('gallery (DS-D1 surface)', () => {
  let server: Server;
  let galleryOrigin: string;

  test.beforeAll(async () => {
    if (!existsSync(join('dist-ds', '_ds.html'))) {
      execSync('npm run ds:build', { stdio: 'pipe' });
    }
    const mime: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css',
      '.js': 'text/javascript',
    };
    server = createServer((request, response) => {
      const path = (request.url ?? '/').split('?')[0] ?? '/';
      try {
        const body = readFileSync(join('dist-ds', path.replace(/^\//, '')));
        response.writeHead(200, { 'content-type': mime[extname(path)] ?? 'text/plain' });
        response.end(body);
      } catch {
        response.writeHead(404);
        response.end();
      }
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('no server address');
    galleryOrigin = `http://127.0.0.1:${address.port}`;
  });

  test.afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('C13-03 first paint writes nothing; full interaction writes only `theme`', async ({
    page,
  }) => {
    const traffic = recordTraffic(page);
    await page.goto(`${galleryOrigin}/_ds.html`);

    // First paint: DS-D1 allows the key only AFTER the user operates the
    // toggle — a fresh visit must write nothing at all.
    expectClean(await storageSnapshot(page), 'gallery first paint', false);

    // Interaction pass: disclosures, the six mock form states, the toggle.
    for (const disclosure of await page.locator('summary').all()) await disclosure.click();
    const input = page.locator('#mf-1-input');
    await input.fill('specimen');
    await page.locator('#mf-1-consent').check();
    await page.locator('form[aria-label*="MF-1"] button[type="submit"]').click();

    const toggle = page.locator('[data-theme-toggle]');
    await expect(toggle).toHaveAttribute('aria-pressed', /true|false/);
    await toggle.click();

    const snapshot = await storageSnapshot(page);
    expectClean(snapshot, 'gallery after interaction', true);
    expect(snapshot.localKeys, 'exactly the theme key after toggle use').toEqual(['theme']);

    // The choice must persist across a reload — and still be the only key.
    await page.reload();
    const after = await storageSnapshot(page);
    expect(after.localKeys).toEqual(['theme']);
    expect(after.cookies).toEqual([]);

    expect(traffic.setCookieHeaders, 'gallery Set-Cookie observed').toEqual([]);
    expect(
      [...traffic.origins].filter((origin) => origin !== galleryOrigin),
      'gallery third-party origins',
    ).toEqual([]);
  });

  test('C13-04 gallery in dark scheme with reduced motion stays clean pre-toggle', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto(`${galleryOrigin}/_ds.html`);
    expectClean(await storageSnapshot(page), 'gallery dark+reduce', false);
  });
});

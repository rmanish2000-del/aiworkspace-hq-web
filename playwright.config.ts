import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright drives the *built* site through `astro preview`, bound to the
 * loopback interface only (AWHQ-AUT-P1F SD-10: local preview only).
 *
 * ─── Engines ───────────────────────────────────────────────────────────────
 * P1-M §3 requires verification in all three available engines. They are not
 * interchangeable for this site: focus-ring rendering, `forced-colors`
 * handling, `text-wrap: balance` and print colour adjustment all differ
 * between Blink, Gecko and WebKit, and every one of those is load-bearing here.
 *
 * ─── Colour schemes ────────────────────────────────────────────────────────
 * `07` §2 makes both themes first-class, so accessibility runs in both.
 */
const PORT = 4321;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/** Specs that must run in every engine — the cross-browser evidence. */
const CROSS_BROWSER = [
  /a11y\.spec\.ts/,
  /a11y-manual\.spec\.ts/,
  /structure\.spec\.ts/,
  /routes\.spec\.ts/,
  /viewport-matrix\.spec\.ts/,
  /cross-browser\.spec\.ts/,
];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  /**
   * Two workers in CI, one locally.
   *
   * Playwright's default is `cores / 2`, which on the 4-core / 8 GB development
   * machine means two browsers plus the preview server plus Node on a box with
   * well under a gigabyte free. Under that pressure the full seven-project run
   * produced four failures inside `page.evaluate` that every one of them passed
   * on re-run in isolation — memory starvation, not defects.
   *
   * The fix is to stop oversubscribing, not to add local retries. Retries would
   * have turned those four into a silent green and hidden the next real
   * intermittent failure behind them. A slower deterministic run is worth more
   * than a fast one whose result has to be second-guessed.
   */
  workers: process.env.CI ? 2 : 1,

  /**
   * Timeouts calibrated for a slow machine, not a fast one.
   *
   * Playwright's 30s test / 5s expect defaults assume a healthy CI runner. On
   * the 4-core / 8 GB development machine WebKit averages ~16s per test, and at
   * those margins the suite invented failures: `role="status"` reported as
   * absent when it is plainly in the built HTML, and axe-core failing to inject
   * at all. Every one of them passed on re-run in isolation, and the set moved
   * between runs — the signature of starvation, not of a defect.
   *
   * Raising the limits changes how long a check will WAIT, never what it
   * asserts. A timeout on a thrashing machine is a false negative, and a suite
   * that cries wolf gets ignored — which costs more than the extra seconds.
   */
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Chromium carries the full suite, including the specs that only need to
    // pass once (asset integrity, print, production files).
    {
      name: 'chromium-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'chromium-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
    {
      // 320px is the minimum supported width (`07` §5).
      name: 'chromium-mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } },
    },

    // Firefox and WebKit run the cross-browser subset. Running the whole suite
    // three times over would treble CI for no extra signal — asset bytes and
    // production files do not vary by engine.
    {
      name: 'firefox',
      testMatch: CROSS_BROWSER,
      use: { ...devices['Desktop Firefox'], colorScheme: 'light' },
    },
    {
      name: 'firefox-dark',
      testMatch: CROSS_BROWSER,
      use: { ...devices['Desktop Firefox'], colorScheme: 'dark' },
    },
    {
      name: 'webkit',
      testMatch: CROSS_BROWSER,
      use: { ...devices['Desktop Safari'], colorScheme: 'light' },
    },
    {
      name: 'webkit-dark',
      testMatch: CROSS_BROWSER,
      use: { ...devices['Desktop Safari'], colorScheme: 'dark' },
    },
  ],

  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

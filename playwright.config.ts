import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright drives the *built* site through `astro preview`, bound to the
 * loopback interface only (AWHQ-AUT-P1F SD-10: local preview only).
 *
 * Accessibility checks run in both colour schemes, because P0 `07` §2 makes
 * both themes first-class and P0 `11` §7 requires axe to be clean in both.
 */
const PORT = 4321;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Only set `workers` when we mean to constrain it; omitting it lets Playwright
  // pick. (`exactOptionalPropertyTypes` rejects an explicit `undefined`.)
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'desktop-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
    {
      name: 'mobile-light',
      // 320px is the minimum supported width (P0 `07` §5).
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } },
    },
  ],

  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

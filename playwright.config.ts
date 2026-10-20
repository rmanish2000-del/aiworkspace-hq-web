import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 600_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL,
    actionTimeout: 15_000,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    // `vite preview` expects dist/server/server.js. This app's Nitro build
    // emits .output for Cloudflare/Vercel, so the smoke server is `vite dev`,
    // which serves the same TanStack routes and /api/plan-request handler.
    command: `bunx vite dev --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

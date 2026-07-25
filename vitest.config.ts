import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    // Playwright specs live under tests/e2e and are run by `npm run test:e2e`.
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
    reporters: ['default'],
  },
});

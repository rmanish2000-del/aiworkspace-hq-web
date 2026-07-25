/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

/**
 * `getViteConfig` gives the test run Astro's own Vite pipeline, which is what
 * lets `tests/unit/design-system.test.ts` render `.astro` components through
 * the Container API.
 *
 * That matters for more than convenience: it means the design system is tested
 * WITHOUT a component showcase page, which P1-I prohibits. Components are
 * rendered to HTML in-process and asserted on directly.
 */
export default getViteConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    // Playwright specs live under tests/e2e and are run by `npm run test:e2e`.
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
    reporters: ['default'],
  },
});

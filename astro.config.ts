import { defineConfig } from 'astro/config';

import { CANONICAL_ORIGIN } from './src/lib/site';

/**
 * Astro configuration — TDR-01 (site framework), TDR-02 (language/runtime).
 *
 * Static output only. No adapter, no SSR, no API routes.
 * P0 `08` ARCH-01/02/03; AWHQ-AUT-P1F §8 P-01/P-02/P-07.
 *
 * No environment variable is read here or anywhere in the build. `site` is the
 * literal canonical origin from P0 `04` §1, imported from `src/lib/site.ts` so
 * there is exactly one definition of it. No request is ever made to it, and
 * nothing is deployed there.
 */
export default defineConfig({
  site: CANONICAL_ORIGIN,
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    // Emit /404.html rather than /404/index.html so the file maps to the route.
    format: 'file',
    // P0 `08` §8 — inline critical CSS; no render-blocking external stylesheet.
    inlineStylesheets: 'always',
  },
  devToolbar: {
    // The dev toolbar injects markup and script into the served page. Off, so
    // what is checked locally is what the build produces.
    enabled: false,
  },
  // No integrations. Adding one is a technology decision (P1-A §8) and would
  // need a decision record before any code depends on it.
  integrations: [],
  vite: {
    build: {
      // Deterministic output aids the byte-budget checks in P0 `08` §8.
      cssCodeSplit: false,
    },
  },
});

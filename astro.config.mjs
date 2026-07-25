// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Astro configuration — TDR-01 (site framework), TDR-02 (language/runtime).
 *
 * Static output only. No adapter, no SSR, no API routes.
 * P0 `08` ARCH-01/02/03; AWHQ-AUT-P1F §8 P-01/P-02/P-07.
 *
 * `site` is read from PUBLIC_SITE_URL so the canonical origin is configuration,
 * not a literal. It is used only to build canonical and Open Graph URLs; no
 * request is ever made to it, and nothing is deployed there.
 */
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://aiworkspacehq.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    // Emit /404.html rather than /404/index.html so the file maps to the route.
    format: 'file',
    inlineStylesheets: 'always', // P0 `08` §8 — inline critical CSS, no render-blocking request
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

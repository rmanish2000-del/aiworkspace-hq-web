/**
 * ds-gallery.config.mjs — the ONLY Astro config that serves or builds the
 * design-system gallery (CC-005 scope 5).
 *
 *   npm run ds:dev     -> http://127.0.0.1:4321/_ds  (local preview)
 *   npm run ds:build   -> dist-ds/ (gitignored; evidence and gate runs only)
 *
 * The production config (astro.config.ts) is deliberately untouched: it knows
 * nothing about the gallery, so the production build cannot contain it —
 * scripts/ds-gates.mjs additionally asserts dist/ has no `_ds` artifact.
 *
 * The `site` literal matches src/lib/site.ts CANONICAL_ORIGIN; this file
 * cannot import the TS module without adding a loader, and nothing here is
 * ever deployed, so the duplication is accepted and noted.
 */
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aiworkspacehq.com',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  outDir: './dist-ds',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    {
      name: 'cc005-ds-gallery',
      hooks: {
        'astro:config:setup': ({ injectRoute }) => {
          injectRoute({
            pattern: '/_ds',
            entrypoint: './src/design-system/gallery/Gallery.astro',
            prerender: true,
          });
        },
      },
    },
  ],
  vite: {
    build: {
      /*
       * Per-route CSS, unlike the production config: a single shared bundle
       * would inline the holding page's stylesheet into the gallery document
       * (and vice-versa noise into gate G-M). dist-ds is never shipped, so
       * the production determinism argument does not apply here.
       */
      cssCodeSplit: true,
    },
  },
});

import type { APIRoute } from 'astro';

import { canonicalUrl } from '../lib/site';

/**
 * `/sitemap.xml` — P1-J §4.3.
 *
 * Lists the routes explicitly authorized for search discovery.
 *
 * `/404` is excluded — P1-J §10: "not in the sitemap".
 * `/docs` and `/research` are excluded — P1-J §12 and §13 defer both, and §15
 * forbids linking a route that does not exist. A sitemap entry is a link.
 *
 * ⚠️ No `<lastmod>`. `08` SEO-05 asks for one, but this build has no
 * publication date: AG-4 is ungranted and nothing has ever been published.
 * A `lastmod` of "today" would assert a publication that did not happen, and
 * `02` §3 prohibits claims about dates. It is added at publication, with the
 * real date.
 *
 * ⚠️ The origin is the canonical one from `04` §1. Nothing is deployed there
 * (P-01), so this file describes a site that is not yet reachable — which is
 * consistent with every route also being `noindex` in this build.
 */
// AIWHQ-CODEX-BTFDR-005: exactly these eight routes are indexable.
const ROUTES = [
  '/',
  '/trust',
  '/technology',
  '/what-we-havent-built',
  '/privacy',
  '/products',
  '/products/warrant',
  '/products/warrant-mcp',
] as const;

export const GET: APIRoute = () => {
  const urls = ROUTES.map(
    (route) => `  <url>\n    <loc>${canonicalUrl(route)}</loc>\n  </url>`,
  ).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

import type { APIRoute } from 'astro';

import { CRAWLABLE } from '../lib/production';
import { canonicalUrl } from '../lib/site';

/**
 * `/robots.txt` — P0 `08` SEO-04.
 *
 * ⚠️ It currently says **`Disallow: /`**, and that is correct.
 *
 * `08` SEO-04 asks for a robots.txt "allowing all crawlers, referencing
 * sitemap.xml" — that is the PRODUCTION file. `08` §13 requires every
 * non-production environment to disallow crawling, and `08` SEO-10 calls
 * indexing mistakes "common and damaging in both directions": shipping
 * production with a leftover `noindex`, or letting a non-production build get
 * indexed and compete with the canonical domain.
 *
 * So this file is generated from `CRAWLABLE`, the same constant that drives the
 * `noindex` meta tag. The two cannot disagree, because there is one of them.
 * When a production deployment exists and the constant flips, this file becomes
 * the allow-all form `08` SEO-04 specifies — with no edit here.
 *
 * The sitemap reference is emitted either way: a crawler that is disallowed
 * does not fetch it, and omitting it would mean the production form differs by
 * more than one line.
 */
export const GET: APIRoute = () => {
  const lines = CRAWLABLE
    ? ['User-agent: *', 'Allow: /']
    : [
        '# This build is not production. Crawling is disallowed, and every route',
        '# also carries a noindex directive. `08` SEO-10 / §13.',
        'User-agent: *',
        'Disallow: /',
      ];

  const body = `${[...lines, '', `Sitemap: ${canonicalUrl('/sitemap.xml')}`, ''].join('\n')}`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

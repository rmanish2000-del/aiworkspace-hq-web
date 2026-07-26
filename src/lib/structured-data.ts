import { createHash } from 'node:crypto';

import { CANONICAL_ORIGIN, canonicalUrl } from './site';

/**
 * The `Organization` JSON-LD block, and the CSP hash that lets it survive the
 * header P0 `08` §9.2 specifies.
 *
 * ─── Why the hash exists ───────────────────────────────────────────────────
 *
 * `08` §9.2 sets `script-src 'self'` with no `'unsafe-inline'`. The JSON-LD is
 * an inline `<script>`.
 *
 * A `type="application/ld+json"` element is a *data block*: the HTML standard
 * never executes it, so on a strict reading there is nothing for `script-src`
 * to block. But engines have differed on whether the inline check runs anyway,
 * and a CSP is a header that ships to production and fails silently — a page
 * that loses its structured data emits no error a visitor would notice.
 *
 * Adding the hash costs one directive and removes the question. It is the
 * cheaper side of an uncertainty, not a claim that the block would otherwise
 * definitely fail.
 *
 * The serialisation here is the single source: `Base.astro` renders exactly
 * this string, and the header manifest hashes exactly this string. They cannot
 * drift, because there is only one of them.
 */

/**
 * `08` SEO-07 permits `name`, `url`, `description`, `logo`.
 *
 * `logo` is omitted. It is a brand asset, and AWHQ-AUT-P1F P-15 blocks brand
 * assets while IP ownership is unevidenced (Open Item E). Pointing it at the
 * placeholder favicon would assert a mark that does not exist.
 *
 * P1-J §4.3 / DEC-031 additionally forbid `Product`, `SoftwareApplication`,
 * `AggregateRating`, `Offer`, `FAQPage`, `BreadcrumbList` and `Article` — each
 * would assert something `02` §3 prohibits.
 */
export function organizationJsonLd(description: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Workspace',
    url: canonicalUrl('/'),
    description,
  });
}

/** `sha256-…` for a CSP `script-src` entry, computed over the exact block. */
export function cspHashFor(content: string): string {
  return `sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}`;
}

/** The origin the structured data refers to. Re-exported for the manifest. */
export { CANONICAL_ORIGIN };

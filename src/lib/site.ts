/**
 * site.ts — the small set of non-copy constants the templates need.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ THIS BUILD READS NO ENVIRONMENT VARIABLE.                                  │
 * │                                                                           │
 * │ P1-H requires it, and it is the right shape for a build that is not        │
 * │ deployed: there is no environment to vary by. The canonical origin below   │
 * │ is not configuration — it is the value P0 `04` §1 states literally, so     │
 * │ reading it from the environment would let an unapproved origin reach the   │
 * │ page.                                                                     │
 * │                                                                           │
 * │ `.env.example` is still committed. It documents a future need (P0 `08`     │
 * │ §10, P1-F S-2). Nothing in `src/` reads it, and a unit test enforces that. │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

/** P0 `04` §1 — "Canonical URL — home: https://aiworkspacehq.com/". */
export const CANONICAL_ORIGIN = 'https://aiworkspacehq.com';

/**
 * Whether this build describes an indexable site.
 *
 * P0 `08` SEO-10 requires `noindex` on every non-production deployment, and
 * names indexing mistakes in BOTH directions as the common failure — a live
 * site nobody can find, and a staging site everybody can.
 *
 * **`true` since P2-E: AG-4 public launch granted, search indexing authorized.**
 * It was `false` from P1-G through P2-D, when the site was deployed but
 * deliberately hidden.
 *
 * This is the single source of truth. `robots.txt`, the per-route `robots` meta
 * tag and the sitemap are all derived from it, so they cannot contradict one
 * another — which is exactly the failure SEO-10 warns about. A route that must
 * stay out of the index says so per-route via `indexableInProduction`, and
 * `/404` does.
 */
export const IS_INDEXABLE = true as const;

export type RouteMeta = {
  readonly title: string;
  /** Empty string means: emit no description tag. */
  readonly description: string;
  readonly canonicalPath: string;
  /** Whether this route would be indexable once a production deploy exists. */
  readonly indexableInProduction: boolean;
};

/** Builds the absolute canonical URL for a route path. */
export function canonicalUrl(path: string): string {
  return new URL(path, CANONICAL_ORIGIN).href;
}

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
 * P0 `08` SEO-10 requires `noindex` on every non-production deployment, and
 * SEO-10 is called out as a mistake made in both directions.
 *
 * There is no production deployment, and AWHQ-AUT-P1F P-01 forbids creating
 * one. So this is a constant, not a condition: every route this build emits is
 * `noindex`. The value flips only when a deployment exists to flip it for, and
 * that requires AG-3.
 */
export const IS_INDEXABLE = false as const;

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

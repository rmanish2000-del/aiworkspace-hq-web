/**
 * Shared prop types for the design system.
 *
 * A type used by more than one place lives here rather than being exported from
 * a `.astro` file: `tsc` cannot read named type exports out of a `.astro`
 * module (only the Astro language tooling can), so re-exporting one from the
 * barrel would type-check in the editor and fail in CI.
 */

/** One entry in a `Navigation`. `label` must be approved copy. */
export interface NavigationItem {
  href: string;
  label: string;
}

/**
 * One row in a `TermList`: a term and the prose that belongs to it.
 *
 * `term` is optional because `/principles` renders a body-only variant — a
 * statement with no lead-in.
 */
export interface TermItem {
  readonly term?: string;
  readonly body: string;
}

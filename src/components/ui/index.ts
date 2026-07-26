/**
 * The design system's public surface — the canonical UI export.
 *
 * Import from here rather than reaching for a file path, so that moving a
 * component is not a breaking change for its callers.
 *
 *     import { Button, Container, Stack } from '../components/ui';
 *
 * ─── Everything exported here is approved for use ──────────────────────────
 *
 * P1-J §0 required the canonical export surface to be cleaned before Phase 1
 * routes were built: no P0-rejected experimental component, and no elevation
 * token. That cleanup removed `Badge`, `Card`, `Tag` and `Grid` outright
 * rather than merely un-exporting them, so that a build importing one **fails**
 * instead of silently falling back (CL-4).
 *
 *   Badge, Tag  P0 `07` §1 rejects badges. §6.3 gives the reason that
 *               generalises: a pill "would read as a status chip and imply a
 *               state we are not claiming" — a claims problem, and `02` §3
 *               prohibits most badge words outright.
 *   Card        P0 `07` §1 rejects "floating glass cards"; `03` §3 rules them
 *               out for the principles list by name. P1-J §0: "Phase 1 pages
 *               use borders and background tokens for separation, never shadow."
 *   Grid        `07` §4 mandates a single column at every breakpoint, and every
 *               Phase 1 route is single-column. An unused component that no
 *               approved route may render is carrying cost for nothing.
 *
 * `Navigation` was on that list until P1-J §4.1 approved a four-item navigation
 * bar, replacing DEC-008. It is now approved and used on every route.
 *
 * Restoring any removed component requires a founder decision, not a revert.
 */

export { default as Button } from './Button.astro';
export { default as CTASection } from './CTASection.astro';
export { default as Callout } from './Callout.astro';
export { default as Container } from './Container.astro';
export { default as Divider } from './Divider.astro';
export { default as Footer } from './Footer.astro';
export { default as Hero } from './Hero.astro';
export { default as Link } from './Link.astro';
export { default as Logo } from './Logo.astro';
export { default as PageHeader } from './PageHeader.astro';
export { default as Navigation } from './Navigation.astro';
export { default as Section } from './Section.astro';
export { default as SectionHeader } from './SectionHeader.astro';
export { default as Stack } from './Stack.astro';
export { default as TermList } from './TermList.astro';

export type { NavigationItem, TermItem } from './types';

/**
 * Components removed by the P1-J §0 cleanup. Kept as a list so the removal is
 * a recorded decision rather than a gap in the history, and so a test can
 * assert none of them has crept back onto disk or into a template.
 */
export const REMOVED_BY_P1J_CLEANUP = ['Badge', 'Card', 'Grid', 'Tag'] as const;

/** Every component the system ships, for the catalog completeness test. */
export const COMPONENT_NAMES = [
  'Button',
  'CTASection',
  'Callout',
  'Container',
  'Divider',
  'Footer',
  'Hero',
  'Link',
  'Logo',
  'PageHeader',
  'Section',
  'SectionHeader',
  'Stack',
  'TermList',
  'Navigation',
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

/**
 * The design system's public surface.
 *
 * Import from here rather than reaching for a file path, so that moving a
 * component is not a breaking change for its callers.
 *
 *     import { Button, Container, Stack } from '../components/ui';
 *
 * ⚠️ Being exported is not permission to use. Five of these are defined but NOT
 * approved for the current routes, because an approved specification rejects
 * them by name:
 *
 *   Badge       `07` §1 rejects badges; §6.3 explains why — a pill "would read
 *               as a status chip and imply a state we are not claiming", and
 *               `02` §3 prohibits most such claims.
 *   Tag         same pill treatment; safer than Badge (a category, not a claim)
 *               but still unapproved.
 *   Card        `07` §1 rejects "floating glass cards"; `03` §3 rules out cards
 *               for the principles list by name.
 *   Grid        `07` §4 mandates a single column at every breakpoint.
 *   Navigation  `03` §2 — "Nothing to navigate to. A menu with one item is
 *               noise."
 *
 * `tests/unit/design-system.test.ts` asserts that none of them reaches a page.
 * The full rules are in docs/design-system/usage-rules.md.
 */

export { default as Badge } from './Badge.astro';
export { default as Button } from './Button.astro';
export { default as Callout } from './Callout.astro';
export { default as Card } from './Card.astro';
export { default as Container } from './Container.astro';
export { default as Divider } from './Divider.astro';
export { default as Footer } from './Footer.astro';
export { default as Grid } from './Grid.astro';
export { default as Hero } from './Hero.astro';
export { default as Link } from './Link.astro';
export { default as Logo } from './Logo.astro';
export { default as Navigation } from './Navigation.astro';
export { default as Section } from './Section.astro';
export { default as Stack } from './Stack.astro';
export { default as Tag } from './Tag.astro';

export type { NavigationItem } from './types';

/** Components that no current route may render. Asserted by test. */
export const NOT_APPROVED_FOR_CURRENT_ROUTES = [
  'Badge',
  'Card',
  'Grid',
  'Navigation',
  'Tag',
] as const;

/** Every component the system ships, for the catalog completeness test. */
export const COMPONENT_NAMES = [
  'Badge',
  'Button',
  'Callout',
  'Card',
  'Container',
  'Divider',
  'Footer',
  'Grid',
  'Hero',
  'Link',
  'Logo',
  'Navigation',
  'Section',
  'Stack',
  'Tag',
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

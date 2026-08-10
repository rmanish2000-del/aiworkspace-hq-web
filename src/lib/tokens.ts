/**
 * tokens.ts — the typed token contract for the design system.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ PROVENANCE IS PART OF THE TOKEN.                                          │
 * │                                                                           │
 * │ P0 `07-visual-and-interaction-spec.md` opens by saying it is the minimum   │
 * │ visual system for one page and **"Not a design system"**. P1-I directs     │
 * │ that one be built anyway, for reuse across the surfaces `08` C9            │
 * │ anticipates.                                                              │
 * │                                                                           │
 * │ Both can be true only if the distinction is kept visible. So every scale   │
 * │ below is tagged:                                                          │
 * │                                                                           │
 * │   CANONICAL  transcribed from `07`. Changing a value is a spec change.     │
 * │   EXTENSION  new in P1-I. `07` specifies nothing here. Values are          │
 * │              derived from `07`'s existing scales, not invented freely,     │
 * │              and REMAIN UNAPPROVED until the founder ratifies them.        │
 * │                                                                           │
 * │ An EXTENSION token being defined is not permission to use it. Usage rules  │
 * │ live in docs/design-system/usage-rules.md.                                 │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * This module is the single typed source. `tokens.css` declares the same names
 * as CSS custom properties, and `tests/unit/tokens.test.ts` asserts the two
 * agree — so a token cannot exist in one and not the other.
 */

export type TokenProvenance = 'canonical' | 'extension';

/* -------------------------------------------------------------------------- */
/* Spacing — CANONICAL (`07` §4). Base unit 4px; every value a multiple.      */
/* -------------------------------------------------------------------------- */

export const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type SpaceStep = (typeof SPACE_STEPS)[number];

export const SPACE: Readonly<Record<SpaceStep, string>> = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '40px',
  8: '48px',
  9: '64px',
  10: '80px',
  11: '112px',
  12: '160px',
};

/** `--space-N`. Use in a component's `style` only via the CSS variable name. */
export const spaceVar = (step: SpaceStep): string => `var(--space-${step})`;

/* -------------------------------------------------------------------------- */
/* Typography — CANONICAL (`07` §3)                                           */
/* -------------------------------------------------------------------------- */

export const TYPE_ROLES = [
  'wordmark',
  'eyebrow',
  'h1',
  'hero-supporting',
  'stage',
  'h2',
  'h3',
  'body',
  'small',
  'input',
] as const;
export type TypeRole = (typeof TYPE_ROLES)[number];

/** Min/max px pairs from the `07` §3 table. The clamp() lives in tokens.css. */
export const TYPE_SCALE: Readonly<Record<TypeRole, { min: number; max: number }>> = {
  wordmark: { min: 17, max: 19 },
  eyebrow: { min: 13, max: 14 },
  h1: { min: 32, max: 56 },
  'hero-supporting': { min: 17, max: 21 },
  stage: { min: 14, max: 15 },
  h2: { min: 22, max: 30 },
  h3: { min: 16, max: 18 },
  body: { min: 16, max: 17 },
  small: { min: 13, max: 14 },
  /** Never below 16px — smaller triggers iOS Safari auto-zoom on focus. */
  input: { min: 16, max: 16 },
};

/** `07` §3 — the fluid scale is clamped between these viewport widths. */
export const TYPE_FLUID_RANGE_PX = { from: 360, to: 1280 } as const;

/* -------------------------------------------------------------------------- */
/* Colour — CANONICAL (`07` §2)                                               */
/* -------------------------------------------------------------------------- */

export const COLOR_TOKENS = [
  'bg',
  'bg-subtle',
  'fg',
  'fg-muted',
  'border',
  'border-input',
  'border-strong',
  'accent',
  'accent-fg',
  'action',
  'action-bright',
  'danger',
  'success',
] as const;
export type ColorToken = (typeof COLOR_TOKENS)[number];

/**
 * `07` §2 — `--border` is for decorative rules and dividers ONLY. Every form
 * control boundary uses `--border-input`, which is verified >=3:1 against both
 * `--bg` and `--bg-subtle` (SC 1.4.11). Using `--border` on a control is a
 * defect, and `tests/unit/tokens.test.ts` guards it.
 */
export const DECORATIVE_ONLY_COLORS: readonly ColorToken[] = ['border'];

/* -------------------------------------------------------------------------- */
/* Breakpoints — CANONICAL (`07` §5)                                          */
/*                                                                            */
/* CSS cannot use a custom property in a media query, so these exist here for  */
/* documentation, tests, and any future build-time use. tokens.css repeats the */
/* literals with a pointer back to this file.                                  */
/* -------------------------------------------------------------------------- */

export const BREAKPOINTS = {
  /** Minimum supported width. No horizontal scroll at or above this. */
  min: 320,
  /** Container padding steps up; footer becomes a row; CTA intrinsic width. */
  sm: 640,
  /** Container caps at its max and centres; desktop vertical rhythm. */
  lg: 1024,
} as const;
export type Breakpoint = keyof typeof BREAKPOINTS;

/** `07` §4 — 720px, chosen over wider because the page is entirely text. */
export const CONTAINER_MAX_PX = 720;

/* -------------------------------------------------------------------------- */
/* Radius — `--radius` is CANONICAL (`07` §6.5, §6.6). The scale is EXTENSION. */
/* -------------------------------------------------------------------------- */

export const RADIUS_STEPS = ['none', 'sm', 'md', 'full'] as const;
export type RadiusStep = (typeof RADIUS_STEPS)[number];

export const RADIUS: Readonly<Record<RadiusStep, string>> = {
  none: '0',
  sm: '4px',
  /** CANONICAL — the 8px `07` specifies for buttons and inputs. */
  md: '8px',
  full: '9999px',
};

export const RADIUS_PROVENANCE: Readonly<Record<RadiusStep, TokenProvenance>> = {
  none: 'extension',
  sm: 'extension',
  md: 'canonical',
  full: 'extension',
};

/* -------------------------------------------------------------------------- */
/* Motion — durations and easing are CANONICAL (`07` §8)                      */
/* -------------------------------------------------------------------------- */

export const MOTION_DURATIONS = {
  /** Button/link/input state changes. `07` §8. */
  fast: '120ms',
  /** Form -> success swap. `07` §8. */
  swap: '160ms',
  /** Submit spinner rotation. `07` §8. */
  spin: '800ms',
} as const;

export const MOTION_EASING = {
  /** The only easing `07` §8 names. */
  standard: 'ease',
  /** Spinner rotation. */
  linear: 'linear',
} as const;

/**
 * `07` §8 — under `prefers-reduced-motion: reduce` every duration collapses to
 * a near-zero value rather than 0, so `transitionend` handlers are not broken.
 */
export const MOTION_REDUCED_DURATION = '0.01ms';

/* -------------------------------------------------------------------------- */
/* Z-index — EXTENSION                                                        */
/*                                                                            */
/* `07` §6.1 gives the skip link `z-index: 10` and nothing else stacks. A      */
/* named scale replaces the magic number and leaves room without inviting a    */
/* stacking war: there are no modals, menus, or carousels (`07` §7).           */
/* -------------------------------------------------------------------------- */

export const Z_LAYERS = ['base', 'raised', 'sticky', 'skip-link'] as const;
export type ZLayer = (typeof Z_LAYERS)[number];

export const Z_INDEX: Readonly<Record<ZLayer, number>> = {
  base: 0,
  raised: 1,
  /** Reserved. `07` §6.2: the header is explicitly not sticky. */
  sticky: 5,
  /** The value `07` §6.1 uses. Must stay the highest. */
  'skip-link': 10,
};

/* -------------------------------------------------------------------------- */
/* Icon sizing — EXTENSION                                                    */
/*                                                                            */
/* `07` §6.8 has one icon: an inline SVG warning glyph beside error text,      */
/* sized to the 14px error type. `08` HTML-09 requires decorative SVGs to      */
/* carry `aria-hidden="true"` and `focusable="false"`.                         */
/* -------------------------------------------------------------------------- */

export const ICON_SIZES = ['sm', 'md', 'lg'] as const;
export type IconSize = (typeof ICON_SIZES)[number];

export const ICON_SIZE: Readonly<Record<IconSize, string>> = {
  /** Matches error text (`07` §6.8). */
  sm: '16px',
  /** Matches body text. */
  md: '20px',
  lg: '24px',
};

/* -------------------------------------------------------------------------- */
/* Provenance index — used by the docs and by the token tests                  */
/* -------------------------------------------------------------------------- */

export const FOUNDATION_PROVENANCE = {
  typography: 'canonical',
  spacing: 'canonical',
  color: 'canonical',
  breakpoints: 'canonical',
  motion: 'canonical',
  radius: 'canonical',
  'z-index': 'extension',
  'icon-sizing': 'extension',
} as const satisfies Record<string, TokenProvenance>;

export type Foundation = keyof typeof FOUNDATION_PROVENANCE;

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  BREAKPOINTS,
  COLOR_TOKENS,
  CONTAINER_MAX_PX,
  ELEVATION,
  ELEVATION_APPROVED_FOR_USE,
  FOUNDATION_PROVENANCE,
  ICON_SIZE,
  MOTION_DURATIONS,
  MOTION_REDUCED_DURATION,
  RADIUS,
  SPACE,
  SPACE_STEPS,
  TYPE_SCALE,
  Z_INDEX,
} from '../../src/lib/tokens';

/**
 * The tokens are declared twice — as CSS custom properties for the stylesheet,
 * and as typed values for component props and these tests.
 *
 * Two declarations of the same thing drift. These tests are what stop that: a
 * token cannot exist in one place and not the other, and a value cannot change
 * in one without failing here.
 */

const TOKENS_CSS = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
const UI_DIR = resolve(process.cwd(), 'src/components/ui');

/** Reads a custom property from the `:root` block (light theme). */
function cssVar(name: string): string | null {
  const match = TOKENS_CSS.match(new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm'));
  return match?.[1]?.trim() ?? null;
}

/* -------------------------------------------------------------------------- */
/* CSS and TypeScript agree                                                   */
/* -------------------------------------------------------------------------- */

describe('the two declarations agree', () => {
  it('declares every spacing step in CSS with the same value', () => {
    for (const step of SPACE_STEPS) {
      expect(cssVar(`--space-${step}`), `--space-${step} missing from tokens.css`).toBe(
        SPACE[step],
      );
    }
  });

  it('declares every colour token in CSS', () => {
    for (const token of COLOR_TOKENS) {
      expect(cssVar(`--${token}`), `--${token} missing from tokens.css`).not.toBeNull();
    }
  });

  it('declares every radius, elevation, z-index and icon token in CSS', () => {
    for (const [step, value] of Object.entries(RADIUS)) {
      expect(cssVar(`--radius-${step}`), `--radius-${step}`).toBe(value);
    }
    for (const [level, value] of Object.entries(ELEVATION)) {
      expect(cssVar(`--elevation-${level}`), `--elevation-${level}`).toBe(value);
    }
    for (const [layer, value] of Object.entries(Z_INDEX)) {
      expect(cssVar(`--z-${layer}`), `--z-${layer}`).toBe(String(value));
    }
    for (const [size, value] of Object.entries(ICON_SIZE)) {
      expect(cssVar(`--icon-${size}`), `--icon-${size}`).toBe(value);
    }
  });

  it('declares the motion durations in CSS', () => {
    expect(cssVar('--duration-fast')).toBe(MOTION_DURATIONS.fast);
    expect(cssVar('--duration-swap')).toBe(MOTION_DURATIONS.swap);
    expect(cssVar('--duration-spin')).toBe(MOTION_DURATIONS.spin);
  });

  it('declares the container measure and the breakpoints in CSS', () => {
    expect(cssVar('--container-max')).toBe(`${CONTAINER_MAX_PX}px`);
    expect(cssVar('--breakpoint-sm')).toBe(`${BREAKPOINTS.sm}px`);
    expect(cssVar('--breakpoint-lg')).toBe(`${BREAKPOINTS.lg}px`);
  });
});

/* -------------------------------------------------------------------------- */
/* Scale integrity                                                            */
/* -------------------------------------------------------------------------- */

describe('scale integrity', () => {
  it('keeps every spacing value a multiple of the 4px base', () => {
    // `07` §4 — "Base unit: 4px. Every spacing value is a multiple."
    for (const step of SPACE_STEPS) {
      const px = Number.parseInt(SPACE[step], 10);
      expect(px % 4, `--space-${step} = ${SPACE[step]} is not a multiple of 4`).toBe(0);
    }
  });

  it('keeps the spacing scale strictly increasing', () => {
    const values = SPACE_STEPS.map((step) => Number.parseInt(SPACE[step], 10));
    for (let i = 1; i < values.length; i += 1) {
      expect(values[i]!).toBeGreaterThan(values[i - 1]!);
    }
  });

  it('never sets input type below 16px', () => {
    // Smaller triggers iOS Safari's auto-zoom on focus (`07` §3).
    expect(TYPE_SCALE.input.min).toBeGreaterThanOrEqual(16);
  });

  it('keeps every type role min <= max', () => {
    for (const [role, { min, max }] of Object.entries(TYPE_SCALE)) {
      expect(min, `${role}`).toBeLessThanOrEqual(max);
    }
  });

  it('keeps the skip link above every other layer', () => {
    // `07` §6.1 — the skip link must never be covered.
    const others = Object.entries(Z_INDEX).filter(([layer]) => layer !== 'skip-link');
    for (const [layer, value] of others) {
      expect(value, `--z-${layer} is not below the skip link`).toBeLessThan(Z_INDEX['skip-link']);
    }
  });

  it('reduces motion to a near-zero duration, never to zero', () => {
    // `07` §8 — zero would break `transitionend` handlers.
    expect(MOTION_REDUCED_DURATION).toBe('0.01ms');
    expect(Number.parseFloat(MOTION_REDUCED_DURATION)).toBeGreaterThan(0);

    const reduced = TOKENS_CSS.match(
      /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\n\}/,
    )?.[0];
    expect(reduced).toBeTruthy();
    for (const name of ['--duration-fast', '--duration-swap', '--duration-spin']) {
      expect(reduced, `${name} not reduced`).toContain(`${name}: ${MOTION_REDUCED_DURATION}`);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Provenance and approval                                                    */
/* -------------------------------------------------------------------------- */

describe('provenance', () => {
  it('marks the extension tokens as extensions, not as canonical', () => {
    expect(FOUNDATION_PROVENANCE.elevation).toBe('extension');
    expect(FOUNDATION_PROVENANCE['z-index']).toBe('extension');
    expect(FOUNDATION_PROVENANCE['icon-sizing']).toBe('extension');
    expect(FOUNDATION_PROVENANCE.grid).toBe('extension');
  });

  it('keeps the canonical foundations canonical', () => {
    // Reclassifying one of these would be a way to change a `07` value quietly.
    expect(FOUNDATION_PROVENANCE.typography).toBe('canonical');
    expect(FOUNDATION_PROVENANCE.spacing).toBe('canonical');
    expect(FOUNDATION_PROVENANCE.color).toBe('canonical');
    expect(FOUNDATION_PROVENANCE.breakpoints).toBe('canonical');
    expect(FOUNDATION_PROVENANCE.motion).toBe('canonical');
  });

  it('approves only elevation 0 for use', () => {
    // `07` §1 rejects floating cards; §6.2 gives the header no shadow.
    expect(ELEVATION_APPROVED_FOR_USE).toEqual([0]);
    expect(ELEVATION[0]).toBe('none');
  });

  it('documents every foundation in the token reference', () => {
    const reference = readFileSync(resolve(process.cwd(), 'docs/design-system/tokens.md'), 'utf8');
    // Compare with hyphens and spaces removed, so "Z-index", "z index" and
    // "zindex" all count as the same heading.
    const flatten = (text: string): string => text.toLowerCase().replace(/[\s-]/g, '');
    const flatReference = flatten(reference);

    const undocumented = Object.keys(FOUNDATION_PROVENANCE).filter(
      (name) => !flatReference.includes(flatten(name)),
    );
    expect(undocumented).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */
/* Token discipline in components                                             */
/* -------------------------------------------------------------------------- */

describe('components use tokens, not literals', () => {
  const componentSources = readdirSync(UI_DIR)
    .filter((file) => file.endsWith('.astro'))
    .map((file) => ({ file, source: readFileSync(join(UI_DIR, file), 'utf8') }));

  /** Just the `<style>` block — prose and props are not CSS. */
  const styleOf = (source: string): string =>
    (source.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, ' ');

  it('never uses a raw hex colour in a component stylesheet', () => {
    // Every colour must come from the `07` §2 palette.
    const offenders = componentSources
      .filter(({ source }) => /#[0-9a-f]{3,8}\b/i.test(styleOf(source)))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it('never uses --border on a form control boundary', () => {
    /**
     * `07` §2 — `--border` is for decorative rules and dividers ONLY.
     * All control boundaries use `--border-input`, which is verified >=3:1
     * against both `--bg` and `--bg-subtle` (SC 1.4.11). "Any future use of
     * `--border` on a control is a defect."
     *
     * Card and Badge are containers, and Divider and Footer are decorative
     * rules, so those four legitimately use it.
     */
    const controlComponents = ['Button.astro', 'Link.astro', 'Navigation.astro', 'Tag.astro'];

    const offenders = componentSources
      .filter(({ file }) => controlComponents.includes(file))
      .filter(({ source }) => /var\(--border\)/.test(styleOf(source)))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it('never hard-codes a transition duration', () => {
    // `07` §8 — durations are tokens so reduced-motion can collapse them all.
    const offenders = componentSources
      .filter(({ source }) => /transition:[^;]*\b\d+m?s\b/.test(styleOf(source)))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it('never removes a focus outline without replacing it', () => {
    // `07` §7 — prohibited anywhere in the stylesheet.
    const offenders = componentSources
      .filter(({ source }) => /outline:\s*(none|0)\s*;/.test(styleOf(source)))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it('declares a forced-colors fallback wherever it paints a border', () => {
    // `07` §2 — the page must remain usable in Windows High Contrast, where
    // author borders and shadows are stripped.
    const paintsBorder = componentSources.filter(({ source }) =>
      /border[^:]*:\s*1px solid/.test(styleOf(source)),
    );

    const missing = paintsBorder
      .filter(({ source }) => !/forced-colors/.test(source))
      .map(({ file }) => file);

    // Card is exempt: it is unapproved for use and its border is decorative.
    expect(missing.filter((f) => f !== 'Card.astro')).toEqual([]);
  });
});

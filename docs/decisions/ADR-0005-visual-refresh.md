# ADR-0005 — Founder-directed visual refresh (palette and decorative motion)

**Status:** Accepted
**Date:** 2026-08-03
**Authority:** Direct founder instruction, 2026-08-03: apply the operator-console
visual treatment ("warm paper + verdigris") to the public site, for the existing
routes and for everything added later.

## Decision

1. The colour **values** in `src/styles/tokens.css` change from `07` §2's
   blue-on-white to a warm-paper + verdigris palette (dark: deep pine + mint).
   Token **names, roles and contrast obligations are unchanged** — every
   component keeps reading the same tokens, which is what makes the refresh
   apply automatically to future routes.
2. Two EXTENSION tokens are added: `--grad-accent` and `--grad-wash`, used only
   for a 3px top brand line, short heading rules and a faint page-corner wash.
   Gradients never colour text and never fill a control; `07` §6.5's single
   flat button treatment is untouched.
3. Entrance motion on each route's opening block: **transform-only**
   (translateY, no opacity fade), durations expressed as multiples of the
   canonical `07` §8 tokens so `prefers-reduced-motion` collapses them with
   everything else.

## What deliberately did not change

- Typography, spacing, breakpoints, radius, motion durations — the canonical
  `07` scales are byte-identical.
- Copy: no visible string changed; the copy gates are untouched.
- Zero client JavaScript, zero cookies, zero storage (C-13, P-07): a manual
  theme toggle with persistence would require both, so theming stays on
  `prefers-color-scheme`, as `07` §2 specifies.
- Brand assets (`public/favicon.svg`, `og-image.svg` and rasters): still the
  neutral placeholders. P-15 blocks brand assets while Open Item E is open, and
  those files say "do not edit toward a brand" — pushing the new palette into
  them would do exactly that.
- `print.css`: already monochrome, unaffected by palette.

## Contrast verification (WCAG relative luminance)

Light theme, against `--bg #FBFAF7` (and `--bg-subtle #F3F1EA` for borders):

| Pair                              | Ratio        | Requirement    |
| --------------------------------- | ------------ | -------------- |
| `--fg` on `--bg`                  | 16.3:1       | 4.5:1          |
| `--fg-muted` on `--bg`/`subtle`   | 6.4 / 6.0:1  | 4.5:1          |
| `--accent` (links) on `--bg`      | 6.2:1        | 4.5:1          |
| `--accent-fg` on `--accent`       | 6.4:1        | 4.5:1          |
| `--border-input` vs `bg`/`subtle` | 3.5 / 3.25:1 | 3:1 (SC1.4.11) |
| `--border-strong` on `--bg`       | 4.9:1        | 3:1            |
| `--danger` on `--bg`              | 6.2:1        | 4.5:1          |
| `--success` on `--bg`             | 6.1:1        | 4.5:1          |

Dark theme, against `--bg #0C1210` (and `--bg-subtle #151D19`):

| Pair                              | Ratio       | Requirement    |
| --------------------------------- | ----------- | -------------- |
| `--fg` on `--bg`                  | 16.8:1      | 4.5:1          |
| `--fg-muted` on `--bg`/`subtle`   | 8.7 / 7.9:1 | 4.5:1          |
| `--accent` (links) on `--bg`      | 10.5:1      | 4.5:1          |
| `--accent-fg` on `--accent`       | 10.5:1      | 4.5:1          |
| `--border-input` vs `bg`/`subtle` | 4.9 / 4.5:1 | 3:1 (SC1.4.11) |
| `--danger` on `--bg`              | 8.3:1       | 4.5:1          |
| `--success` on `--bg`             | 10.2:1      | 4.5:1          |

These are computed values; the binding check is
`tests/e2e/a11y-manual.spec.ts` (A11Y-04, A11Y-04b), which measures what the
browser actually painted, plus axe-core in both schemes.

## Consequences

- `07` §2's colour table no longer describes the running system. This ADR is
  the record of that deviation until `07` is revised; `tokens.css` and
  `docs/design-system/tokens.md` point here.
- `theme-color` metas in `Base.astro` follow the new backgrounds.
- Any future route composed from the design system inherits the refresh with
  no further work — that, not the specific hues, is the point of changing
  values inside unchanged token names.

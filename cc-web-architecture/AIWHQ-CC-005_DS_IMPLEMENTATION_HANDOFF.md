# AIWHQ-CC-005 — DESIGN SYSTEM IMPLEMENTATION HANDOFF

**Document ID:** `AWHQ-WEB-CC005`
**Version:** 1.0 · **Date:** 3 August 2026 · **Author:** Claude Chat · **Assignee:** Claude Code (Claude Fable 5)
**Authorization band:** **AG-1 + AG-2-S** (P1-F) — local build and preview only. ⛔ No deployment, no publication, no new public route.
**Implements:** `AWHQ-WEB-CC004` — Shared Design System Specification v1.0.

---

## 0 FOUNDER DECISIONS OF RECORD — 3 August 2026

| # | Decision | Ruling |
| --- | --- | --- |
| **DS-D1** | Theme persistence | ✅ **APPROVED.** The P1-J §5 storage line is amended to: *"zero cookies; no client storage except a single first-party `theme` preference key, readable by no one but the browser."* **C-13 is unaffected** — the key is neither a cookie nor tracking. The ledger entry for C-13 records this interpretation with today's date |
| **DS-D2** | Amendment scope | ✅ **APPROVED.** The design system governs the seven-route site. **The built holding page's current styles are not modified by this assignment.** Its restyle, if ever, is a separate authorization |

---

## OBJECTIVE

Implement the Shared Design System as a self-contained layer in `aiworkspace-hq-web`: design tokens, CI gates, motion utilities, and component skeletons — verifiable locally, without altering the holding page or creating any public route.

## CONTEXT

- `AWHQ-WEB-CC004` specifies every token value, gradient, motion rule, tier encoding and gate. **It is the single source; do not invent values.** All 38 color pairs in it are pre-verified; your CI gate must reproduce those results.
- The repo already passes `verify:release`. Nothing you add may regress it.

## SCOPE

1. **Tokens** — `src/design-system/tokens.css`:
   - All CC-004 §2 colors as custom properties on `:root` (light) and `[data-theme="dark"]`.
   - Default theme follows `prefers-color-scheme`; `data-theme` overrides.
   - Gradients `--g-thesis`, `--g-evidence`, `--g-veil` per §2.3. Space, radius, elevation, type scale, motion tokens per §3–§5.
2. **Theme toggle** — accessible button component (44×44px min, `aria-pressed`, visible focus ring): reads OS default, persists **only** the single `theme` key per DS-D1. No other storage of any kind.
3. **Motion utilities** — reveal-on-scroll via `IntersectionObserver` (≤1KB gzipped), duration/easing from tokens only, once-per-element. Full `prefers-reduced-motion` build path per CC-004 §5.4.
4. **Component skeletons** — CC-004 §7 items 3–15 as Astro components with mock content only: hero, tier badge (all five tiers), claim card, gap item, question–position pair, technology entry, principle card, form set (mock states MF-1…MF-6, **no endpoint, no storage** — P1-F), buttons, disclosure, table, callout, date stamp.
5. **Dev-only gallery** — a local route `/_ds` rendering every component in both themes. **⛔ Excluded from the production build output** (assert in CI that `dist/` contains no `_ds` artifact). Local preview only.
6. **CI gates** — added to the existing pipeline, all six from CC-004 §9:
   - **G-C1** contrast: parse `tokens.css`, compute WCAG ratios for every declared pair, both themes, both bg levels; fail <4.5 text / <3.0 UI.
   - **G-C2** gradient worst-stop, including `--g-veil` composited.
   - **G-M** reduced-motion build contains zero `transform` transitions.
   - **G-P** P0 `08` §8 budgets unchanged, motion JS included.
   - **G-F** zero `@font-face` / font origins.
   - **G-T** every tier badge resolves to §6 tokens.
   - Existing gates (G-4 prohibited terms, budgets, a11y) keep passing.

## OUT OF SCOPE / PROHIBITED

- ⛔ Any change to the holding page's rendered output (DS-D2). CI must show its HTML/CSS output byte-identical or the diff justified as build-noise only.
- ⛔ Deployment, preview URLs, new public routes, real form submission, analytics, any cookie.
- ⛔ Any copy from HQ-10 — mock text only, no claims. No prohibited term, no stage name, in any artifact including the gallery.
- ⛔ No animation/UI library. No new runtime dependency without listing it in the PR description with its gzipped cost.

## ACCEPTANCE CRITERIA

1. `verify:release` green, including all six new gates.
2. G-C1 output reproduces CC-004's 38-pair table: **0 failures**.
3. Lighthouse (local) ≥95 on the gallery page in both themes.
4. Reduced-motion pass: gallery navigable with zero transform animation.
5. Keyboard-only pass on every interactive skeleton; 44px targets verified.
6. `dist/` contains no `_ds` route, no font files, no storage calls except the single `theme` key.
7. Holding-page output unchanged.

## EVIDENCE REQUIRED IN THE PR

Gate logs (all six) · the contrast table as CI output · `dist/` listing · bundle-size report showing JS ≤10KB · screenshot pairs of the gallery in light/dark · reduced-motion recording or assertion log.

## STOPPING POINT

Stop after the PR is green and evidence is attached. **Do not merge without founder acceptance. Do not deploy. Do not begin any route implementation.** Report back with the evidence pack and exactly one proposed next assignment.

# AI Workspace HQ Design System

**Version:** `0.3.0` · **Assignment:** P1-I · **Date:** 2026-07-26

The reusable foundations and components every future page shares.

| Document                               | Contents                                              |
| -------------------------------------- | ----------------------------------------------------- |
| [`tokens.md`](tokens.md)               | Every token, its value, and where it came from        |
| [`components.md`](components.md)       | The 15 components: props, markup, and what each emits |
| [`usage-rules.md`](usage-rules.md)     | Where each component may and may not be used          |
| [`accessibility.md`](accessibility.md) | The accessibility contract, per component             |

---

## The governance point, first

P0 `07-visual-and-interaction-spec.md` opens by saying:

> **Scope:** the minimum visual system required for one page and one privacy
> page. **Not a design system.** Every token here exists because the holding
> page needs it.

P1-I directs that a design system be built anyway, for reuse across the surfaces
`08` C9 anticipates — documentation, developers, API, SDK, blog, trust centre,
academy. That is the same reasoning that made Astro the right framework
(TDR-01, C9).

Both positions can hold only if the difference stays visible. So:

- **Every token and component is tagged `CANONICAL` or `EXTENSION`.**
  `CANONICAL` means transcribed from `07`; changing a value is a specification
  change. `EXTENSION` means new in P1-I; `07` specifies nothing, the value is
  derived from an existing canonical scale rather than invented, and **it is
  not approved until the founder ratifies it.**
- **Five components are shipped but must not be used.** They are not defects —
  P1-I asks for them, and they will be needed. They are simply ahead of their
  approval. See [Not approved for use](#not-approved-for-use).

Nothing here changes any approved value, any approved string, or the rendered
output of `/` or `/404`.

## What is in the system

**Foundations** — typography, spacing, breakpoints, colour, radius, motion,
icon sizing, z-index. (Grid and elevation were removed by the P1-J §0 cleanup.) Declared twice, deliberately: as CSS
custom properties in [`src/styles/tokens.css`](../../src/styles/tokens.css) for
the stylesheet, and as typed values in
[`src/lib/tokens.ts`](../../src/lib/tokens.ts) for component props and tests. A
unit test asserts the two agree, so a token cannot exist in one and not the
other.

**Components** — 11, in [`src/components/ui/`](../../src/components/ui/), each
importable from the barrel:

```astro
---
import { Button, Container, Section, Stack } from '../components/ui';
---
```

## Principles

1. **Zero JavaScript.** No component ships a client runtime. A test asserts that
   no `<script>` appears in any component source or in any rendered output. If a
   component seems to need JavaScript, that is usually a sign it is the wrong
   component — the Navigation is a row of links rather than a disclosure menu
   for exactly this reason.
2. **No content authority.** No component accepts approved copy as a string prop
   it could substitute. `Logo` reads the wordmark from the copy module and
   ignores any text passed to it; `Hero` takes slots, not strings. P1-A §7.1.
3. **Semantics before styling.** `as` props change the element, never the ARIA
   role. A `Button` rendered as `<a>` keeps its link role, because it goes
   somewhere.
4. **Colour is never the only signal.** `07` §2. The current navigation item is
   marked by weight _and_ `aria-current`; links are underlined, not merely
   coloured.
5. **The token is the value.** No component hard-codes a length, a colour, or a
   duration. Spacing props take a step on the 4px scale, not a pixel count.

## The P1-J §0 cleanup

P1-I shipped five components that no approved specification permitted. P1-J §0
required the canonical export surface to be cleaned before any Phase 1 route was
built, and that cleanup **removed them from the codebase**, not merely from the
barrel — so a build importing one fails rather than falling back silently.

| Removed        | Rejected by                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Badge`, `Tag` | `07` §1 rejects badges; §6.3 — a pill "would read as a status chip and imply a state we are not claiming". `02` §3 prohibits most badge words. |
| `Card`         | `07` §1 rejects "floating glass cards"; `03` §3 rules them out for the principles list by name                                                 |
| `Grid`         | `07` §4 mandates a single column, and every Phase 1 route is single-column                                                                     |

**Elevation tokens were removed entirely.** P0 `07` defines no elevation scale.
P1-J §0: "Phase 1 pages use borders and background tokens for separation, never
shadow."

`Navigation` moved the other way — P1-J §4.1 approves it, replacing DEC-008.

**Everything now exported is approved and used.**

## What this system does not do

No showcase page, no docs route, no Storybook. P1-I prohibits a component
showcase, so components are tested by rendering them in-process through Astro's
Container API in
[`tests/unit/design-system.test.ts`](../../tests/unit/design-system.test.ts).
Full coverage, nothing published.

No dark-mode toggle: `07` §2 makes both themes first-class and driven by
`prefers-color-scheme`, and notes that "a control with no other controls around
it is a stray".

No animation beyond token definitions, per P1-I and `07` §8.

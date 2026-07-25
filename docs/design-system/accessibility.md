# Accessibility notes

**Target: WCAG 2.2 Level AA, no known failures** (`08` §6).

What each component guarantees, what it leaves to the caller, and what no
component can guarantee at all.

> ⚠️ **Automated testing catches roughly a third of accessibility defects**
> (`08` §6). Nothing in this file discharges the manual obligations A11Y-02 to
> A11Y-12 or M-1 to M-10, all of which remain outstanding — see
> [`../reviews/manual-accessibility-checks.md`](../reviews/manual-accessibility-checks.md).

---

## System-wide guarantees

### Semantics are native

`08` HTML-05: native elements throughout — `<button>`, `<a>`, `<form>`,
`<label>`, `<input>`. **No component emits `role="button"` on a `<div>`**, and
none turns a link into a button in the accessibility tree.

The `as` prop changes the element, never the role. This matters most for
`Button`: `07` §6.5 makes the hero CTA a link styled as a button, because it
moves you within the page. Announcing it as a button would tell a screen-reader
user it does something it does not.

### One focus treatment, everywhere

`07` §7: 2px `--accent` outline at 2px offset, ≥3:1 against both the element and
its surroundings. `:focus-visible` so mouse clicks do not paint rings, with
`:focus` as the fallback.

**`outline: none` without a replacement indicator is prohibited anywhere in the
stylesheet.** `Button` adds a 1px inner ring in `--bg` so the indicator survives
against the accent fill as well as against the page.

### Tab order is DOM order

`07` §7: no positive `tabindex` anywhere. No component sets `tabindex`, and an
e2e test asserts none appears in rendered output.

### Colour is never the only signal

`07` §2. Enforced by construction where possible: `Navigation` marks the current
item with `aria-current="page"` _and_ weight _and_ an underline; `Link` keeps its
underline at all times.

Where it cannot be enforced — a `Callout` with `tone="danger"` — the usage rules
carry it, and a human has to check.

### Forced colours are respected

`07` §2: the page must remain usable in Windows High Contrast, and system
colours are never suppressed. `Button`, `Badge`, `Divider` and `Footer` each
restore a visible boundary under `@media (forced-colors: active)`, because
author borders and box-shadows are stripped in that mode.

### Reduced motion is honoured

`07` §8: every duration collapses to `0.01ms`, not `0`, so `transitionend`
handlers still fire. `scroll-behavior: smooth` applies only inside a
`prefers-reduced-motion: no-preference` query.

No component introduces motion beyond the four transitions `07` §8 permits.

### Text spacing cannot clip

WCAG 1.4.12. Components use `min-height`, never a fixed `height`, on
text-bearing elements — `Callout` and `Footer` both do.

### Touch targets

`07` §9 / `08` A11Y-09: ≥24×24 CSS px minimum, ≥44×44 as implemented.
`Button` has `min-height: 48px`; `Navigation` links and linked `Tag`s have
`min-height: 44px`.

---

## Per-component contract

### `Container`, `Stack`, `Section`

|                 |                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Guarantees**  | `Section` renders `aria-labelledby` when given `headingId`. `Grid` restores `role="list"` on `ul`/`ol`.                                                   |
| **Caller must** | Pass `headingId` whenever the section has a heading.                                                                                                      |
| **Why**         | A `<section>` becomes a landmark **only** with an accessible name. Without one it is a plain grouping element and a screen-reader user cannot jump to it. |

`Container` and `Stack` are presentational and expose no semantics at all —
which is the point. A layout primitive that added a role would be imposing
meaning the content has not asked for.

### `Grid`

`display: grid` on a `<ul>` **removes list semantics** in Safari with VoiceOver,
so the item count is not announced. `Grid` sets `role="list"` when rendered as a
list to restore it. This is a real, well-documented browser behaviour, not a
defensive guess.

Columns collapse to one below 640px, so reflow at 320px (`08` A11Y-05) holds
without the caller doing anything.

### `Button`

|                 |                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Guarantees**  | 48px min-height; visible focus with an inner ring; `aria-disabled` rather than `disabled`; no `role="button"` on an anchor; label never underlined. |
| **Caller must** | Give it a real label. Supply `href` with `as="a"`. Use `aria-label` only to _supplement_ a visible label, never to replace it.                      |

**`disabled` emits `aria-disabled="true"`, not the `disabled` attribute.** The
HTML attribute removes the control from the tab order entirely, so a keyboard
user tabbing through the form never learns it is there. `07` §6.5 specifies
`aria-disabled` "where the control must stay focusable".

An `aria-label` that does not begin with the visible text breaks WCAG 2.5.3
(Label in Name) for speech-input users. `04` §3's CTA label is written to
satisfy this: "Register interest in AI Workspace early access" starts with the
visible "Register interest".

### `Link`

|                 |                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Guarantees**  | Underline always present. `external` adds `rel="noopener noreferrer"`. Never emits `title`. |
| **Caller must** | Write link text that makes sense out of context.                                            |

**`external` deliberately does not add `target="_blank"`.** Opening a new window
without warning is a WCAG 3.2.5 (Change on Request) problem, and no approved
copy tells the reader it will happen.

**No `title` attribute, ever** — `08` HTML-07. `title` is invisible to touch
users, unreliable for screen readers, and cannot be reached by keyboard.

"Read more" and "click here" fail WCAG 2.4.4; the component cannot prevent them.

### `Logo`

|                 |                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| **Guarantees**  | Renders approved text. No image, no SVG, no ™/®. When linked, the accessible name is the wordmark text. |
| **Caller must** | Omit `href` on the current routes.                                                                      |

`03` §3 Block 1: the wordmark is not a link at P0. An anchor to `#` is a
focusable control that does nothing — it appears in the tab order, announces as
a link, and goes nowhere.

Because the text _is_ the mark, no `aria-label` is needed. If a wordmark SVG
arrives later it must carry an accessible name (`07` §3), and this is the one
place to add it.

### `Hero`

|                 |                                                                 |
| --------------- | --------------------------------------------------------------- |
| **Guarantees**  | Fixed DOM order per `03` §3. The eyebrow renders as a `<p>`.    |
| **Caller must** | Supply exactly one `<h1>`. Respect the 375×667 fold constraint. |

**The eyebrow is not a heading.** Marking "Enterprise AI Operating Layer" as a
heading would put a second entry above the `<h1>` in the document outline, and
`03` §4 fixes that outline exactly.

`07` §7 also specifies that the hero CTA move focus to the form's first field,
not merely the scroll position. That needs JavaScript, and this system ships
none — the current anchor lands the user on the section heading instead
(`../reviews/implementation-notes.md` §2).

### `Footer`

|                 |                                                                                     |
| --------------- | ----------------------------------------------------------------------------------- |
| **Guarantees**  | `contentinfo` when a direct child of the page wrapper. Keeps its shape while empty. |
| **Caller must** | Use it once per document, never inside `<main>`.                                    |

A `<footer>` nested inside a sectioning element is **silently demoted** to a
generic element — no error, no warning, just a missing landmark. That is why
`tests/e2e/structure.spec.ts` asserts the landmark map rather than assuming it.

### `Callout`

|                 |                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **Guarantees**  | No role, no `aria-live` — it never interrupts. `min-height`, so text-spacing overrides cannot clip it. |
| **Caller must** | Say in words what a non-neutral tone means.                                                            |

**A Callout is not an alert.** `07` §6.9 reserves `role="alert"` for the error
summary, which interrupts deliberately because the user just submitted
something. A Callout in the page's normal reading flow that announced itself
would talk over whatever the user was reading.

### `Divider`

|                 |                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------- |
| **Guarantees**  | `<hr>`, exposed as `separator`. `decorative` hides it from AT. Visible under forced colours. |
| **Caller must** | Use `decorative` when the rule adds no meaning.                                              |

A separator announced to a screen-reader user is a claim that the content either
side differs in kind. When the rule is ornament, saying so is noise.

### `Card`

|                 |                                                              |
| --------------- | ------------------------------------------------------------ |
| **Guarantees**  | No role, no `tabindex` — it is a container, never a control. |
| **Caller must** | Put a real `<a>` inside for anything clickable.              |

A whole-card click target swallows text selection, hides the real destination
from the accessibility tree, and gives keyboard users nothing to focus. The link
goes inside.

### `Badge` and `Tag`

|                 |                                                                 |
| --------------- | --------------------------------------------------------------- |
| **Guarantees**  | Inline text with no role. Forced-colors boundary on `Badge`.    |
| **Caller must** | Ensure the text stands alone. Render a group of tags as a list. |

**A badge is not a label for the thing beside it.** Sighted users infer the
association from proximity; screen-reader users get the badge text as a separate
run of text with no relationship to anything. If the association matters, it has
to be in the text or in `aria-describedby`.

A linked `Tag` is a control and needs a 44×44 target (`07` §9). The component
sets `min-height` but cannot make the caller use `as="a"` correctly.

### `Navigation`

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Guarantees**  | Named landmark. Links in a list. `aria-current="page"` on the current item. 44px targets. No menu semantics. |
| **Caller must** | Provide `label`. Use approved copy for item labels.                                                          |

`label` is required rather than optional because two landmarks of the same type
with no names are indistinguishable when a screen-reader user lists the
landmarks on the page.

**No `aria-expanded`, no `role="menu"`, no toggle.** `07` §7: "No keyboard trap
exists anywhere. There are no modals, no menus, no carousels." `role="menu"` in
particular implies application-style arrow-key navigation that this is not.

---

## What no component can guarantee

| Obligation                                            | Why it stays human                                                |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Link text that makes sense out of context (2.4.4)     | Only a reader knows the context                                   |
| Heading order across a whole page (1.3.1)             | Components render one heading; the outline is the page's          |
| Colour contrast of _content_ passed in                | The system guarantees its own tokens, not arbitrary inline colour |
| Reading level and plain language                      | `04` §7.2 stage 5 is a human review                               |
| Screen-reader behaviour in real assistive technology  | A11Y-12, M-1, M-2 — outstanding                                   |
| That a `danger` tone also says what is wrong in words | Usage rule, not a type                                            |

The axe-core run is clean — 0 violations across `/` and `/404` in both colour
schemes, 41 rules passing on `/`. That is a floor, not a conformance claim.

# Usage rules

Where each component may and may not be used, and why.

Most of this file is about **restraint**. The system is larger than the site
needs, because P1-I asked for the components future surfaces will want. The
rules are what stop that head start from quietly becoming a specification
breach.

Enforced by `tests/unit/design-system.test.ts`, which fails if a removed
component reappears on disk or in a template.

---

## The one rule that overrides the rest

> **Everything exported is approved. Anything not approved is not exported.**

This replaces the P1-I position, where five components shipped unapproved. The
P1-J §0 cleanup removed `Badge`, `Card`, `Tag` and `Grid` from the codebase
entirely — not merely from the barrel — so that a build importing one **fails**
rather than silently falling back (CL-4).

`Navigation` moved the other way: P1-J §4.1 approves a four-item navigation bar,
replacing DEC-008.

## Approval status

| Component    | `/` and `/404`                 | Why                                               |
| ------------ | ------------------------------ | ------------------------------------------------- |
| `Container`  | ✅ approved                    | `07` §4 defines the measure                       |
| `Stack`      | ✅ approved                    | Expresses the `07` §4 spacing scale               |
| `Section`    | ✅ approved                    | `03` §2 requires labelled sections                |
| `Button`     | ✅ approved                    | `07` §6.5                                         |
| `Link`       | ✅ approved                    | `07` §6.12                                        |
| `Logo`       | ✅ approved                    | `03` §3 Block 1, as plain text                    |
| `Hero`       | ✅ approved                    | `03` §3 Block 2                                   |
| `Footer`     | ✅ approved                    | `03` §3 Block 5, `07` §6.11                       |
| `Callout`    | ✅ approved, neutral tone only | `07` §6.4 — non-neutral tones are for form states |
| `Divider`    | ✅ approved                    | `07` §2, §6.11                                    |
| `Navigation` | ⛔ **not approved**            | `03` §2 — nothing to navigate to                  |

Lifting any of these is a founder decision under P1-A §10.2(1). For `Badge` it
is two decisions: the visual rule **and** the claim.

---

## Rules that apply to every component

### 1. Never pass approved copy as a substitutable string

Copy comes from `src/content/copy.ts`, transcribed verbatim from `04`. A
component must never let a caller pass a different string for something the
specification fixes.

`Logo` reads the wordmark from the copy module and ignores any `text` prop.
`Hero` takes slots, not strings. P1-A §7.1: Claude Code has no content
authority — and neither does a component.

```astro
<!-- ✅ -->
<Logo />
<Button as="a" href="#interest">{hero.ctaLabel}</Button>

<!-- ⛔ invents copy -->
<Button as="a" href="#interest">Get started</Button>
```

### 2. `as` changes the element, never the role

A `Button` rendered as `<a>` keeps its link role, because it goes somewhere.
No component in this system emits `role="button"` on an anchor, and none should
be changed to.

### 3. Spacing is a step, never a length

```astro
<Stack gap={6} />
<!-- ✅ --space-6 -->
<div style="margin: 30px"><!-- ⛔ off the 4px scale --></div>
```

`07` §4: every spacing value is a multiple of 4px.

### 4. Colour is never the only signal

`07` §2. A `Callout` with `tone="danger"` must also say, in words, what is
wrong. `Navigation` marks the current item with weight **and** `aria-current`.
Links are underlined, not merely coloured.

### 5. No component introduces animation

P1-I: animations are limited to token definitions. `07` §8 permits four
transitions in total and nothing else moves. A component that adds a transition
beyond those tokens is out of scope.

### 6. No component adds JavaScript

A test asserts no `<script>` appears in any component source or rendered output.
If a component appears to need JavaScript, first check whether it is the wrong
component — `Navigation` is a wrapping row of links rather than a disclosure
menu for exactly this reason.

---

## Per-component notes

### `Container`

One per horizontal region. Do **not** nest a `Container` inside a `Container` —
the padding compounds and the measure narrows silently. The page layout applies
it once inside `<header>`, `<main>` and `<footer>` respectively.

### `Stack`

Prefer it over per-component margins. A component that sets its own outer margin
cannot be reused at a different rhythm, which is what produced the missing
hero→principles gap twice.

Do not use `Stack` to space form fields _and_ set field margins — pick one.

### `Section`

Always pass `headingId` when the section has a heading. An unlabelled `<section>`
is not a landmark, so a screen-reader user cannot jump to it.

Do not use `Section` for the hero: `03` §2 lists the hero as its own block, and
`Hero` renders the `<section>` itself.

### `Button`

One primary action per view. `03` §3 omits a secondary CTA at P0, so two
adjacent Buttons are a positioning decision that does not exist yet.

Use `block` for the hero CTA: `07` §5 makes it full width below 640px and
intrinsic above.

Never use a `Button` for navigation between pages — that is a `Link`, or a
`Button as="a"` when it is genuinely the page's main action.

### `Link`

`external` adds `rel` only. If a new window is ever genuinely required, the copy
must say so first — `04` contains no such string today.

### `Logo`

No `href` on the current routes. `03` §3 Block 1: "It is a plain element, not an
anchor to `#`." An anchor to `#` is a focusable control that does nothing, which
is worse than no control.

Add `href="/"` only once there is a second page to return from.

### `Hero`

The `heading` slot must receive exactly one `<h1>`. `03` §4 allows one per page
and `08` HTML-03 makes a second a validator error.

Respect the fold constraint: on 375×667 the eyebrow, `h1`, and first line of the
supporting statement must be visible without scrolling.

### `Footer`

Once per document, as a direct child of the page wrapper. Never inside `<main>`.

The current footer renders **empty** — all four approved lines are blocked on
Open Items B and C (`docs/decisions/ADR-0002-scope-deviations.md` D-3). Do not
fill it with placeholder text; P-12 prohibits it and `04`'s build-time
placeholders must never reach the browser.

### `Callout`

`tone="neutral"` for the stage disclosure and anything like it. `07` §6.4: the
tone is factual disclosure, not caution — resist reaching for `danger` to add
emphasis.

`danger` and `success` belong to form states, which do not exist yet
(`docs/reviews/implementation-notes.md` §2).

### `Divider`

Only where two regions are genuinely different in kind. The footer's top rule is
the one current use. Pass `decorative` when the layout already communicates the
break, so a screen reader is not told about a separator that means nothing.

### `Navigation`

Not until there is a second destination. Adding it to `/` would also change the
landmark map `03` §5 fixes at banner / main / contentinfo / form, which
`tests/e2e/structure.spec.ts` asserts — so the test would fail, correctly.

`label` is required. Two landmarks of the same type need distinct accessible
names or a screen-reader user cannot tell them apart.

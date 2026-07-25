# Component catalog

11 components, in [`src/components/ui/`](../../src/components/ui/). All import
from the barrel:

```astro
---
import { Button, Container, Section, Stack } from '../components/ui';
---
```

Every component: zero JavaScript, fully typed props, no content authority.
Where a component may be used is in [`usage-rules.md`](usage-rules.md); its
accessibility contract is in [`accessibility.md`](accessibility.md).

| Component                   | Provenance          | Approved for current routes |
| --------------------------- | ------------------- | --------------------------- |
| [`Container`](#container)   | CANONICAL           | ✅                          |
| [`Stack`](#stack)           | EXTENSION           | ✅                          |
| [`Section`](#section)       | CANONICAL           | ✅                          |
| [`Grid`](#grid)             | EXTENSION           | ⛔                          |
| [`Button`](#button)         | CANONICAL           | ✅                          |
| [`Link`](#link)             | CANONICAL           | ✅                          |
| [`Logo`](#logo)             | CANONICAL           | ✅                          |
| [`Hero`](#hero)             | CANONICAL           | ✅                          |
| [`Footer`](#footer)         | CANONICAL           | ✅                          |
| [`Callout`](#callout)       | CANONICAL (neutral) | ✅                          |
| [`Divider`](#divider)       | CANONICAL           | ✅                          |
| [`Card`](#card)             | EXTENSION           | ⛔                          |
| [`Badge`](#badge)           | EXTENSION           | ⛔                          |
| [`Tag`](#tag)               | EXTENSION           | ⛔                          |
| [`Navigation`](#navigation) | EXTENSION           | ⛔                          |

---

## Layout

### `Container`

The horizontal measure. `07` §4: max-width 720px, centred, padding `--space-5`
below 640px and `--space-7` above.

| Prop    | Type                                                    | Default | Notes                    |
| ------- | ------------------------------------------------------- | ------- | ------------------------ |
| `as`    | `div \| section \| header \| footer \| main \| article` | `div`   | Element only, no role    |
| `class` | `string`                                                | —       | Merged after own classes |

```astro
<Container as="header">
  <Logo />
</Container>
```

720px is chosen over wider because the page is entirely text; a wider column
would exceed a comfortable measure and force a two-column layout the content
does not warrant.

### `Stack`

Vertical rhythm between siblings. Uses `> * + *`, so it adds no space above its
first child or below its last — safe to nest without doubling a parent's rhythm.

| Prop    | Type        | Default | Notes                                       |
| ------- | ----------- | ------- | ------------------------------------------- |
| `as`    | element     | `div`   |                                             |
| `gap`   | `SpaceStep` | `5`     | A **step** on the 4px scale, never a length |
| `gapLg` | `SpaceStep` | —       | Larger gap from 1024px (`07` §4 desktop)    |

```astro
<Stack gap={11} gapLg={12}>
  <Hero />
  <Principles />
</Stack>
```

This component exists because its absence caused a real defect twice: a missing
`.hero + .section` rule left the call to action butting into the next heading,
on screen and in print (`docs/reviews/implementation-notes.md` §3).

### `Section`

A content region that earns a landmark name from its heading.

| Prop        | Type     | Notes                                                      |
| ----------- | -------- | ---------------------------------------------------------- |
| `headingId` | `string` | Rendered as `aria-labelledby`. Omit only if truly unheaded |
| `id`        | `string` | Anchor target, e.g. `interest`                             |

```astro
<Section id="interest" headingId="interest-heading">
  <h2 id="interest-heading">Register interest</h2>
</Section>
```

A `<section>` becomes a landmark only when it has an accessible name, so
`headingId` is how it earns one. The heading level stays with the caller, so the
document outline is never guessed here.

---

## Controls

### `Button`

The primary action. `07` §6.5 gives exactly one treatment — there is no
secondary or ghost variant, because the page has one action and inventing
variants is a visual decision reserved to the founder.

| Prop         | Type                        | Default  | Notes                                     |
| ------------ | --------------------------- | -------- | ----------------------------------------- |
| `as`         | `a \| button`               | `button` | Element only — **never** the ARIA role    |
| `href`       | `string`                    | —        | Required when `as="a"`; ignored otherwise |
| `type`       | `submit \| button \| reset` | `button` | Ignored when `as="a"`                     |
| `aria-label` | `string`                    | —        | Supplements a visible label               |
| `disabled`   | `boolean`                   | `false`  | Emits `aria-disabled`, not `disabled`     |
| `block`      | `boolean`                   | `false`  | Full width below 640px, intrinsic above   |

```astro
<Button
  as="a"
  href="#interest"
  aria-label="Register interest in AI Workspace early access"
  block
>
  Register interest
</Button>
```

`07` §6.5: "The hero CTA is an `<a href="#interest">` styled as a button, with
`role` left as its native link role. The form submit is a real
`<button type="submit">`." A link that moves you within the page is a link.

`disabled` deliberately emits `aria-disabled` rather than the `disabled`
attribute, which would remove the control from the tab order entirely.

### `Link`

A body-text link. `07` §6.12: accent colour, underlined at 1px with
`text-underline-offset: 0.2em`, thickening to 2px on hover.

| Prop       | Type      | Default | Notes                          |
| ---------- | --------- | ------- | ------------------------------ |
| `href`     | `string`  | —       | Required                       |
| `external` | `boolean` | `false` | Adds `rel`, **never** `target` |

**The underline is never removed.** `07` §2 — colour is never the sole carrier
of meaning. `external` does not open a new window: doing so unannounced is a
WCAG 3.2.5 problem, and no approved copy warns the reader it will happen.

### `Navigation`

Approved by **P1-J §4.1**, which replaces DEC-008. Four items, wrapping to a
second row below 640px.

| Prop      | Type                        | Notes                                           |
| --------- | --------------------------- | ----------------------------------------------- |
| `label`   | `string`                    | **Required** — landmarks need names             |
| `items`   | `readonly NavigationItem[]` | `{ href, label }`; labels must be approved copy |
| `current` | `string`                    | `href` of the current page                      |

Items are data rather than a slot so the component can mark the current page
itself, in markup, with no JavaScript.

No dropdown, no hamburger, no toggle. `07` §7: "There are no modals, no menus,
no carousels." When the link count outgrows one row the answer is to **wrap** —
which needs no focus management and no `aria-expanded` to get wrong.

---

## Content

### `Logo`

The product wordmark — **as text, not a mark.**

| Prop   | Type     | Notes                                                   |
| ------ | -------- | ------------------------------------------------------- |
| `href` | `string` | Renders as a link. Omit on the current routes (`03` §3) |

The text is **not a prop**. It comes from the copy module, because it is
approved copy and P1-A §7.1 gives this component no content authority. Passing
`text` has no effect, and a test asserts that.

P-15 blocks any logo, wordmark asset, or ™/® while IP ownership is unevidenced
(Open Item E). `07` §3: when a wordmark asset arrives it "replaces only the
header wordmark, as an inline SVG with an accessible name — never as a font
swap." This component is that single replacement point.

### `Hero`

The top-of-page block. A **layout** primitive: it takes no copy, only slots.

| Slot         | Contents                                                |
| ------------ | ------------------------------------------------------- |
| `eyebrow`    | A `<p>` — **not** a heading; carries no outline meaning |
| `heading`    | The caller's single `<h1>`                              |
| `supporting` | `<p>`, max ~60 words                                    |
| `disclosure` | `<p>`, visually distinct (`07` §6.4)                    |
| `action`     | One call to action                                      |

DOM order is fixed by `03` §3 Block 2 and is not the caller's choice. There is
one action slot, not two: `03` §3 omits a secondary CTA at P0 (DEC-006), and
adding one is a positioning decision.

A `Hero` that accepted a `headline` string would be the easiest place in the
codebase to introduce unapproved copy. It does not.

### `Footer`

The `contentinfo` landmark. `07` §6.11: muted, 14px, 1px `--border` top rule,
`--space-7` block padding.

Must be used **once per document** and never nested inside `<main>` — a
`<footer>` inside a sectioning element is not a landmark at all. `03` §5
requires exactly one `contentinfo`.

`03` §3 Block 5 fixes the content: entity line, privacy link, contact email,
copyright. "No sitemap, no social links, no 'built with', no badges."

### `Callout`

A left-bordered block of set-apart text. Generalises the stage disclosure:
`07` §6.4 — 2px `--border-strong` left border, `--space-4` inline padding,
`--fg-muted` text.

| Prop   | Type                           | Default   |
| ------ | ------------------------------ | --------- |
| `tone` | `neutral \| danger \| success` | `neutral` |
| `as`   | `p \| div \| aside`            | `p`       |

`07` §6.4 is emphatic about tone: "Not a warning banner, not a yellow box. The
tone is factual disclosure, not caution." `danger` and `success` exist for form
states (`07` §6.8, §6.10) and must not be used to dramatise ordinary prose.

**A Callout is never an alert.** No role, no `aria-live` — `07` §6.9 reserves
`role="alert"` for the error summary, which is a different component.

### `Divider`

A horizontal rule. `--border` is correct here: `07` §2 scopes that token to
"decorative rules and dividers only", which exempts it from SC 1.4.11.

| Prop         | Type      | Default | Notes                                      |
| ------------ | --------- | ------- | ------------------------------------------ |
| `decorative` | `boolean` | `false` | Adds `aria-hidden` when it adds no meaning |

Never used to fake spacing. Space is `Stack`'s job; a Divider asserts "these two
things are different", which is a semantic claim.

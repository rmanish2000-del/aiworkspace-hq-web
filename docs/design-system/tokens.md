# Token reference

Every token, its value, and its provenance.

**CANONICAL** — transcribed from P0 `07`. Changing a value is a specification
change, not a code change.
**EXTENSION** — new in P1-I. `07` specifies nothing here. Derived from a
canonical scale, and **not approved until ratified.**

Declared in two places, kept in step by `tests/unit/tokens.test.ts`:
[`src/styles/tokens.css`](../../src/styles/tokens.css) (CSS custom properties)
and [`src/lib/tokens.ts`](../../src/lib/tokens.ts) (typed values).

---

## Colour — CANONICAL (`07` §2)

Two themes, both first-class, following the OS via `prefers-color-scheme`. No
theme toggle: `07` §2 — "a control with no other controls around it is a stray".

| Token             | Light     | Dark      | Use                                    |
| ----------------- | --------- | --------- | -------------------------------------- |
| `--bg`            | `#FFFFFF` | `#0B0D0E` | Page background                        |
| `--bg-subtle`     | `#F6F7F8` | `#141719` | Form panel, success panel              |
| `--fg`            | `#111315` | `#F2F4F5` | Body text, headings                    |
| `--fg-muted`      | `#5A6167` | `#A2AAB1` | Hints, footer, eyebrow                 |
| `--border`        | `#DFE3E6` | `#262B2F` | **Decorative rules and dividers only** |
| `--border-input`  | `#848B92` | `#7A8288` | **All form-control borders**           |
| `--border-strong` | `#6B7278` | `#99A1A8` | Hovered control borders; Callout rule  |
| `--accent`        | `#1B4DE4` | `#7A9BFF` | Links, primary button, focus ring      |
| `--accent-fg`     | `#FFFFFF` | `#0B0D0E` | Text on the accent button              |
| `--danger`        | `#B3261E` | `#FF8A80` | Error text and error borders           |
| `--success`       | `#0F6E3D` | `#5FD39B` | Success panel accent                   |

`--accent-hover` and `--accent-active` are EXTENSION: `07` §6.5 specifies
"darkens ~8%" and "~14%" rather than values, so the two were computed and named
so the arithmetic is not repeated at each call site.

### The `--border` / `--border-input` distinction is load-bearing

`07` §2: `--border` is for decorative rules only and is exempt from SC 1.4.11;
`--border-input` is verified ≥3:1 against both `--bg` and `--bg-subtle`.

**Using `--border` on a control is a defect, not a style choice.** A unit test
asserts no component stylesheet uses `--border` on an input or button.

## Typography — CANONICAL (`07` §3)

System font stack, zero web fonts. `07` §3 / DEC-023: a web font costs a
render-blocking request, a layout-shift risk, and a third-party origin in the
privacy notice, in exchange for a signature a holding page does not need.

Fluid between the 360px and 1280px viewports via `clamp()`. Each middle term is
the line through (360, min) and (1280, max) — no value is hand-tuned.

| Token                    | Min  | Max  | Weight | Line height | Tracking  |
| ------------------------ | ---- | ---- | ------ | ----------- | --------- |
| `--type-wordmark`        | 17px | 19px | 600    | 1.2         | `-0.01em` |
| `--type-eyebrow`         | 13px | 14px | 600    | 1.3         | `0.06em`  |
| `--type-h1`              | 32px | 56px | 620    | 1.08        | `-0.02em` |
| `--type-hero-supporting` | 17px | 21px | 400    | 1.55        | `0`       |
| `--type-stage`           | 14px | 15px | 500    | 1.5         | `0`       |
| `--type-h2`              | 22px | 30px | 600    | 1.2         | `-0.01em` |
| `--type-h3`              | 16px | 18px | 600    | 1.35        | `0`       |
| `--type-body`            | 16px | 17px | 400    | 1.6         | `0`       |
| `--type-small`           | 13px | 14px | 400    | 1.5         | `0`       |
| `--type-input`           | 16px | 16px | 400    | 1.4         | `0`       |

**`--type-input` never goes below 16px.** Smaller triggers iOS Safari's
auto-zoom on focus, which is a usability failure, not a rendering nicety.

**Measure:** `--measure-body` 68ch, `--measure-h1` 18ch.

## Spacing — CANONICAL (`07` §4)

Base unit 4px. Every value is a multiple; there are no free lengths.

| Token       | Value | Token        | Value |
| ----------- | ----- | ------------ | ----- |
| `--space-1` | 4px   | `--space-7`  | 40px  |
| `--space-2` | 8px   | `--space-8`  | 48px  |
| `--space-3` | 12px  | `--space-9`  | 64px  |
| `--space-4` | 16px  | `--space-10` | 80px  |
| `--space-5` | 24px  | `--space-11` | 112px |
| `--space-6` | 32px  | `--space-12` | 160px |

Components take a **step**, not a length: `<Stack gap={6}>`, never `gap="32px"`.

## Container and breakpoints — CANONICAL (`07` §4, §5)

| Token             | Value                              |
| ----------------- | ---------------------------------- |
| `--container-max` | `720px`                            |
| `--container-pad` | `--space-5` → `--space-7` at 640px |
| `--breakpoint-sm` | `640px`                            |
| `--breakpoint-lg` | `1024px`                           |

Minimum supported width is **320px** — no horizontal scroll at or above it.

⚠️ CSS cannot use a custom property in a media query, so every `@media` repeats
the literal. `--breakpoint-*` exist for documentation and for the typed mirror;
they are not consumed by any query. Changing one changes nothing on its own.

| Range      | Behaviour                                                               |
| ---------- | ----------------------------------------------------------------------- |
| 320–639px  | Single column. Padding `--space-5`. Controls full width. Footer stacks. |
| 640–1023px | Padding `--space-7`. Footer becomes a row. CTA intrinsic width.         |
| ≥1024px    | Container caps at 720px and centres. Desktop vertical rhythm.           |

## Radius — `--radius` CANONICAL, the scale EXTENSION

| Token           | Value    | Provenance                            |
| --------------- | -------- | ------------------------------------- |
| `--radius`      | `8px`    | CANONICAL — `07` §6.5, §6.6           |
| `--radius-none` | `0`      | EXTENSION                             |
| `--radius-sm`   | `4px`    | EXTENSION — used by `Tag`             |
| `--radius-md`   | `8px`    | CANONICAL value, aliased into a scale |
| `--radius-full` | `9999px` | EXTENSION — used by `Badge`           |

## Motion — CANONICAL (`07` §8)

The page has essentially no motion. No scroll animation, no reveal-on-scroll, no
parallax, nothing auto-playing.

| Token             | Value    | Applies to                      |
| ----------------- | -------- | ------------------------------- |
| `--duration-fast` | `120ms`  | Button/link/input state changes |
| `--duration-swap` | `160ms`  | Form → success opacity swap     |
| `--duration-spin` | `800ms`  | Submit spinner rotation         |
| `--ease`          | `ease`   | The only easing `07` names      |
| `--ease-linear`   | `linear` | Spinner only                    |

Under `prefers-reduced-motion: reduce` every duration becomes **`0.01ms`**, not
`0` — a near-zero duration still fires `transitionend`, so handlers that wait on
it do not hang. `scroll-behavior: smooth` is applied only inside a
`no-preference` query.

P1-I constrains this system to token definitions only: **no component introduces
an animation.**

## Elevation — EXTENSION, and deliberately almost empty

| Token           | Value                        | Approved for use |
| --------------- | ---------------------------- | ---------------- |
| `--elevation-0` | `none`                       | ✅ yes           |
| `--elevation-1` | `0 1px 2px rgb(0 0 0 / .06)` | ⛔ no            |
| `--elevation-2` | `0 2px 8px rgb(0 0 0 / .08)` | ⛔ no            |

`07` §1 rejects "floating glass cards" and §6.2 gives the header "no border, no
shadow". **The page's depth model is that there is no depth.** The scale exists
because P1-I asks for one; using anything above 0 needs a visual approval.

## Z-index — EXTENSION

| Token           | Value | Note                                               |
| --------------- | ----- | -------------------------------------------------- |
| `--z-base`      | `0`   |                                                    |
| `--z-raised`    | `1`   |                                                    |
| `--z-sticky`    | `5`   | Reserved. `07` §6.2: the header is **not** sticky. |
| `--z-skip-link` | `10`  | The value `07` §6.1 uses. Must stay highest.       |

There are no modals, menus, or carousels (`07` §7), so this scale replaces a
magic number rather than enabling layering.

## Icon sizing — EXTENSION

| Token       | Value  | Note                                         |
| ----------- | ------ | -------------------------------------------- |
| `--icon-sm` | `16px` | Matches 14px error text (`07` §6.8)          |
| `--icon-md` | `20px` | Matches body text                            |
| `--icon-lg` | `24px` | Matches the consent checkbox box (`07` §6.7) |

The page body currently references **no images at all** (`07` §11 — image weight
0 bytes). The only icon `07` specifies is the inline warning glyph beside error
text, which must carry `aria-hidden="true"` and `focusable="false"`
(`08` HTML-09) because the text carries the meaning.

## Grid — EXTENSION

| Token        | Value       |
| ------------ | ----------- |
| `--grid-gap` | `--space-6` |

Columns collapse to one below 640px, always. `07` §4 mandates a single column at
every breakpoint for the current routes, so this is for later surfaces only.

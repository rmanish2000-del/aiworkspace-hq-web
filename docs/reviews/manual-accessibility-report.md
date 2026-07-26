# Manual accessibility report — P1-M §1 and §2

**Target:** WCAG 2.2 Level AA, no known failures (`08` §6).
**Scope:** A11Y-02 … A11Y-12 (`08` §6) and M-1 … M-10 (P0 `11` §8).
**Routes:** `/`, `/platform`, `/principles`, `/contact`, `/privacy`, `/404`.

Every item below carries an explicit status. Nothing is left blank, and nothing
that was not done is recorded as done.

## The honest summary first

| Status                                          | Count | Items                                                            |
| ----------------------------------------------- | ----- | ---------------------------------------------------------------- |
| **Pass — automated, every route, every engine** | 14    | A11Y-02, 03, 03b, 04, 05, 06, 07, 09, 10, 11, M-6, M-7, M-8, M-9 |
| **Pass — performed by systematic reading**      | 1     | M-10                                                             |
| **Not applicable, with reason**                 | 1     | A11Y-08                                                          |
| **NOT VERIFIED — no screen reader available**   | 3     | A11Y-12, M-1, M-2                                                |
| **NOT VERIFIED — no real device or OS mode**    | 3     | M-3, M-4, M-5                                                    |

**Six items are not verified.** They are not failures and they are not passes.
They are outstanding, and they stay outstanding until someone runs them on real
software. `nvda-checklist.md` is the instrument for four of the six.

**Do not read this report as a conformance claim.** It is evidence of what has
been checked and by what means.

---

## Why most of these were "manual" and no longer are

`08` §6 lists A11Y-02 to A11Y-12 as manual, and `11` §8 lists M-1 to M-10 the
same way. Most were manual only because nobody had automated them. Keyboard
order, focus visibility, indicator contrast, reflow, text spacing, touch targets
and forced colours are all mechanically checkable — and a machine now checks
them on every route, in every engine, on every push, instead of a person
checking them once and hoping nothing regresses.

Three genuinely cannot be automated here, and are not claimed: a real screen
reader, a real device, and real Windows High Contrast.

All automation lives in `tests/e2e/a11y-manual.spec.ts` and runs under
`npm run verify:release`.

---

## A11Y-02 · Full keyboard operability, no traps

**Status: PASS** (Blink, Gecko via CI). WebKit: see note.

Three independent assertions per route:

1. **Every focusable element is reached, exactly once, in DOM order.** Each
   focusable is stamped with its DOM index before tabbing, then the visited
   sequence must equal `[0, 1, 2, … n-1]`. Identity comes from the element, not
   its class — three nav links share one class, and a class-based check
   false-positives a trap that is not there.
2. **Focus moves on every press and finally leaves the document.** Focus that
   stops changing is a trap; the check tolerates at most the trailing presses
   that land on `<body>` after the last control.
3. **Shift+Tab reverses correctly.** The backwards sequence must be strictly
   descending — not merely "different", which a partial trap would satisfy.

**WebKit note.** Safari's "Press Tab to highlight each item on a webpage"
preference is off by default and no page can change it, so WebKit tabs only
between form controls. Tab _order_ is therefore asserted in Blink and Gecko. A
fourth test, **`every interactive element can take focus`**, runs in all three
engines: it focuses every control programmatically and asserts it actually
receives focus, which is the failure that would genuinely strand a keyboard
user. See `known-limitations.md` L-12.

## A11Y-03 · Visible focus indicator, and its contrast

**Status: PASS.**

- **Presence:** every focus stop paints either an outline ≥2px with a non-`none`
  style, or a `box-shadow`. Reported per element when it fails.
- **Contrast (SC 1.4.11):** the indicator colour is measured against what
  actually sits next to it, in both colour schemes, on the rendered page —
  not read off the `07` §2 table.

"Adjacent" depends on `outline-offset`. With a non-zero offset the ring is
separated from the control by a gap of page background, so page background is
the correct comparison; only at offset 0 does the ring sit against the control's
own fill. Both cases are handled. `07` §6.5 already anticipates this — the
primary button carries a 1px inner ring in `--bg` so the indicator survives
against the accent fill.

An earlier version of this check compared the ring against the control's fill
unconditionally and flagged the skip link at 1:1. That was the check being
wrong, not the site: the skip link's ring sits on a 2px gap of page background.

## A11Y-03b · Focused elements not obscured (SC 2.4.11)

**Status: PASS.**

For every focus stop, the element's own centre point is hit-tested with
`elementFromPoint`. If something else is on top — a sticky header, an overlay —
the focused control is obscured and the check fails.

## A11Y-04 · Text contrast measured, not assumed

**Status: PASS.**

Every text node's computed foreground and background are read from the rendered
page and the WCAG contrast ratio is computed directly (relative luminance per
the specification, not an approximation). Both colour schemes, every route.

The large-text rule is applied properly: 3:1 for text ≥24px, or ≥18.66px when
bold; 4.5:1 otherwise.

## A11Y-04b · Non-text contrast — form control boundaries (SC 1.4.11)

**Status: PASS.** _(New in P1-M. P0 `11` §9 named four combinations as the ones
that matter and they had never been measured — `07` §2's ratios are computed
from token values, which is a target on paper, not evidence.)_

Each control's painted border is measured against the background actually behind
it — found by walking up until an ancestor paints one — and against the
control's own fill, in both colour schemes. A boundary below 3:1 makes the
control invisible as a control, which is the point of the criterion.

- `--border-input` against `--bg`, light and dark — **≥3:1**
- `--border-input` against `--bg-subtle`, light and dark — **≥3:1**

A control with no border at all is a failure too, not a skip.

**The consent checkbox is excluded**, deliberately: it sets no border of its own
and the browser paints it, tinted by `accent-color`. SC 1.4.11 exempts
components whose appearance is determined by the user agent, and overriding it
would mean building a custom checkbox — which is a design decision, not a
defect fix.

## A11Y-05 · Reflow at 400 % (SC 1.4.10)

**Status: PASS** — automated. **By eye: not done** (see M-7).

400 % zoom at a 1280px viewport is equivalent to a 320px effective width, so
zoom is exercised as effective width: **200 % → 640px, 300 % → 427px,
400 % → 320px**. At each, no horizontal scrolling and no clipped content on any
route.

## A11Y-06 · Text-spacing overrides (SC 1.4.12)

**Status: PASS.**

The WCAG override values are injected — line-height 1.5×, letter-spacing 0.12em,
word-spacing 0.16em, paragraph spacing 2em — and no content is clipped or lost on
any route. This is the same transformation the standard bookmarklet applies, so
it also discharges **M-6**.

## A11Y-07 · Form labels and descriptions

**Status: PASS.** _(Previously recorded "n/a — no form in this scope"; a
visual-only form has existed since P1-H, so the item is live and now checked.)_

Every control on `/` must have a visible label and, where it declares one, a
description that resolves:

- every `input`/`textarea`/`select` has an associated `<label>` with text;
- every `aria-describedby` points at an element that exists and is non-empty —
  a dangling `aria-describedby` is silently ignored by assistive technology,
  which is worse than having none;
- the required field is marked `required`, so the state is programmatic and not
  only visual.

**Form errors** are not checked, because the form cannot produce one: it has no
action, no submit handler and no JavaScript. When it becomes functional, error
identification and association become a new assignment.

## A11Y-08 · Status messages announced without focus change

**Status: NOT APPLICABLE — no status update can occur.**

The site has zero client JavaScript, so nothing can change after first render
and there is no status message to announce.

A `role="status"` / `aria-live="polite"` region is nonetheless present in the
DOM from first render and asserted empty, non-`display:none`, and unique. `07`
§7 requires this: a live region injected at the moment of the update is
unreliably announced, so it must exist before there is anything to say. The
region is ready; there is nothing for it to carry.

## A11Y-09 · Touch targets

**Status: PASS — after two defects found and fixed.**

Measured at 390 × 844 on every route.

- **SC 2.5.8 minimum, 24 × 24:** applied to every target except those covered by
  the standard **inline exception** — a link flowing inside a sentence, whose
  size is constrained by the line-height of the surrounding text.
- **`07` §9's 44px:** applied to the design system's _controls_ — buttons, nav
  items, the wordmark link — which render as flex boxes and can grow. It is not
  applied to text links in prose, where a 44px inline box would overlap the
  lines above and below.
- **Labelled checkboxes** are measured as the union of the box and its label,
  because clicking the label toggles the control; that union is the real target.

**Defect A11Y-09-1 — the wordmark link was 104 × 20.** As a link it is a
standalone control, so the inline exception does not cover it, and it was four
pixels under the AA minimum. Fixed in `Logo.astro` with `min-height: 44px` and
`inline-flex`, matching `.site-nav__link`, which already set 44px. In the
centred flex row of `.site-header__inner` the two now agree, so the header keeps
its height. Only inner routes are affected — on `/` the wordmark is a `<p>`.

**Defect A11Y-09-2 — three standalone text links were 21px tall.** The
`/contact` privacy link, the `/privacy` back link and the `/` footer link each
sit alone in their own paragraph, where the inline exception is arguable at
best. Fixed in `Link.astro` with `padding-block: 2px`. Vertical padding on a
non-replaced inline element does not affect line-box height, so the hit box
grows to ≥25px with **no layout change and no visual change** — the element
paints no background.

## A11Y-10 · `prefers-reduced-motion`

**Status: PASS.**

Under `prefers-reduced-motion: reduce`, every transition duration on every route
collapses to ≤1ms and smooth scrolling is disabled. Checked as computed style on
the rendered page, not as the presence of a media query.

## A11Y-11 · Forced colours / Windows High Contrast

**Status: PASS under emulation** (Blink, Gecko). **Real High Contrast: NOT
VERIFIED** — see M-3.

With `forced-colors: active`: all text stays visible, the focus indicator
survives with width ≥1 and a non-`none` style, and the `aria-current` navigation
state is carried by an **underline** rather than font weight alone, because
weight is unreliable in forced colours.

Skipped in WebKit: Playwright does not emulate `forced-colors` there, so the
assertions would measure ordinary rendering and report it as high-contrast
evidence. Recorded as a skip with that reason rather than a pass.

## A11Y-12 · Screen-reader pass

**Status: NOT VERIFIED. No screen reader has run against this site.**

NVDA is not installed in this environment (`C:\Program Files (x86)\NVDA`
absent), no screen reader can be driven from the automated harness, and
VoiceOver requires macOS.

**What was done instead, and what it is worth.** The **accessibility tree** is
asserted on all six routes in every available engine, read from each engine's
own tree via `ariaSnapshot()` — the roles, accessible names, states and heading
levels a screen reader consumes as its input:

- exactly one `banner`, one `main`, one `contentinfo` per route;
- every `navigation` landmark named, and names distinct;
- no link exposed without an accessible name, and none named empty;
- `aria-current="page"` on exactly the current route's nav item;
- heading nesting with no skipped level;
- no heading followed by an empty section (see CONTACT-1 in
  `release-candidate-report.md`);
- the page title names the product on every route.

A wrong tree would guarantee a wrong screen-reader experience, so this rules out
a whole class of failure. **It is not a screen-reader pass.** Announcement
order, verbosity, punctuation handling and — most importantly — how the
deliberately withheld `/privacy` and `/contact` sections _sound_ can only be
established by listening.

**To close:** `docs/reviews/nvda-checklist.md`, 38 checks, Firefox and Chrome,
roughly 45 minutes.

---

## P0 `11` §8 — M-series

| ID   | Check                                         | Status                                                                                                                                                                         |
| ---- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M-1  | NVDA + Firefox                                | **NOT VERIFIED** — NVDA not installed. Checklist provided.                                                                                                                     |
| M-2  | VoiceOver + Safari                            | **NOT VERIFIED** — requires macOS, unavailable.                                                                                                                                |
| M-3  | Windows High Contrast                         | **NOT VERIFIED at OS level.** Emulation passes (A11Y-11). Real mode substitutes system colours at the OS level. Checklist item X-2.                                            |
| M-4  | Real iPhone Safari                            | **NOT VERIFIED.** WebKit at device viewports passes; hardware differs in touch handling, keyboard resize and safe areas.                                                       |
| M-5  | Real Android Chrome                           | **NOT VERIFIED.** As above, for Blink.                                                                                                                                         |
| M-6  | Text-spacing bookmarklet                      | **PASS** — the same overrides, automated (A11Y-06).                                                                                                                            |
| M-7  | 320px viewport by eye                         | **PASS automated, NOT DONE by eye.** No overflow or loss at 320px on any route in either scheme; aesthetic judgement is the founder's.                                         |
| M-8  | CSS disabled                                  | **PASS.** With every stylesheet removed, all six routes remain readable, the DOM order still reads skip link → wordmark → nav → h1 → content → footer, and no content is lost. |
| M-9  | Every visible string against `04`             | **PASS.** Every rendered string on every route is asserted to resolve from the copy module — so no string can reach a page without being approved copy first.                  |
| M-10 | Every visible string against `02` §1.3 and §3 | **PASS — by systematic reading.** See below.                                                                                                                                   |

### M-10 in detail — what was actually read

Every visible string on all six built routes was extracted from `dist/` and read
against the prohibited claim domains. **216 strings.** Findings:

- **No performance, adoption, availability, customer or pricing claim** anywhere.
- **Approved-direction marking is intact.** `/platform`'s capability section
  reads "Three things it is designed to do" and each item repeats "is designed
  to" — the [AD] marker survives into rendered text, which is exactly where it
  matters.
- **No competitor disparagement.** `/platform`'s "What it is not" closes with
  "none of them says that any of these tools does not work."
- **No absolute security guarantee.** `/privacy` states "No system is perfectly
  secure, and we do not claim otherwise."
- **Binding commitments present in rendered text:** C-11 stage disclosure ("AI
  Workspace is in development. Early access is not yet open.") on `/`,
  `/platform`, `/principles` and `/contact`; C-12 contact-only-about-early-access;
  C-13 no tracking cookies; C-14 no sell or share.

**One observation, not a defect.** `/privacy` describes operational behaviour
that does not exist yet — 30-day server logs, MFA-limited access to submissions,
24-month retention — and the home page's consent text describes storing details
the visual-only form cannot store. Both are correct for a notice that will be
published alongside a working form, and both would be inaccurate if published
today. This is one more reason `/privacy` must not be published in its current
state (`known-limitations.md` L-7), and it is over-disclosure rather than
under-disclosure.

**Who performed M-10.** This was a systematic reading of the extracted strings
by the implementing agent, not an independent human review. It catches novel
phrasings the automated prohibited-term list cannot, which is the point of the
check — but a second reader would be worth having before publication, since
`02` §3 is exhaustive of prohibited _domains_ and explicitly non-exhaustive of
phrasings.

---

## Defects found and fixed during P1-M

| ID        | Defect                                                     | Fix                                                                                         |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| A11Y-09-1 | Wordmark link 104 × 20 — under the SC 2.5.8 24px minimum   | `min-height: 44px` + `inline-flex` in `Logo.astro`                                          |
| A11Y-09-2 | Three standalone text links 21px tall                      | `padding-block: 2px` in `Link.astro` — no layout or visual change                           |
| CONTACT-1 | `/contact` rendered two `h2`s with completely empty bodies | Sections withheld rather than rendered headless; frozen by a regression test on every route |

Full defect list, including the ones that were test errors rather than site
errors, is in `release-candidate-report.md`.

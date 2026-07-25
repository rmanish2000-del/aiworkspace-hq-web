# Manual accessibility checks — record

**Status: ALL OUTSTANDING.** None has been performed.
**Target:** WCAG 2.2 Level AA, no known failures (`08` §6).
**Last updated:** 2026-07-25

---

## Why this file exists

axe-core catches roughly a third of accessibility defects. `08` §6 says so
plainly, and TDR-12's recorded condition is that a green CI run does **not**
discharge A11Y-02 through A11Y-12.

A green CI badge is the most common reason manual passes get skipped. This file
exists so that skipping them requires writing "not done" rather than saying
nothing.

## What automation has established

| Check                                                | Result                                    |
| ---------------------------------------------------- | ----------------------------------------- |
| A11Y-01 — axe-core, 0 violations                     | **Pass** — `/` and `/404`, light and dark |
| Skip link is first focusable and targets `#main`     | **Pass**                                  |
| Focus indicator present, ≥2 px                       | **Pass** — partial; contrast not measured |
| No positive `tabindex`                               | **Pass**                                  |
| Reduced motion disables smooth scrolling             | **Pass**                                  |
| Reflow — no horizontal scroll at 320/375/768/1280 px | **Pass**                                  |
| Reflow — 400 % zoom at 1280 px                       | **Pass**                                  |
| Text-spacing overrides do not clip                   | **Pass**                                  |
| Document outline, landmark map                       | **Pass**                                  |

These are useful signal. They are not the conformance claim.

## Outstanding — `08` §6 and P0 `11` §8

| ID       | Check                                                                                                      | Status                                              |
| -------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| A11Y-02  | Full keyboard operability; no traps                                                                        | ☐ Not done                                          |
| A11Y-03  | Visible focus indicator on every interactive element, **indicator contrast ≥3:1 against adjacent colours** | ☐ Not done — presence tested, contrast not measured |
| A11Y-03b | Focused elements not obscured by other content (SC 2.4.11)                                                 | ☐ Not done                                          |
| A11Y-04  | Text contrast ≥4.5:1; non-text UI ≥3:1 — **measured, not assumed**                                         | ☐ Not done                                          |
| A11Y-05  | Reflow at 400 % / 320 px                                                                                   | ◐ Automated only; not verified by eye               |
| A11Y-06  | Text-spacing overrides (WCAG 1.4.12) bookmarklet                                                           | ◐ Automated approximation only                      |
| A11Y-07  | Form errors identified in text and programmatically associated                                             | n/a — no form in this scope                         |
| A11Y-08  | Status messages announced without focus change                                                             | n/a — no status region in this scope                |
| A11Y-09  | Touch targets ≥24×24 CSS px minimum, ≥44×44 as implemented                                                 | ☐ Not done                                          |
| A11Y-10  | `prefers-reduced-motion` honoured                                                                          | ◐ Automated only                                    |
| A11Y-11  | Usable in Windows High Contrast / `forced-colors`                                                          | ☐ Not done                                          |
| A11Y-12  | Screen-reader pass: NVDA + Firefox, VoiceOver + Safari                                                     | ☐ Not done                                          |

## Outstanding — P0 `11` §8 manual checks

| ID   | Check                                                              | Status     |
| ---- | ------------------------------------------------------------------ | ---------- |
| M-1  | NVDA + Firefox                                                     | ☐ Not done |
| M-2  | VoiceOver + Safari                                                 | ☐ Not done |
| M-3  | Windows High Contrast — focus indicators and boundaries survive    | ☐ Not done |
| M-4  | Real iPhone Safari — no zoom on input focus, safe areas respected  | ☐ Not done |
| M-5  | Real Android Chrome                                                | ☐ Not done |
| M-6  | Text-spacing bookmarklet                                           | ☐ Not done |
| M-7  | 320 px viewport, by eye                                            | ☐ Not done |
| M-8  | CSS disabled — page readable, order sensible                       | ☐ Not done |
| M-9  | **Read every visible string against `04`, character by character** | ☐ Not done |
| M-10 | **Read every visible string against `02` §1.3 and §3 by hand**     | ☐ Not done |

M-9 and M-10 matter most. The automated test catches known strings; a human
catches novel phrasings. The automated prohibited-term list in
`tests/unit/copy.test.ts` is a floor, not a ceiling — `02` §3 is exhaustive of
the prohibited _domains_ and explicitly non-exhaustive of the phrasings.

## Contrast pairs still to be measured

`07` §2 gives target ratios computed from the token values. They should be
verified with a checker against the rendered page, not trusted from the table.
Four combinations matter most, per P0 `11` §9:

- `--border-input` against `--bg`, light and dark
- `--border-input` against `--bg-subtle`, light and dark

All four must be ≥3:1. Note that no form control is rendered in this scope, so
these tokens are currently unused — measure before Block 4 is built.

## When these must be completed

Before any request for deployment authorization (AG-3). `08` §6 lists them as
verification requirements, not as optional follow-up.

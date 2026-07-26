# Manual accessibility checks — record

**Status: 15 of 21 discharged. 6 outstanding, each named below.**
**Full evidence:** [`manual-accessibility-report.md`](./manual-accessibility-report.md)
**Last updated:** 2026-07-26 (P1-M)

---

## Why this file exists

axe-core catches roughly a third of accessibility defects. `08` §6 says so
plainly, and TDR-12's recorded condition is that a green CI run does **not**
discharge A11Y-02 through A11Y-12.

A green CI badge is the most common reason manual passes get skipped. This file
exists so that skipping them requires writing "not done" rather than saying
nothing.

## What changed in P1-M

Most of these items were manual only because nobody had automated them. Keyboard
order, focus visibility, indicator contrast, reflow, text spacing, touch targets
and forced colours are now checked mechanically on every route, in every engine,
on every push — see `tests/e2e/a11y-manual.spec.ts`. That is stronger than a
one-off human pass, because it cannot silently regress.

Three items genuinely cannot be automated here and remain outstanding. Three
more need hardware or an OS mode that is not available.

## Status — one line per item

Detail, method and evidence for each is in `manual-accessibility-report.md`.

| ID       | Check                                       | Status                                                                      |
| -------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| A11Y-01  | axe-core, 0 violations                      | Pass — all six routes, both schemes                                         |
| A11Y-02  | Full keyboard operability; no traps         | **Pass** — automated, per route                                             |
| A11Y-03  | Focus indicator present, contrast ≥3:1      | **Pass** — contrast now measured, not assumed                               |
| A11Y-03b | Focused elements not obscured (SC 2.4.11)   | **Pass** — hit-tested per focus stop                                        |
| A11Y-04  | Text contrast ≥4.5:1, measured              | **Pass** — computed from rendered pages                                     |
| A11Y-05  | Reflow at 400 % / 320 px                    | **Pass** — 200/300/400 % as effective widths                                |
| A11Y-06  | Text-spacing overrides (SC 1.4.12)          | **Pass**                                                                    |
| A11Y-07  | Form labels and descriptions                | **Pass** — item is live; a form has existed since P1-H                      |
| A11Y-08  | Status messages announced                   | **n/a** — zero client JS, so no update can occur. Region present and ready. |
| A11Y-09  | Touch targets ≥24×24, ≥44×44 as implemented | **Pass — after two defects fixed**                                          |
| A11Y-10  | `prefers-reduced-motion` honoured           | **Pass**                                                                    |
| A11Y-11  | Forced colours / High Contrast              | **Pass under emulation.** OS-level: see M-3                                 |
| A11Y-12  | Screen-reader pass                          | ☐ **NOT VERIFIED**                                                          |

| ID   | Check                        | Status                                                             |
| ---- | ---------------------------- | ------------------------------------------------------------------ |
| M-1  | NVDA + Firefox               | ☐ **NOT VERIFIED** — NVDA not installed                            |
| M-2  | VoiceOver + Safari           | ☐ **NOT VERIFIED** — requires macOS                                |
| M-3  | Windows High Contrast        | ☐ **NOT VERIFIED at OS level** — emulation passes                  |
| M-4  | Real iPhone Safari           | ☐ **NOT VERIFIED** — no device                                     |
| M-5  | Real Android Chrome          | ☐ **NOT VERIFIED** — no device                                     |
| M-6  | Text-spacing bookmarklet     | **Pass** — same overrides, automated                               |
| M-7  | 320 px viewport, by eye      | **Pass automated**, not done by eye                                |
| M-8  | CSS disabled                 | **Pass**                                                           |
| M-9  | Every visible string vs `04` | **Pass** — every rendered string resolves from the copy module     |
| M-10 | Every visible string vs `02` | **Pass** — 216 strings read systematically; findings in the report |

## The six that are outstanding

**A11Y-12, M-1, M-2** — no screen reader has read this site aloud. The
accessibility _tree_ is asserted in every engine, which is strong evidence and
not a substitute. The instrument to close them is
[`nvda-checklist.md`](./nvda-checklist.md): 38 checks, Firefox and Chrome,
roughly 45 minutes, founder-run.

**M-3** — real Windows High Contrast substitutes system colours at the OS level.
Covered as check X-2 in the same checklist.

**M-4, M-5** — no physical iPhone or Android handset, and P1-M forbids
introducing a device-cloud vendor. The engines those browsers ship are exercised
at device viewports; hardware still differs in touch handling, keyboard resize
and safe areas.

M-9 and M-10 remain the two that matter most for governance. The automated test
catches known strings; a reader catches novel phrasings. The prohibited-term list
in `tests/unit/copy.test.ts` is a floor, not a ceiling — `02` §3 is exhaustive of
the prohibited _domains_ and explicitly non-exhaustive of the phrasings. M-10 was
performed by systematic reading rather than by an independent human, and a second
reader is worth having before publication.

## Contrast pairs — now measured

The four `07` §2 / P0 `11` §9 combinations are no longer outstanding. A form is
rendered on `/`, so `--border-input` is in use, and a new check — **A11Y-04b,
non-text contrast (SC 1.4.11)** — measures each control's painted border against
the background actually behind it and against its own fill, in both schemes,
rather than trusting the token table:

- `--border-input` against `--bg`, light and dark
- `--border-input` against `--bg-subtle`, light and dark

All four are ≥3:1 as rendered.

The consent checkbox is excluded: it sets no border of its own and the browser
paints it, tinted by `accent-color`. SC 1.4.11 exempts components whose
appearance is determined by the user agent, and overriding it would mean
building a custom checkbox.

## When these must be completed

Before any request for deployment authorization (AG-3). `08` §6 lists them as
verification requirements, not as optional follow-up. Six remain outstanding,
so that bar is **not yet met**.

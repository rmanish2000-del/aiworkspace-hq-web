# ADR-0002 — Deviations from `03` and `04`, and why each was unavoidable

**Status:** Accepted provisionally — **three items need founder ratification**
**Date:** 2026-07-25
**Supersedes:** nothing
**Escalated in:** [`../../HANDOFF.md`](../../HANDOFF.md) §2

---

## Context

The authorized scope excludes forms, storage, endpoints, vendors, and
deployment. `03-page-information-architecture.md` and `04-final-public-copy.md`
describe the _complete_ P0 page, which includes all of those.

Where the two disagree, something has to give. This record states exactly what
gave, and why the alternative was worse. Every deviation below was forced — none
was an implementer preference.

The governing rule throughout is P1-A §7.1: Claude Code has no content
authority. It transcribes approved strings and never composes, edits, softens,
improves, shortens, or extends one. A needed string that does not exist is a
specification gap to be raised, not a gap to be filled in code.

---

## D-1 · Block 4 (Early interest) is not built

**Deviation from:** `03` §2, which marks Block 4 Required.

**Cause:** the assignment excludes forms outright. `AWHQ-AUT-P1F` MF-1 and MF-2
independently exclude any submission path, persistence, or storage.

**Alternative considered:** build the mock form states permitted by P1-F SD-7 —
default, focus, invalid, submitting, success — as presentation only. Rejected,
because the assignment's exclusion is narrower than SD-7's permission and the
narrower instruction governs.

**Consequence:** the document outline in `03` §4 loses its trailing
`h2 Register interest`. Everything above it is unchanged. The e2e test in
`tests/e2e/structure.spec.ts` asserts the reduced outline explicitly, so
restoring Block 4 will fail that test until it is updated deliberately.

**Ratification needed:** confirm forms were meant to be excluded.

---

## D-2 · The hero primary CTA is omitted

**Deviation from:** `03` §3 Block 2, item 5.

**Cause:** the CTA is specified as an in-page anchor to `#interest`. D-1 means
`#interest` does not exist.

**Alternatives considered:**

| Option                       | Rejected because                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Render the CTA anyway        | Leaves a dead in-page anchor — exactly what the link-check gate exists to catch         |
| Point the CTA somewhere else | Inventing a destination is a scope and content decision (P-10)                          |
| Render it disabled           | `04` specifies no disabled state for it; inventing one is a UX decision (P1-A §10.2(1)) |

**Precedent applied:** `AWHQ-AUT-P1F` §9.2 resolves the identical problem for
the footer's `Privacy` link — where a link's destination is out of scope, the
link and the destination are omitted **together**.

**Consequence:** `03` §3's fold constraint (eyebrow, `h1`, and the first line of
the supporting statement visible at 375×667) is easier to meet, not harder. The
approved strings survive verbatim in `copy.ts` as `hero.ctaLabel` and
`hero.ctaAccessibleName`.

A test asserts that no in-page anchor points at a missing target, so this class
of defect cannot reappear silently.

---

## D-3 · The footer renders with no copy

**Deviation from:** `03` §3 Block 5 and `04` §6.

**Cause:** all four lines are blocked at once.

| Line                                                 | Blocker                                |
| ---------------------------------------------------- | -------------------------------------- |
| `{{LEGAL_ENTITY_NAME}}, {{JURISDICTION}}`            | Open Item B; P-12 prohibits filling it |
| `Privacy` link                                       | `/privacy` not built (P-11); P1-F §9.2 |
| `{{PRIVACY_EMAIL}}`                                  | Open Item C; P-05                      |
| `© 2026 {{LEGAL_ENTITY_NAME}}. All rights reserved.` | Open Item B                            |

**Alternatives considered:**

| Option                              | Rejected because                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Drop the `<footer>` element         | `03` §5 requires exactly one `contentinfo` landmark; the landmark map is asserted by test |
| Render `© 2026` without the entity  | Edits an approved string — P-10                                                           |
| Leave the `{{...}}` placeholders in | `04`'s header note: build-time placeholders must never reach the browser                  |

**Consequence:** an empty `contentinfo` landmark. Valid HTML, no axe violation,
and honest about the state. The strings are held verbatim in `copy.ts` under
`footer`, so restoring the block is wiring, not a content decision.

**Ratification needed:** confirm an empty footer is the accepted interim state.

---

## D-4 · Two provisional strings exist that `04` does not contain

**Deviation from:** `04` §10 — "Implementation must contain no string not listed
here."

| ID     | String               | Why it cannot be omitted                                                                              |
| ------ | -------------------- | ----------------------------------------------------------------------------------------------------- |
| GAP-01 | Skip-link text       | `03` §2 Block 0 makes the skip link Required. A skip link with no accessible name is not a skip link. |
| GAP-02 | `<title>` for `/404` | `08` SEO-01 requires a unique title per route. `04` §1 supplies titles for home and privacy only.     |

**Containment:** both live in a single `PROVISIONAL` export in
`src/content/copy.ts`, separate from the approved copy, subject to the same
prohibited-term gate, and frozen by a unit test that fails if a third entry
appears. GAP-02's value composes the approved `04` §11 heading with the product
name, following the exact pattern of the approved privacy title.

No meta description is emitted on `/404`: `04` §1 specifies none and composing
one would be a third invention.

**Ratification needed:** ratify both into `04`, or supply replacements.

---

## D-5 · Metadata assets specified by `04` §8 and `08` are absent

| Absent                                              | Blocker                                                       |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `og:image`, `og:image:alt`                          | P-15 — brand asset; 0 of 8 IP assets have evidenced ownership |
| Favicon set, `apple-touch-icon`, `site.webmanifest` | P-15                                                          |
| `Organization` JSON-LD (`08` SEO-07)                | Requires a `logo` — P-15                                      |
| `robots.txt`, `sitemap.xml`                         | P-14 — would name a live host                                 |
| `security.txt` (`08` SEC-14)                        | Needs a real contact and expiry — Open Item C, P-13           |
| Security response headers (`08` §9.2)               | No host on which to set them — P-01, P-02                     |

**Note on the favicon.** An empty `data:` icon is emitted in `<head>`. It is not
a brand asset: it suppresses the browser's implicit `/favicon.ico` request,
which would otherwise 404 and consume one of the ≤6 first-load requests. It is
replaced by the real set when P-15 lifts.

---

## D-6 · The local workspace path departs from P1-A §3.2

**Specified:** `~/projects/aiworkspace-hq-web` — directory name byte-identical
to the repository name, no uppercase.
**Actual:** `C:\AI-Workspace-HQ`, as the assignment directed.

The assignment gave a reason: consistency with the other root-level project
folders on this machine. The instruction was explicit, so it was followed rather
than overridden — but it is a departure from accepted governance, and governance
is corrected by decision, not by drift.

**Ratification needed:** accept and amend P1-A §3.2, or move the working tree.

---

## What was _not_ deviated from

Every visible string that is rendered is verbatim from `04`. The five principles
are in the approved order. The binding commitments C-11 to C-14 are byte-exact
and asserted by test. No claim was added, softened, or extended. No colour,
spacing value, type size, or interaction rule was invented — all are transcribed
from `07`.

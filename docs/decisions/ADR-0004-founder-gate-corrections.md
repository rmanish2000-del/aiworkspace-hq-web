# ADR-0004 — Founder-gate corrections to P1-J and P0 `06`

**Status:** Accepted — ratified at the P1-K founder gate
**Date:** 2026-07-26
**Decider:** Founder
**Applies to:** `AWHQ-WEB-P1J` v1.0, P0 `06-privacy-notice.md`, P0 `03` §1

---

## Context

P1-K raised three items at its founder gate. All three were ratified. This
record exists because P1-A §6.1 makes decisions taken on the founder's behalf
recordable, and because two of them resolve conflicts that a future reader would
otherwise re-litigate.

**The implementation was approved unchanged.** Each correction below adjusts a
_specification_ to match what was correctly built — not the other way round.

---

## Decision 1 — `/principles` heading hierarchy

P1-J §7.3 specified the outline `h1 → h3 ×5 → h2`. P1-K implemented
`h1 → h2 ×5 → h2` instead, because the specified outline skips a level and
therefore:

- fails `08` HTML-03 ("no skipped heading levels");
- fails `08` HTML-01 (`html-validate` rejects it with `heading-level`);
- is a WCAG 1.3.1 problem — a screen-reader user navigating by heading hears a
  level-3 heading with no level-2 parent.

**Ratified:** the implementation stands. P1-J §7.3 is corrected to `h1 → h2`.

The level is genuinely different on the two routes, and correctly so: on `/` the
principles sit beneath the `h2` "How we are building it", so they are `h3`; on
`/principles` that same string _is_ the `h1`, so they are its direct children.
The strings are unchanged and still resolve from one shared copy entry — only
the element differs, and the element is structure, not copy.

## Decision 2 — the "single page" sentence in `06` Part B

P0 `06` Part B opens: _"This site is a single page. It does not have accounts,
does not sell anything, and does not track you across the web."_

The first sentence stopped being true when `/platform` shipped. It is the same
defect P1-J §10 caught in the `04` §11 404 string and corrected; P1-J did not
check `06` for it.

**Ratified:** the sentence is to be removed or replaced in `06`. Until approved
replacement text exists, the implementation continues to **withhold** the
paragraph — it is not edited in code, because P-10 reserves that to the
specification.

**Consequence:** `/privacy` renders its intro without that paragraph. This is
recorded in `WITHHELD_UNTIL_UNBLOCKED` and asserted by test. When the corrected
text arrives, restoring it is a transcription change.

## Decision 3 — P1-J supersedes the P0 single-page information architecture

P1-J §2.2 observed that `/platform`, `/docs` and `/contact` are named in P0 `03`
§1 as "not created at P0", that DEC-008 forbids a navigation menu, and that the
`04` §11 404 string must change — and concluded that a P0 v2.0 amendment was
required before the first route commit. P1-K could not verify that the amendment
had been recorded.

**Ratified, as a single decision rather than a further governance exercise:**

> **P1-J supersedes the original P0 single-page information architecture for
> Phase 1 implementation.**

No historical rewrite is required. `03` §1's route map, DEC-008's no-navigation
position, and the `04` §11 404 string are superseded for Phase 1 by P1-J §3,
§4.1 and §10 respectively.

---

## What this record does not do

It does not edit the canonical documents. P1-A §3.5 keeps accepted
specifications out of this repository, and §6.2 reserves their authorship. The
edits to `AWHQ-WEB-P1J` §7.3 and to P0 `06` Part B still need applying **in
those documents, by their owner**. This record is the repository-side statement
that the decisions were taken, and the reason the implementation looks the way
it does.

## Consequences

- `docs/reviews/implementation-notes.md` findings **P1K-1**, **P1K-2** and
  **P1K-3** move from open to resolved-pending-document-edit.
- The `/principles` heading levels are now a ratified decision, so changing them
  back would be a regression, not a correction. A test asserts the current
  outline.
- Nothing about the deployment posture changes. Open Items A, B and C remain
  open; AG-3 and AG-4 remain ungranted.

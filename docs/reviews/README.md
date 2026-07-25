# Reviews

Records of checks that a machine cannot perform, and of gate outcomes that need
to be traceable later.

| Record                                                             | Subject                                         | Status              |
| ------------------------------------------------------------------ | ----------------------------------------------- | ------------------- |
| [`manual-accessibility-checks.md`](manual-accessibility-checks.md) | `08` §6 A11Y-02…A11Y-12 and P0 `11` §8 M-1…M-10 | **All outstanding** |

## What belongs here

- Manual accessibility passes, with the date, the tool, and the outcome.
- Claim reviews under `02` §4, including the quarterly review P0 `12` C3
  requires.
- Gate records: which gate, which commit, which result.
- Contrast measurements taken against the rendered page rather than the token
  table.

## What does not belong here

Automated results. Those live in CI, where they are re-derived on every run
rather than transcribed once and left to rot.

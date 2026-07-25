# Reviews

Records of checks that a machine cannot perform, and of gate outcomes that need
to be traceable later.

| Record                                                             | Subject                                         | Status                                       |
| ------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------- |
| [`manual-accessibility-checks.md`](manual-accessibility-checks.md) | `08` §6 A11Y-02…A11Y-12 and P0 `11` §8 M-1…M-10 | **All outstanding**                          |
| [`lighthouse-local-baseline.md`](lighthouse-local-baseline.md)     | Lighthouse for `0.2.0`                          | **Local Baseline — not production evidence** |
| [`implementation-notes.md`](implementation-notes.md)               | Temporary omissions and open ratification items | 2 open                                       |

## What belongs here

- Manual accessibility passes, with the date, the tool, and the outcome.
- Claim reviews under `02` §4, including the quarterly review P0 `12` C3
  requires.
- Gate records: which gate, which commit, which result.
- Contrast measurements taken against the rendered page rather than the token
  table.
- Temporary implementation notes — omissions pending a later phase, and
  questions pending an answer.
- Performance baselines, **labelled by the environment that produced them**. A
  local figure and a production figure are different kinds of thing, and a
  record that does not say which it is will eventually be quoted as the other.

## What does not belong here

Automated results as a substitute for the run itself. CI re-derives those on
every push; transcribing them here would create a second copy to rot.

A baseline is different: it is a dated snapshot, kept deliberately so a later
run can be compared against it.

## What belongs in `../decisions/` instead

Long-term architectural decisions. If a note here stops being temporary — the
omission becomes permanent, or the open question is answered in a way that
constrains future work — it graduates to a decision record.

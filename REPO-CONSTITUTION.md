# REPO-CONSTITUTION

Standing rules for how changes land in `aiworkspace-hq-web`. These are the
rules the three-stream landing (LAND-THREE-STREAMS, 2026-08-11) was executed
under, written down so no future session has to reconstruct them from git
history. Changing a rule here is a founder act, not an editorial one.

## 1. Integration is by rebase, never by merge

Every stream lands on `main` by rebasing the feature branch onto `main` and
fast-forwarding or squashing through a PR. Merge commits are disabled in the
repository settings and must not be reintroduced. A rebase conflict that can
only be resolved by choosing one agent's work over another's is not resolved
by the integrator — it stops the landing and goes to the founder.

## 2. `scripts/ds-baseline/holding-page.json` is never hand-merged

The DS-D2 baseline is a recording, not a source file. On any conflict or any
authorised change to rendered output, it is re-recorded from a fresh build via
`node scripts/record-baseline.mjs` — and only as the **last** step of the
stream that is landing, so the recorded hashes describe the tree that ships.
A hand-edited hash in that file is a falsified verification record.

## 3. Frozen content changes require a founder authorisation entry

The seven frozen routes (six merchant-verification pages + `/warrant-guardian/`)
are enforced by `docs/governance/CONTENT-FREEZE.json` via
`scripts/content-freeze-check.mjs`. A rendered-text change without a matching
authorisation entry and new hash in that file, in the same commit, fails the
build. The footer entity block (legal name, address, GSTIN, Udyam) is content,
not chrome — see the Codex note at the end of `HANDOFF.md`.

## 4. Every templated route is canonical to itself

`scripts/verify-release.mjs` enforces the canonical-path guard: each route
document rendered through `Base.astro` carries exactly one
`<link rel="canonical">`, on `https://aiworkspacehq.com`, whose path resolves
back to the document that serves it. The static `/warrant-guardian/`
passthrough is the one exemption — it is frozen and not templated; its text is
enforced by the freeze check and scans A/B/C instead.

## 5. Gate scope of record

- **M-9** (every visible string resolves from the copy module) applies to
  every marketing route. The six merchant routes — `/terms` `/privacy`
  `/refunds` `/delivery` `/contact` `/about` — are excluded from M-9 by the
  Codex ruling recorded in `HANDOFF.md`; their text is governed by the content
  freeze and scans A/B/C. `/warrant-guardian/` gains no exemption from
  anything by that ruling.
- The prohibited-term floor in `tests/unit/copy.test.ts` — including `live`
  and `free tier` — applies to the copy module that feeds every marketing
  route, and is never weakened to admit merchant-page vocabulary.
- The full gate is: `npm run verify:release` + `npm run check:freeze` +
  `python scripts/content-scan.py` (scans A/B/C, against the BUILT output).

## 6. No production deploy from a working session

A green gate verifies a release candidate. It authorises nothing. Deployment
is a founder act, performed by the founder, after the gate is green and the
handoff has been read.

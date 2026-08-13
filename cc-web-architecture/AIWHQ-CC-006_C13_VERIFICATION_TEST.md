# AIWHQ-CC-006 — C-13 VERIFICATION TEST (NO COOKIES, NO CLIENT STORAGE)

**Document ID:** `AWHQ-WEB-CC006`
**Version:** 1.0 · **Date:** 3 August 2026 · **Author:** Claude Chat · **Assignee:** Claude Code (Claude Fable 5)
**Authorization band:** AG-1 + AG-2-S — local build, local browser automation only. ⛔ No deployment.
**Sequence:** **Runs after AIWHQ-CC-005's PR exists** (the DS-D1 `theme` key changes the assertion). Same session is fine. One active assignment at a time still holds: CC-005 → CC-006.

---

## OBJECTIVE

Convert binding commitment **C-13** from *asserted* to *verified by automated test* for the current build, and make that verification a permanent CI gate.

## CONTEXT

- **C-13 is already a committed public string** (P0 `04` §5.4, `06` §3): *"We do not use tracking cookies on this site."* Classified *Verified — and binding*, yet **no cookie test has ever run** — P1-M's verification covered accessibility, cross-browser and release gates only.
- Per P0 `02`'s traceability rule, if the site ever sets a non-essential cookie, **the sentence must be removed before that change ships.** So this test is the mechanism that enforces an existing promise — the highest-risk open evidence gate (`CL-03`, E-5).
- **DS-D1 (3 Aug 2026)** permits exactly one client-storage item: a first-party `theme` key. Nothing else.

## SCOPE

1. **Playwright test suite `c13-verification`** run against the local production build (`dist/` served locally), all routes in the build:
   - Assert `document.cookie` is empty — on load, after full interaction pass (navigation, theme toggle, form mock states MF-1…6, disclosures, reduced-motion and both themes).
   - Assert `localStorage` contains **at most the single key `theme`**, and only after the user operates the toggle — never on first paint.
   - Assert `sessionStorage`, `indexedDB` databases, and `caches` are empty.
   - Intercept and log **every network request**; assert zero third-party origins.
   - Assert no `Set-Cookie` header on any response from the local server.
2. **CI gate `G-C13`** added to `verify:release`: the suite runs on every build; any new cookie, storage key or third-party origin fails the build. Exit-code propagation verified (the P1-M `tail` lesson — prove a seeded failure fails the pipeline).
3. **Evidence artifact** `docs/evidence/C13_VERIFICATION.md`: date, commit hash, route list, assertions run, results, and the scope limitation below stated verbatim.

## SCOPE LIMITATION — STATE IT, DO NOT PAPER OVER IT

This verifies the **current artifact in a local environment**. It cannot verify what a hosting platform injects at the edge or what a bot-protection widget sets when one is integrated. Therefore the evidence artifact must state: **re-verification is mandatory at first deployment to any host, and again before any third-party widget ships** (HQ-12 demotion trigger D-3 applies if a cookie ever appears in production).

## PROHIBITED

⛔ No deployment "to test properly" · no third-party integration added · no change to public copy · no removal of the C-13 sentence (it passes or the build fails — that is the point).

## ACCEPTANCE CRITERIA

1. Suite green on all routes, both themes, reduced-motion included.
2. Seeded-failure proof: a deliberate `document.cookie` write in a throwaway branch fails CI.
3. `G-C13` in `verify:release`, exit codes propagating.
4. Evidence artifact complete with the scope limitation verbatim.
5. `verify:release` fully green including CC-005's six gates.

## STOPPING POINT

Stop after evidence is attached to the PR. Do not merge without founder acceptance. Report back with the evidence pack and exactly one proposed next assignment.

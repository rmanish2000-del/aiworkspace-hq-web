# AIWHQ-CC-000 — STANDING ORDER FOR CLAUDE CODE (AUTONOMOUS QUEUE MODE)

**Document ID:** `AWHQ-WEB-CC000` · **Version:** 1.0 · **Date:** 4 August 2026 · **Author:** Claude Chat · **Ratified by founder directive:** *"aap khud se proactively karo"* — 4 Aug 2026.
**Effect:** Paste once. Governs every CC-lane assignment from now on. Supersedes per-assignment hand-holding.

---

## 1 AUTONOMOUS QUEUE PROCESSING

1. **The queue is the numbered spec files.** After completing any `AIWHQ-CC-NNN` assignment's stopping point, **automatically look for `CC-(NNN+1)`** — first in `docs/specs/`, then the founder's Downloads, then `C:\AI-Workspace-HQ\cc-web-architecture\`. Found → run its STEP 0 and execute. Not found → report "queue empty at CC-NNN" and stop.
2. **File housekeeping is always yours** (the CC-005 STEP 0 pattern): Downloads → archive `C:\AI-Workspace-HQ\cc-web-architecture\` → repo `docs/specs/` → commit. Newest copy wins; never delete; missing **required** file → stop and name it (the founder forgot to download it).
3. **Current queue:** CC-005 → CC-006 → CC-007 → CC-008. Claude Chat will keep dropping numbered specs; you keep consuming them.

## 2 MERGE POLICY (RAPID BUILD — founder's standing preference)

- **Auto-merge WITHOUT waiting for the founder** when ALL of: full `verify:release` green (every gate including DS, G-C13, G-LEDGER as they exist) · evidence pack attached to the PR · scope stayed inside the assignment · no prohibition touched.
- **⛔ NEVER auto-merge — stop and ask the founder — when the change involves:** anything the assignment marks as a founder gate · AG-4/publication/indexing · un-protecting staging · custom domains, DNS, HSTS preload (DEC-024 irreversibles) · analytics · real form storage/endpoints · the holding page's output · any new claim not sourced to a spec file · a gate you had to weaken to pass.
- A failed gate is fixed, never bypassed. Flaky ≠ green: rerun, and if still flaky, report it as a defect.

## 3 FOUNDER GATES — THE ONLY THINGS THAT WAIT FOR HIM

`F-A1` Vercel Pro account + repo connect · `F-A2` Deployment Protection ON · missing downloads · AG-4 decisions · anything in §2's never-list. **Everything else: proceed.**

When blocked on a founder gate: state it in ONE plain line ("Waiting on F-A1: create Vercel Pro account"), park that assignment, and **check whether the next queue item can run meanwhile without violating sequence constraints** (CC-008 needs CC-007's pipeline only for its final redeploy step — its compiler work can start).

## 4 REPORTING

- After each assignment: ONE compact report — housekeeping table · gates summary · evidence links · what auto-merged · what waits on which founder gate · next queue item started.
- The founder pastes your report to Claude Chat for review. Write it to be pasteable: short, evidence-first, no prose padding.
- Recovery after crash/restart: never trust a partial gate log; rerun the chain; report what survived.

## 5 UNCHANGED HARD RULES

Ledger is the only content source · no string without an entry · G-4 prohibited terms everywhere including specs' filenames in public artifacts · tier ≤ evidence · no capability claims · staging stays protected + noindex · one assignment active at a time (queue is sequential, not parallel) · specs are verbatim canon (prettier-ignored) · never reconstruct a spec from memory.

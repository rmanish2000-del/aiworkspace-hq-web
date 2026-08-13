# REPO-CONSTITUTION

**Adopted:** 2026-08-12 (founder directive REPO-CONSTITUTION-IMPLEMENT).
**Scope:** every agent — human or AI — working on `aiworkspace-hq-web`.

Each rule is labelled with its enforcement status, per DC-6:

- **TEST-ENFORCED** — a script in `verify:release` (or CI) fails the build when
  the rule is broken. The label names the enforcing check.
- **HONOUR-SYSTEM** — nothing fails when the rule is broken. Per DC-6 this is
  an **absent protection**, written here as an instruction agents must obey,
  never as a safeguard that exists.

---

## 1. ONE FOLDER — `HONOUR-SYSTEM` for existence, `TEST-ENFORCED` for builds

The canonical working copy is **`C:\Push-to-Prod-2026\aiworkspace-hq-web`**.
**`C:\AI-Workspace-HQ` is retired.** No new work starts there.

- _TEST-ENFORCED:_ `verify-release.mjs` → "the build ran from the canonical
  folder" fails any `verify:release` run from a non-canonical local path.
  CI runners are exempt via the `CI` environment variable; `AIWHQ_PATH_EXEMPT=1`
  exists for one-off forensic runs and must be reported when used.
- _HONOUR-SYSTEM:_ nothing detects the retired folder merely existing on disk,
  or an agent editing files there without running the gate. Deleting the
  retired folder is a **founder click**, preconditioned on every branch in it
  being pushed.

## 2. EVIDENCE OVER CLAIMS — `HONOUR-SYSTEM`

Repository and Git evidence (`git log`, `gh pr view`, file contents at a
commit) override any chat claim about repository state, **from any agent or
any person, including the founder's own recollection**. An agent told
"X is merged" verifies from `git log origin/main` before acting. No test can
enforce an agent's epistemics; this is an absent protection that only
discipline supplies.

## 3. PUSH BEFORE CLEANUP — `HONOUR-SYSTEM`

**Unpushed work does not exist.** Nothing local is deleted, reset, rebased
away, or "cleaned up" until every commit it contains is on `origin`. Folder
deletion, branch deletion and history rewrites are founder clicks. No script
checks this before a human deletes a folder; it is an absent protection.

## 4. OWNERSHIP — `HONOUR-SYSTEM`

- **Codex** owns the brand system: `src/styles/`, `src/design-system/`,
  design tokens, the copy module (`src/content/copy.ts`) and its tests.
- **The merchant workstream** owns the six legal routes
  (`src/pages/warrant-guardian/*`, `src/legal/*.md`), the landing page
  (`public/warrant-guardian/`), and `docs/governance/CONTENT-FREEZE.json`.

Neither edits the other's files without **written authorisation recorded in
[`HANDOFF.md`](HANDOFF.md)**. No test knows which agent authored a diff; this
is an absent protection. (The _content_ of the merchant files is separately
TEST-ENFORCED by the freeze — see rule 6.)

## 5. SHARED BASELINE — `TEST-ENFORCED` for drift, `HONOUR-SYSTEM` for method

`scripts/ds-baseline/holding-page.json` is re-recorded **only** by
`node scripts/record-baseline.mjs`, **never hand-merged**, and only as the
**last step** before commit, after every content change is final.

- _TEST-ENFORCED:_ the DS-D2 gate fails when built output drifts from the
  recorded baseline.
- _HONOUR-SYSTEM:_ nothing detects that a hash was hand-edited rather than
  script-recorded; the gate passes either way if the values match. Absent
  protection.

## 6. FROZEN TEXT — `TEST-ENFORCED`

The seven frozen routes' **rendered visible text** changes only with a founder
authorisation entry in `docs/governance/CONTENT-FREEZE.json`, in the same
commit as the new hash. Enforced by `scripts/content-freeze-check.mjs`
(`check:freeze`, in `verify:release`). **Styling is free** — the hash is
tag-stripped, so CSS and markup changes that leave visible text identical pass
without authorisation. **The footer entity block (legal name, address, GSTIN,
Udyam) is CONTENT, not chrome** — merchant verification reads it off the page,
and it participates in the frozen hash.

## 7. METHOD — `HONOUR-SYSTEM`

Streams land by **rebase onto `main`, never merge-commits into a feature
branch**. On discovering a cross-agent conflict (two workstreams touching the
same surface, contradictory rulings, a state claim that repository evidence
contradicts), an agent **reports the conflict with both sides' evidence and
stops — it never picks a side**. No test can see intent; absent protection.

---

_Changing this file is itself a founder-authorised act. Reference it from
[`README.md`](README.md) and [`HANDOFF.md`](HANDOFF.md); do not fork its rules
into other documents._

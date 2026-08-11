# HANDOFF

**From:** Claude Code, delegated implementer under AG-2-S
**To:** Founder
**Assignment:** Repository initialization and non-public development foundation
**Date:** 2026-07-26
**Stopping point reached:** yes — work has stopped and awaits a founder act

> **Phase 1 is complete and frozen** as of P1-M.1. The repository is tagged
> `v0.6.0-rc1` at implementation version `0.6.0`. Deployment is **not
> authorized** and nothing has been published. The escalations below still
> stand, and §5 lists what needs a founder act next — the NVDA checklist is the
> largest remaining gap.

---

## 1. What was asked, and what was delivered

The assignment asked for repository initialization, the tooling and CI
foundation, and a homepage, 404, layout, typography and responsive shell built
from approved copy only, with no deployment and no external services.

All of it was delivered. Every gate that can run without a vendor passes. The
detailed state is in [`PROJECT_STATE.md`](PROJECT_STATE.md); the numbers are not
repeated here.

---

## 2. Escalations — these need a founder decision

### E-1 · Two visible strings do not exist in the approved copy ⚠️

`04` §10 states that the implementation must contain no string not listed in it.
Two strings are required by the page and are absent from `04`.

| ID     | String needed        | Why it cannot be omitted                                                                              | Provisional value used          |
| ------ | -------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| GAP-01 | Skip-link text       | `03` §2 Block 0 makes the skip link Required. A skip link with no accessible name is not a skip link. | `Skip to main content`          |
| GAP-02 | `<title>` for `/404` | `08` SEO-01 requires a unique title per route. `04` §1 gives titles for home and privacy only.        | `Page not found — AI Workspace` |

Neither could be resolved by omission without breaking a different approved
rule, so both are implemented, quarantined in a `PROVISIONAL` export in
`src/content/copy.ts`, and subjected to the same prohibited-term gate as
approved copy. A unit test fails if a third entry is ever added, so this cannot
become a quiet route for unapproved wording.

**Required act:** ratify both into `04` as a new version, or supply
replacements. Until then, two strings on the site are unapproved.

### E-2 · The footer renders with no text at all ⚠️

All four approved footer lines are blocked simultaneously:

| Line                                                 | Blocked by                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `{{LEGAL_ENTITY_NAME}}, {{JURISDICTION}}`            | Open Item B; P-12                                                                  |
| `Privacy` link                                       | `/privacy` is not built (P-11); P1-F §9.2 directs omitting link and route together |
| `{{PRIVACY_EMAIL}}`                                  | Open Item C                                                                        |
| `© 2026 {{LEGAL_ENTITY_NAME}}. All rights reserved.` | Open Item B                                                                        |

The `<footer>` element is still rendered, because `03` §5 requires exactly one
`contentinfo` landmark and removing it would change the landmark map. It
contains an HTML comment and nothing else.

**Required act:** confirm that an empty footer is the accepted interim state.
The alternative — filling any line — is prohibited by P-12 and P-10.

### E-3 · The hero has no call to action

`03` §3 specifies the primary CTA as an in-page anchor to `#interest`. The
assignment excludes forms, so Block 4 is not built and `#interest` does not
exist. Rendering the CTA would leave a broken in-page anchor.

Both were omitted together, following the precedent P1-F §9.2 sets for
`/privacy`. The approved CTA strings are retained verbatim in `copy.ts`.

**Required act:** none, if the exclusion of forms was intended. Confirm.

### E-4 · The local folder path departs from the recorded convention

| Source                         | Path                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| P0 `11` §2, P1-A §3.2, P1-F §4 | `~/projects/aiworkspace-hq-web`                                  |
| This assignment                | `C:\AI-Workspace-HQ`                                             |
| **Actual**                     | `C:\AI-Workspace-HQ` — the assignment's instruction was followed |

P1-A §3.2 requires the directory name to be byte-identical to the repository
name and prohibits uppercase in the path. `C:\AI-Workspace-HQ` satisfies
neither: it is not `aiworkspace-hq-web`, and it is capitalised.

The instruction was explicit and gave a reason — consistency with the other
root-level project folders on this machine — so it was followed rather than
overridden. It is recorded here because it is a departure from accepted
governance, and governance is corrected by decision, not by drift.

**Required act:** either accept the departure and amend P1-A §3.2, or move the
working tree to a conforming path.

### E-5 · Build telemetry was an unnoticed outbound request

The framework's first build printed a notice that it collects anonymous usage
data. That is an outbound third-party request originating from the build, inside
a scope whose whole premise is that no external service is contacted.

It was disabled immediately (locally, and via an environment variable in CI) and
is documented in `README.md`. No further outbound traffic has been observed.

**Required act:** none. Recorded because "no external services" needs to include
the toolchain, not only the page.

### E-6 · The dependency audit failed on first install, and was fixed by upgrading ⚠️

The initial dependency set produced **22 findings: 1 critical, 18 high**. `08`
SEC-11 and §14 make `npm audit --audit-level=high` a merge gate, so this was a
genuine gate failure, not a warning.

Resolved by upgrading every direct dependency to its current release and adding
four `overrides` entries for transitive packages whose parents still pin a
vulnerable range (`brace-expansion`, `minimatch`, `tmp`, `sharp`). The audit
gate now passes.

Two consequences worth a decision:

1. **The upgrade crossed major versions** — the site framework, the linter, and
   the test runner all moved a major version. Every gate was re-run afterwards
   and all pass. The alternative was starting a new repository on a stack with a
   known critical advisory, which is worse.
2. **Two moderate findings remain**, knowingly. The only remediation offered is
   a breaking downgrade of the Lighthouse CLI that would lose the budget
   assertions. Detail and reasoning: `PROJECT_STATE.md` §6.

**Required act:** confirm the accepted moderate findings, or direct that the
Lighthouse CLI be downgraded and the budget assertions reworked.

### E-7 · The pinned Node version is newer than the one the gates were run on

Two build-time dependencies require `node: ^22.22.3`. `.nvmrc` was therefore
pinned to **22.23.1**. The machine used for verification has **22.14.0**.

All gates pass on 22.14.0 with engine warnings and no errors. The pin is newer
than the verified version, not older, so the direction of risk is favourable —
but the pinned combination is unverified until CI runs.

**RESOLVED.** The first CI run installed 22.23.1 from `.nvmrc` and every job
succeeded on it. The pin is verified. No act required.

### E-8 · Three required repository controls are blocked by the account plan ⛔

**This is the most consequential finding in this handoff.**

P1-A §4.1 makes `main` a protected branch: no direct push, no force push, no
deletion, linear history, required status checks. P1-A **CC-9** requires that
protection to be active **before the first product commit**. P1-A §2.4 step 5
additionally requires secret scanning.

None of it could be applied. Every attempt was refused:

| Attempted                           | Result                                                       |
| ----------------------------------- | ------------------------------------------------------------ |
| Repository ruleset on `main`        | `403 — Upgrade to GitHub Pro or make this repository public` |
| Classic branch protection on `main` | `403 — Upgrade to GitHub Pro or make this repository public` |
| Secret scanning + push protection   | `422 — Secret scanning is not available for this repository` |
| Code scanning (CodeQL upload)       | `403 — Code scanning is not enabled for this repository`     |

One cause: on GitHub Free these features exist on **public** repositories only,
and the account has no paid plan.

The CodeQL consequence is worth stating separately. The analysis itself runs
fine; it fails only when uploading results. Rather than leave a permanently red
check — which teaches everyone to ignore CI — the workflow now probes the
code-scanning API first and skips the analysis when it is unavailable, with a
job summary saying so. It starts working by itself the moment the plan allows
it. The workflow was **not** deleted: a skipped job stays visible, a deleted one
is forgotten.

**The two obvious workarounds are both prohibited:**

- Making the repository public breaches SEC-12, P-09, and P-17.
- Creating an organization in the operating entity's name is the foreign-vendor
  contract that P1-F §4.1 routes to counsel while OBJ-6 is unresolved.

**What was applied instead**

| Control                                        | State                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Visibility private                             | ✅ Verified                                                                       |
| Default branch `main`                          | ✅                                                                                |
| Sole collaborator                              | ✅ Only the account owner                                                         |
| Dependabot alerts                              | ✅ Enabled                                                                        |
| Dependabot automated security fixes            | ✅ Enabled                                                                        |
| Merge commits disabled; squash and rebase only | ✅ — approximates linear history by convention                                    |
| Delete branch on merge                         | ✅                                                                                |
| `gitleaks` as a CI gate                        | ✅ — this is what P1-F S-5 actually relies on, and it does not depend on the plan |
| CodeQL                                         | ⛔ Configured, skips itself while code scanning is unavailable                    |

So the secret-scanning objective is met by `gitleaks` in CI, which is what P1-F
S-5 actually relies on. The **branch-protection objective is met by nothing.**
Direct pushes to `main` are currently possible, and nothing mechanically
enforces that CI passed before a merge.

**Required act — choose one:**

1. Upgrade the personal account to GitHub Pro. This is a cost decision and a
   personal-name subscription, not a company contract; it does not engage OBJ-6.
2. Accept the gap explicitly, amend P1-A CC-9 to reflect it, and rely on
   convention until the repository moves to an organization under trigger T-F1.
3. Direct some other arrangement.

Until one is chosen, the repository is **not** in the configuration P1-A §4.1
describes, and `PROJECT_STATE.md` should not be read as claiming otherwise.

---

## 3. Assumptions made

| #   | Assumption                                                                                                                         | If wrong                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| A-1 | The four conditions C-1…C-4 of P1-F §11 were satisfied and AG-1 + AG-2-S were granted, since the assignment directs implementation | All work is unauthorized and must be reverted                               |
| A-2 | "No forms" in the assignment overrides the mock-form permission in P1-F SD-7                                                       | Block 4 should be built as presentation-only states                         |
| A-3 | `/privacy` is out of scope, so P1-F §9.2's "omit entirely" option applies                                                          | An empty `/privacy` route should be scaffolded and the footer link restored |
| A-4 | The GitHub account `rmanish2000-del` is the personal account P1-F §4 names                                                         | The repository is in the wrong account                                      |
| A-5 | A `LICENSE` placeholder was wanted despite P0 `11` §2 saying to omit one                                                           | Delete `LICENSE`                                                            |

---

## 4. What must not be assumed from this handoff

This assignment produced **no** deployment, **no** vendor account, **no** DNS
change, **no** secret, **no** personal data, **no** public URL, and **no**
governance change. Nothing here authorizes any of those.

**Manual accessibility, as of P1-M: 15 of 21 discharged, 6 outstanding.** A
green CI run still does not discharge them — TDR-12's condition stands — but
most are now checked mechanically on every route and engine rather than being
waited on. The six that remain need software or hardware that is not available
here:

- **A11Y-12, M-1, M-2** — no screen reader has read this site aloud. NVDA is not
  installed and cannot be driven from the harness. The accessibility _tree_ is
  asserted in every engine, which is strong evidence and **not** a substitute.
- **M-3** — real Windows High Contrast, as opposed to the emulation that passes.
- **M-4, M-5** — a real iPhone and a real Android handset.

Status per item: [`docs/reviews/manual-accessibility-checks.md`](docs/reviews/manual-accessibility-checks.md).
Evidence and method: [`docs/reviews/manual-accessibility-report.md`](docs/reviews/manual-accessibility-report.md).
Everything the release candidate does **not** prove: [`docs/reviews/known-limitations.md`](docs/reviews/known-limitations.md).

---

## 5. Next founder acts, in order

1. **Run the NVDA checklist** — [`docs/reviews/nvda-checklist.md`](docs/reviews/nvda-checklist.md),
   38 checks, ~45 minutes. Closes A11Y-12, M-1, M-2 and M-3, the four largest
   remaining gaps.
2. Resolve **E-1** — ratify or replace the two provisional strings.
3. Confirm **E-2**, **E-3**, **E-4**.
4. Verify remote repository settings — see §6 below.
5. Continue closing Open Items A, B, C, D. Nothing further should be built on
   the public surface until the relevant item is closed.

---

## 6. Repository configuration to verify

Branch protection was requested at initialization. On a personal account, some
protection features depend on the plan in force.

**Verify by hand, in the repository settings:**

- [ ] Visibility is **Private**
- [ ] Default branch is `main`
- [ ] `main` rejects direct pushes and force pushes
- [ ] Linear history required
- [ ] Required status checks include every CI job
- [ ] Secret scanning **and** push protection are on
- [ ] Dependabot alerts and security updates are on
- [ ] No collaborator, bot, or integration beyond GitHub Actions has access
- [ ] MFA is enforced on the account

If any protection could not be applied, that is a finding, not a detail: P1-A
CC-9 requires branch protection to be active **before** the first product
commit.

## FOR CODEX — one line that outranks any redesign note

**The footer entity block is CONTENT, not chrome.** The legal name, address,
GSTIN and Udyam number on the six merchant pages (and any footer that carries
them) are what merchant verification reads off the live site. A redesign that
tidies the entity block away, collapses it, or moves it behind a click breaks
merchant verification. It is inside the content freeze
(`docs/governance/CONTENT-FREEZE.json`); changing it needs an explicit founder
authorisation, not a design judgement.

# AIWHQ-CC-007 — FIRST DEPLOYMENT (STAGING) + AG-3 RECORD

**Document ID:** `AWHQ-WEB-CC007`
**Version:** 1.0 · **Date:** 4 August 2026 · **Author:** Claude Chat · **Assignee:** Claude Code (Claude Fable 5)
**Sequence:** After CC-005 and CC-006 evidence packs exist. One active assignment at a time: CC-005 → CC-006 → CC-007.

---

## 0 AUTHORIZATION RECORD — GATE 0 AND AG-3

| Item | Status | Basis |
| --- | --- | --- |
| **Gate 0 — CORPORATE** | 🟢 **RELEASED — founder statement, 4 Aug 2026** (*"counsel clear hai"*) | ⚠ Recorded as **Reported** until the written counsel opinion is filed. **Founder action F-A3:** file the counsel opinion PDF into project knowledge and `C:\AI-Workspace-HQ\p1e-corporate-evidence\` when received. Nothing in this assignment waits for it — the founder's authority to proceed is his own |
| **AG-3 — DEPLOYMENT** | 🟢 **GRANTED by the founder's directive of 4 Aug 2026** (*"aap aage badhiye"*), scoped as follows | Scope: **staging environment only · access-protected · noindex · no custom domain · no apex · no production target.** AG-4 (publication) remains ⛔ NOT granted |
| **TDR-03 — Vercel hosting** | 🟡 CONDITIONAL — V-1…V-3 verified **inside this assignment** | P1-B |

## FOUNDER PRECONDITIONS (before Claude Code can start)

| # | Action | Why |
| --- | --- | --- |
| **F-A1** | Create the Vercel account on the **Pro plan** (paid) and connect the `aiworkspace-hq-web` repo (or provide a deploy token) | ⛔ **The Hobby tier prohibits commercial use — this is our own recorded rejection reason.** Deploying on Hobby would violate our own filed finding |
| **F-A2** | In Vercel project settings, turn **Deployment Protection ON** (password or Vercel Authentication) before the first deploy | HQ-12: a reachable URL is an audience; staging must be access-controlled, not merely unindexed |
| **F-A3** | File the written counsel opinion when received | Evidence discipline (REG-4) |

---

## OBJECTIVE

Deploy the current verified build to an access-protected Vercel staging environment, verify the TDR-03 conditions (V-1…V-3) against the real account, and re-verify C-13 against the **deployed** artifact — closing the scope limitation CC-006 recorded.

## STEP 0 — FILE HOUSEKEEPING (STANDING)

As in CC-005: locate this file in Downloads → archive to `C:\AI-Workspace-HQ\cc-web-architecture\` → copy to `docs/specs/` → commit. Missing → STOP and report.

## SCOPE

1. **Pre-deploy verification of the account (TDR-03 closure):**
   - **V-1:** Confirm the project is on the **Pro plan** — capture plan name from dashboard/API into evidence. **⛔ If Hobby: STOP. Do not deploy.** Report to founder.
   - **V-2:** Capture the plan's **log-retention** specification from Vercel's current documentation/settings; record what the plan actually provides against the 30-day requirement. Record the finding either way — **do not silently absorb a shortfall; report it.**
   - **V-3:** Capture the commercial-terms page version/date permitting this use.
2. **Deployment configuration:**
   - Staging deployment from the merged main (CC-005+006 merged after founder acceptance — confirm merge is authorized before deploying; if not merged, deploy the approved branch build).
   - **Deployment Protection verified ON** (assert an unauthenticated request gets a challenge, not the site).
   - `X-Robots-Tag: noindex, nofollow` on every response **and** meta robots noindex — belt and braces.
   - No custom domain attached. No production promotion. Vercel Analytics/Speed Insights **OFF** (AN-1: analytics ships only after C-13 verification — and never before AG-4).
3. **Deployed C-13 re-verification (HQ-12 D-3 discipline):**
   - Run the CC-006 Playwright suite **against the deployed staging URL** (authenticate through the protection first).
   - **Inventory every cookie observed, including platform-injected ones.** Classify each: access-control (the deployment-protection cookie is expected and is not a tracking cookie) · functional · **tracking (= build fails + immediate report)**.
   - Record edge-injected headers/scripts, if any.
4. **Evidence pack:** plan proof (V-1) · retention finding (V-2) · terms capture (V-3) · protection challenge proof · noindex header capture · full cookie inventory with classification · C-13 suite results on the deployed URL · the staging URL itself.

## PROHIBITED

⛔ Hobby-tier deploy · public/unprotected URL · custom domain · apex DNS changes · HSTS preload · nameserver delegation (DEC-024 irreversibles stay unperformed) · analytics · any indexing · sharing the URL with anyone beyond the founder (HQ-12 PP rules apply the moment anyone else sees it).

## ACCEPTANCE CRITERIA

1. Staging URL live behind protection; unauthenticated request blocked.
2. V-1 = Pro, evidenced. V-2 and V-3 findings recorded honestly, shortfalls flagged not absorbed.
3. C-13 suite green against the deployed URL; cookie inventory complete; zero tracking cookies.
4. noindex verified in response headers on every route.
5. Evidence pack attached; `verify:release` still green in CI.

## STOPPING POINT

Stop after the evidence pack. Report the staging URL **to the founder only.** Do not promote to production, do not attach domains, do not index. Propose exactly one next assignment.

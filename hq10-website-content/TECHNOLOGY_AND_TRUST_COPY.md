# TECHNOLOGY_AND_TRUST_COPY.md

**Document ID:** `AWHQ-CONTENT-HQ10-TECHTRUST`
**Version:** 1.0 · **Date:** 27 July 2026 · **Owner:** AI Workspace HQ
**Routes:** `/technology` · `/trust` · **both Primary navigation, both Gate 3**
**Source:** HQ-7 Technology Genome — **only the 8 `Verified and Accepted` entries**
**Status:** Complete content. **⛔ Not published.**

> **⛔ `/technology` renders eight technologies and two rejections. Nothing `Proposed`, nothing `Not Used`, no version number, no topology.**
>
> **⚠ The lead is not the component list. It is `CB-32` — the recorded runtime exit strategy** — because that is the claim almost no vendor can make and it answers the hardest question an evaluator has.

---

# TECHNOLOGY — `/technology`

### `CB-30` — headline

> What we run on, and what happens if we are wrong about it.

`CL-05` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-01/02/03 — ADR-0003, ADR-0004, P1.5 packaging [Reported by founder]

### `CB-31` — subheadline

> Every component below is open source or an open standard. You could run all of it without us.

`CL-07` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-01..TG-06 — lock-in LOW or lower on every accepted technology [Verified from the register]

⚠ Verifiable by inspection — the reader can check it without trusting us.

### `CB-32` — lead

> When we adopted our current runtime we wrote down the conditions under which we would replace it. That exit strategy was recorded at the moment of the decision, not afterwards.

`CL-06` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-02 — ADR-0004 records replacement boundaries at adoption [Reported]

⚠ THE LEAD, not the component list. It answers the hardest question an evaluator has.

### `CB-33` — stack

> We run on PostgreSQL for data, Node.js as the application runtime, and Docker with Docker Compose for packaging and deployment. Source control is Git, dependencies are managed with npm, and an automated test and release pipeline runs before anything ships.

`CL-05` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-01/02/03 — ADR-0003, ADR-0004, P1.5 packaging [Reported by founder]

⛔ The eight Verified and Accepted entries only. ⛔ NO version numbers, NO topology — G-7.

### `CB-34` — lockin

> None of these locks us in. Standard SQL, an open container format and an open-source runtime mean the cost of moving is real but bounded, and it is ours to pay rather than a vendor's to set.

`CL-07` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-01..TG-06 — lock-in LOW or lower on every accepted technology [Verified from the register]

### `CB-35` — rejected-1

> We rejected a free hosting tier because its licence prohibits commercial use. We found that during verification, before it reached anything.

`CL-08` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-13 Vercel Hobby (prohibits commercial use) · TG-14 log retention [Verified]

### `CB-36` — rejected-2

> We rejected a log-retention assumption because the retention we had designed for was not available on any plan without a paid add-on. The design assumed it; verification showed otherwise.

`CL-08` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-13 Vercel Hobby (prohibits commercial use) · TG-14 log retention [Verified]

### `CB-37` — limitation

> Our current deployment runs on a single host. That is a deliberate choice at this stage and a real ceiling; we have not built the orchestration that would remove it.

`CL-34` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-13 / CL-13 — CAP-FDN-900 Agent Identity is an M0 placeholder, deliberately not started [Reported]

⚠ Stating a scale ceiling plainly. HQ-7 TG-04 records it as the estate's clearest boundary.

### `CB-38` — footnote

> Last reviewed 25 October 2026.

*Basis:* Publication process — COPY-6 quarterly review cadence. A process fact, not a product claim.


# TRUST — `/trust`

### `CB-10` — headline

> What we can be held to, and what we cannot.

`CL-11` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* This architecture · HQ-7 01 §5 enterprise readiness [Verified]

TR-1: the page opens with what is missing.

### `CB-11` — subheadline

> Everything below is either something we can show you, or something we are telling you we do not have.

`CL-11` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* This architecture · HQ-7 01 §5 enterprise readiness [Verified]

Sets the binary the rest of the page keeps.

### `CB-12` — missing-1

> We hold no third-party security certification, and none is in progress.

`CL-20` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 01 §5 question 8 — no SOC 2, no ISO 27001, none in progress [Verified]

⚠ "certification" not "certified" — the adjective is the claim, the noun in a denial is a fact. COPY-4.

### `CB-13` — missing-2

> We do not offer single sign-on.

`CL-31` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 01 §5 question 1 — no evidenced OIDC/SSO; CAP-FDN-900 is M0 [Verified]

### `CB-14` — missing-3

> We do not offer an uptime commitment.

`CL-32` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 01 §5 question 5 — no SLO exists [Verified]

### `CB-15` — missing-4

> We do not yet publish a process for reporting a security flaw to us.

`CL-33` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 01 §5 question 10 — no disclosure policy or response process evidenced [Verified]

⛔ SP-3 — until this exists, no security claim may be made anywhere on the site.

### `CB-16` — method-1

> Before anything reaches production we verify it. That check has so far caught eleven material defects, including a hosting tier whose licence prohibited commercial use.

`CL-10` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* P1-C — eleven material defects caught at a gate before production [Verified]

⚠ The COUNT is publishable; the defect list is not. The named example is CL-08, publishable in full.

### `CB-17` — method-2

> Architecture decisions are recorded with their reasoning at the time they are made.

`CL-09` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-09 — ADR practice, numbered to at least ADR-0004 [Reported]

### `CB-18` — ai-1

> Our written material is drafted with AI assistance and reviewed by a person before publication.

`CL-16` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* ⚠ Every document in this programme is AI-drafted and founder-reviewed [Verified — this pack is the evidence]

### `CB-19` — ai-2

> We integrate no third-party AI model provider in the product today.

`CL-17` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* HQ-7 TG-16/17/18 — OpenAI, Gemini and local models all Not Used, no integration evidence [Verified]

⚠ A negative claim with a shelf life — AD-2. It carries a review date and is re-checked quarterly.

### `CB-20` — ai-3

> Where a decision is not ours to automate, a person makes it.

`CL-18` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* PO-4 §1.3 seven reserved grounds · eleven reserved decisions, serialized to one [Verified in the programme]

### `CB-21` — cookies

> We do not use tracking cookies on this site.

`CL-03` · **Verified** → present tense · reviewed 2026-10-25 · owner AI Workspace HQ

*Evidence:* ⛔ C-13 binding commitment — UNVERIFIED. Turnstile behaviour never tested [Blocked]

⛔ BINDING COMMITMENT C-13 — AND UNVERIFIED. This block MUST NOT SHIP until the Turnstile test is run.

### `CB-22` — footnote

> Last reviewed 25 October 2026.

*Basis:* Publication process — COPY-6 quarterly review cadence. A process fact, not a product claim.

⚠ Placeholder date shown as the review anchor. GR-2 — every evidence page carries one.


---

# TECHNOLOGY PAGE RULES

| # | Rule |
| --- | --- |
| **TC-1** | **⛔ Only `Verified and Accepted` entries appear. Eight, and eight is enough** |
| **TC-2** | **⛔ No version numbers, no topology, no configuration, no internal identifier** — G-7. This is attack-surface information, not a trust signal |
| **TC-3** | **⚠ The two rejections are a section, not a footnote.** A documented rejection cannot be imitated without doing the work — **it is the least copyable content on the site** |
| **TC-4** | **⛔ `Not Used` is never rendered as `Rejected`.** Several AI model providers are simply unassessed; saying we rejected them would claim work that never happened |
| **TC-5** | **⚠ `CB-37` states the single-host ceiling plainly.** A stated ceiling is more credible than an unstated one, and an evaluator finds it either way |

---

# TRUST PAGE RULES

| # | Rule |
| --- | --- |
| **TR-1** | **⛔ The page OPENS with what is missing** — `CB-12` to `CB-15` precede every proof block. An enterprise reader scans for the gap; finding it immediately is the signal |
| **TR-2** | **⛔ `CB-21` MUST NOT SHIP until the tracking-cookie commitment is verified.** It is already binding and it has never been tested |
| **TR-3** | **⚠ `CB-19` is a negative claim with a shelf life.** The day a model provider is integrated it becomes false, silently, unless the quarterly re-check exists |
| **TR-4** | **⚠ `CB-16` publishes a COUNT, not a defect list.** Eleven material defects caught; one publishable example named. **The other ten stay internal** |
| **TR-5** | **⛔ No security claim appears anywhere until a flaw-reporting process exists** — SP-3, and `CB-15` says so on the page |

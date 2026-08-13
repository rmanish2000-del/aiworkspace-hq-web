# AIWHQ-CC-001 — INFORMATION ARCHITECTURE AND CONTENT STRUCTURE

**Document ID:** `AWHQ-IA-CC001`
**Version:** 1.0 · **Date:** 28 July 2026
**Executor:** Claude Chat · **Verification Level:** L2
**Status:** **DESIGN ONLY.** ⛔ No implementation. No copy. No route built.

---

# 0 ⛔ THREE CONFLICTS WITH THE APPROVED CANON — READ FIRST

**This assignment asks for three things the approved specifications prohibit.** Each is recorded with its resolution rather than quietly executed or quietly dropped.

## 0.1 ⛔ Scope item 5 — a public product hierarchy naming five programmes

The assignment asks to define a product hierarchy **including ProjectOS, TradeOS, EduOS, UrjaOps and Legal Engineering**, in a deliverable for the public website.

| Source | Prohibition |
| --- | --- |
| **DEC-005** (P0) | These five are **never named, described, linked or implied** in public content **or metadata** |
| **`HQ-8/02` §7 item 2** | *"Ecosystem programme names"* — listed under **Never public** |
| **`HQ-8/00` G-4** | All five are in the **prohibited-term CI test**, whole-word match on both sides, **firing inside denials as well as assertions** |
| **`HQ-11` P-10** | Internal architecture never published |
| **Standing instruction** | *"Never redefine their architecture"* |

> ### **Resolution: the hierarchy is delivered at §5 as an INTERNAL document.**
>
> It governs what the public site says about them, and **what it says is nothing.** A public product hierarchy naming these five is not deliverable, and producing one would fail a CI test before it failed review.

## 0.2 ⛔ Scope item 7 — a public Roadmap page

| Source | Prohibition |
| --- | --- |
| **P0 `01` §6** | No roadmap, dates or sequencing |
| **P0 `02` §3** | Roadmap is a prohibited claim |
| **`HQ-9` §3** | `/roadmap` is classified **PROHIBITED ON CURRENT EVIDENCE** |
| **G-4** | The word `roadmap` is a blocked term |
| **`HQ-12` M-3** | No roadmap or date on any surface |

> ### **Resolution: `/roadmap` is not in the sitemap. `/what-we-havent-built` is its honest substitute** — the same reader need (*"where is this going?"*) answered with verified absences instead of unverifiable intentions.

## 0.3 ⚠ The IA already exists — this must not become a second one

**`HQ-9` delivered a complete, implementation-ready IA:** 21 routes with 11 fields each, navigation tiers, claim coverage, and the `IA-1` rule asserted mechanically in `routes.py`. The acceptance criterion *"no duplicated pages"* would be breached by this document producing a parallel sitemap.

> ### **Resolution: `HQ-9` remains the IA of record. This document is a DELTA against it**, plus the two things HQ-9 does not own: the **internal product hierarchy** (§5) and the **evidence test on the newly reported Control Plane capabilities** (§1).

**⚠ Deliverables are returned in the seven sections the assignment names, but §2–§4 reconcile to HQ-9 rather than restating it.**

---

# 1 ⚠ THE NEW CAPABILITY CLAIM — EVIDENCE TEST

The assignment states: *"The AI Workspace Control Plane now includes operational capabilities such as Dashboard, Activity, Assignment Workspace and Agent Workspace."*

**This is new information and it is material. It is also `Reported`, not `Verified`.**

## 1.1 The test each capability must pass before it can appear publicly

| # | Test | Source |
| --- | --- | --- |
| **1** | **Evidence tier** — is this `Verified` to HQ, or `Reported` by the founder? | `HQ-7` B-1: HQ never assigns engineering status |
| **2** | **Maturity value from CR-1** — not from a screenshot, not from a UI existing | `HQ-8/02` CC-2 |
| **3** | **Language permitted by the M-map** — M4–5 *"we do"* · M3 *"we are building"* · M2 *"is designed"* · **M0–1 not described at all** | `HQ-8/02` §3.1 |
| **4** | **A ledger entry** — no entry, no publication, however obviously true | `T-5` |
| **5** | **Three `Verified` claims** before a route may hold it | `IA-1` |

## 1.2 Assessment

| Reported capability | Status to HQ | Blocking issue |
| --- | --- | --- |
| **Dashboard** | `Reported` | A dashboard is a **surface**, not a capability. *"We have a dashboard"* tells an enterprise buyer nothing they asked for (`HQ-7` §1) |
| **Activity** | `Reported` | Same. An activity feed is evidence that something ran, not evidence of what |
| **Assignment Workspace** | `Reported` | The closest to a genuine capability claim. **Needs a CR-1 maturity value** |
| **Agent Workspace** | ⛔ **Blocked regardless of evidence** | **`CAP-FDN-900` Agent Identity is M0.** `HQ-8/02` **CC-1**: *every claim resting on agent identity — orchestration, governed agents, agent registry — is not publicly describable.* **An Agent Workspace UI does not raise agent identity above M0** |

> ## ⚠ The discipline point, stated plainly
>
> **A UI existing is not a capability being publishable.** A rendered Agent Workspace is evidence that a screen exists. It is not evidence of agent identity, governance, orchestration or registry — which are the things a claim would be *about*.
>
> **This is the same error `HQ-7` §3 caught and corrected once already**, in the opposite direction: status is assessed per artefact against evidence, never inherited from an adjacent fact.

## 1.3 What this changes in HQ-9's sitemap

| Route | HQ-9 verdict | Revised verdict |
| --- | --- | --- |
| **`/platform`** | *"0 `Verified` claims. Its two candidate claims are both `Under design`. A /platform page today would be entirely invented"* | 🟡 **Candidate claims now exist but are `Reported`.** Still **0 `Verified`**, so still **not buildable** — but the route moves from *"nothing to say"* to *"something to verify"*, which is a real change of state |

**⛔ Recommendation R-1: obtain CR-1 maturity values and an evidence tier for Assignment Workspace, Dashboard and Activity.** That is the single action that could make `/platform` buildable. Agent Workspace is separately blocked at M0 and is not part of it.

---

# 2 WEBSITE SITEMAP

**HQ-9's 21-route sitemap stands. Reproduced here in summary with this document's deltas marked.**

```
   ── BUILDABLE ON EVIDENCE (all gated) ───────────────────────────
      /                        4 Verified   landing
      /trust                   8 Verified   ⚠ anchor route
      /technology              5 Verified
      /what-we-havent-built    5 Verified   ⚠ differentiator · replaces /roadmap
      /security                4 Verified   ⛔ needs CL-21 first
      /enterprise              7 Verified   ⚠ reframe per HQ-11 F-10
      /about                   3 Verified   🔴 DELTA — demote to shell (HQ-11 F-9)

   ── SHELLS ──────────────────────────────────────────────────────
      /privacy   /docs   /developers   /demo   /contact
      /about                                  🔴 DELTA — moved here

   ── CANNOT EXIST YET ────────────────────────────────────────────
      /platform  🟡 DELTA — candidate claims now Reported, still 0 Verified
      /api   /early-access   /status   /pricing

   ── PROHIBITED ──────────────────────────────────────────────────
      /customers   /compare   /roadmap        /blog (deferred)

   ── ⛔ NOT ADDED, AND WHY ───────────────────────────────────────
      /products  /solutions  /projectos  /tradeos  /eduos  /urjaops
      /legal-engineering  /use-cases  /industries
      → DEC-005 · HQ-8/02 §7 · G-4. See §5
```

**Two deltas only. The sitemap is otherwise unchanged, and that is the correct outcome** — a stable IA that survives new capability information is the IA doing its job.

---

# 3 NAVIGATION

**HQ-9 §4 stands unchanged.** Restated for completeness, with one addition.

| Tier | Routes |
| --- | --- |
| **Primary** *(five maximum, no dropdowns)* | `/` · `/trust` · `/technology` · `/what-we-havent-built` · `/docs` |
| **Secondary** *(reached from context)* | `/security` · `/enterprise` · `/developers` · `/demo` — 🔴 **`/about` removed pending §7 R-4** |
| **Utility** | `/contact` |
| **Footer** | `/privacy` · legal entity line · disclosure |

| Rule | Statement |
| --- | --- |
| **N-1** | `/what-we-havent-built` is in **primary**, not the footer. The disclosure strategy expressed as a nav decision |
| **N-5** | **No "Get started", "Book a demo" or "Try free".** All three convert to nothing and two breach **C-11** |
| **N-6** | **The only CTA is the interest register**, bound by **C-12** |
| 🔴 **N-7 (new)** | **⛔ No products, solutions, industries or use-cases menu.** Not deferred — **prohibited**, because every item in it would name a programme that may not be public (§5) |

**⚠ HQ-9 §4.3's absences are correct and should be defended under pressure:** no mega-menu, no solutions-by-industry, no resources hub, no customer stories, no pricing link, no login. **Every one is standard, and every one would be a container with nothing in it.**

---

# 4 PAGE INVENTORY

**Purpose · audience · key message · sections · CTA for each route that can exist.** Content models remain HQ-9's; this adds the framing layer the assignment asks for.

| Route | Purpose | Audience | Key message | Required sections | CTA |
| --- | --- | --- | --- | --- | --- |
| **`/`** | Establish the category and route to evidence | All | *There is a layer above the tools you already run* | Category · the problem · the four principles · stage disclosure · one CTA | **Interest register** |
| **`/trust`** | Anchor route. Lead with what is missing | Enterprise buyer · sceptic | *We publish what we cannot yet prove* | **Gaps first** · method · AI self-disclosure · commitments · absences | Read `/what-we-havent-built` |
| **`/technology`** | Show reasoning, not logos | Architect · CTO | *How we decide is the artefact, not what we installed* | How we build · what we run on **(six entries — `HQ-11` F-2)** · **how we decide** · what we have not built · exit position | Read `/enterprise` |
| **`/what-we-havent-built`** | The differentiator. Replaces `/roadmap` | All | *Here is the gap list, dated* | Dated absences, grouped · re-verification statement | Interest register |
| **`/security`** | Posture, never architecture | Enterprise buyer · researcher | *Here is our posture and here is what we do not hold* | Posture · **vulnerability disclosure policy** · absences stated plainly | Report a vulnerability |
| **`/enterprise`** | The ten questions, and where we stand | Evaluator | **⚠ *These are the questions. Here is our position on each* — never *we are enterprise-ready*** (`HQ-11` F-10) | Ten questions, each with position · **six unanswered, stated** · exit and lock-in | Interest register |
| **`/privacy`** | Legal obligation | Anyone · counsel · regulator | Plain-language processing statement | Twelve `h2`s in P0 order (P1-J §9) | Contact |
| **`/contact`** | One route in | Anyone | *One way to reach us, and it resolves* | Only sections whose addresses resolve (P1-J §8.1) | Send |
| **`/docs`** *(shell)* | Hold the slot honestly | Developer | *Documentation comes from the product* | Honest empty state | — |
| **`/developers`** *(shell)* | Same | Developer | *No published contract yet* | Honest empty state | — |
| **`/demo`** *(shell)* | Method demo only | Evaluator | *This shows how we work, not what we sell* | Shape-not-contents, **visible redaction notice** (`DS-1`) | — |
| **`/about`** 🔴 | **Shell until §7 R-4 resolves** | Everyone | — | — | — |

**⚠ The CTA constraint, stated once because it governs every page:** the site has **one** conversion action. It must not resemble a product signup. *"Get started"*, *"Try free"* and *"Book a demo"* are unavailable — the first two breach **C-11**, and all three convert to something that does not exist.

---

# 5 PRODUCT HIERARCHY — ⛔ INTERNAL ONLY

> ## ⛔ **THIS SECTION IS NOT PUBLIC CONTENT AND MUST NEVER INFORM ANY.**
> Same classification as the Gate Calendar under `GC-2`, for the same reason. Its function is to make clear **why the public site says nothing about four of these five.**

## 5.1 The layers

```
        AI WORKSPACE                    ← the platform
        architecture · orchestration · governance
        knowledge graph · shared services
               │
               │  consumed by
               ▼
        PROJECTOS                       ← execution framework
               │
               ▼
        TRADEOS · EDUOS · URJAOPS · LEGAL ENGINEERING
                                        ← vertical products
```

**AI WORKSPACE HQ is not in this stack.** It is the **public surface of AI Workspace** — a presentation layer, not a consumer of platform capability.

## 5.2 Relationships and public treatment

| Programme | Relationship to the platform | Public treatment |
| --- | --- | --- |
| **AI Workspace** | **Is** the platform | ✅ The **only** publicly named entity. Public product name per **DEC-001** |
| **ProjectOS** | Execution framework consuming platform capability | ⛔ **Never public** |
| **TradeOS · EduOS · UrjaOps · Legal Engineering** | Vertical products consuming platform capability | ⛔ **Never public** |
| **AI Workspace HQ** | The public surface | ⛔ **Never public as a name.** The site never names itself |

**⚠ Rule PH-1: HQ describes; it never redefines.** Each programme's architecture is owned by its own specifications. Nothing here alters any of them.

**⚠ Rule PH-2: platform-first positioning is satisfied by subtraction.** The site presents **one** thing — the platform — because the other five may not be named. **The acceptance criterion *"platform-first positioning"* is met not by ordering the products beneath the platform, but by the products being absent.**

## 5.3 🔺 An unrecorded risk this hierarchy exposes

**The legally-required entity disclosure creates an inference path to a prohibited programme name.**

- P1-E establishes the operating entity as **URJADATA SOLAR RENEWABLE ENERGY PRIVATE LIMITED**.
- P0 `06` §1, §12 and the page footer **must publish the operator's name**.
- **UrjaOps** is a permanently prohibited public term.
- G-4 does whole-word matching, so *"Urjadata"* will **not** trip the test on *"UrjaOps"* — the automated gate does not catch this.

**Two consequences:**

| # | Consequence |
| --- | --- |
| **1** | Should UrjaOps ever become public, the shared stem makes the linkage immediate to any reader who has seen the footer. **A prohibition enforced by CI is not enforced against human inference** |
| **2** | ⚠ Separately and more immediately: an enterprise AI buyer reading *"Solar Renewable Energy Private Limited"* in the footer of an enterprise AI platform site **will ask why.** That is the same fact `HQ-11` CQ-6 and P1-E CB-06 raise as a capacity question — surfacing here as a **credibility** question, which no counsel opinion resolves |

**⛔ Not resolved here.** Recorded because it appears in no prior document and it lands on the founder, not on an agent.

---

# 6 PHASE ROLLOUT

**The assignment names Phase 1 · Phase 2 · Beta · GA. `HQ-12` defines Alpha · Private Preview · Public Beta · GA, composed against four other axes.** Introducing Phase 1/Phase 2 as new values would create the sixth overlapping scheme — the defect `HQ-11` F-1 and `HQ-12` §2 both exist to prevent.

> ### **Mapping, not invention.**

| Assignment term | Maps to | Routes |
| --- | --- | --- |
| **Phase 1** | **`HQ-12` Alpha + Private Preview**, and **`HQ-9` R-1 → R-2** | `/` · `/trust` · `/technology` · `/what-we-havent-built` |
| **Phase 2** | **`HQ-12` Public Beta**, `HQ-9` **R-3** | `/privacy` · `/security` · AI disclosure surface |
| **Beta** | ⚠ **Already `HQ-12`'s Public Beta.** Not a separate phase — **the same stage under a second name** | *(as Phase 2)* |
| **GA** | **`HQ-12` GA**, `HQ-9` **R-4** | `/about` · `/enterprise` · `/demo` · `/contact` |
| *(not named in the assignment)* | **`HQ-9` R-5** — product surfaces | `/docs` · `/developers` · `/api` · `/platform` · `/status` · `/early-access` — **gated on Gate 4 PLATFORM** |

**⚠ Finding: "Phase 2" and "Beta" as given are the same stage.** Carrying both forward would produce two names for one gate and an argument later about which governs. **Use `HQ-12`'s four names internally and none of them publicly (RS-1).**

---

# 7 RISKS

| # | Risk | Severity | Recommendation |
| --- | --- | --- | --- |
| **R-1** | **A UI is mistaken for a publishable capability.** Dashboard, Activity and Agent Workspace exist as surfaces; none carries a CR-1 maturity value | 🔴 **High** | §1. Obtain maturity values. **Agent Workspace remains blocked at M0 regardless** |
| **R-2** | **Pressure to add a products or solutions menu.** It is the most standard nav pattern in enterprise software and every item would be prohibited | 🔴 **High** | N-7. Decline structurally, not case by case |
| **R-3** | **The entity name creates an inference path** to a prohibited programme name, and a credibility question in the footer | 🟡 **Medium** | §5.3. Founder decision; no automated gate catches it |
| **R-4** | **`/about` cannot answer its own question** — operator unnameable (CB-06), address unpublishable (CB-05) | 🔴 **High** | Demote to shell. `HQ-11` F-9 |
| **R-5** | **A second IA displaces HQ-9.** Two sitemaps, arbitrary choice at implementation | 🔴 **High** | §0.3. **HQ-9 is the IA of record.** This document is a delta |
| **R-6** | **`/platform` gets built on `Reported` evidence** because the capabilities feel real | 🔴 **High** | `IA-1` — three `Verified` claims. Reported is not verified |
| **R-7** | **Phase vocabulary proliferates** — six overlapping schemes | 🟡 **Medium** | §6. Map, never add |
| **R-8** | **`/technology` ships eight entries including two non-technologies** | 🟡 **Medium** | `HQ-11` F-2 — six entries; ADR practice moves to *How we decide* |
| **R-9** | **`/enterprise` reads as a readiness claim** in a URL, a search result and a shared link | 🟡 **Medium** | `HQ-11` F-10 — frame as questions |
| **R-10** | **`/security` ships before a vulnerability disclosure policy exists** | 🟡 **Medium** | `SP-3`, `CL-21`. Policy first |

---

# 8 IMPLEMENTATION RECOMMENDATIONS

**⚠ None of these is an instruction to implement.** `HQ-9` RL-6 stands: *nothing in R-1…R-5 may begin.*

| # | Recommendation |
| --- | --- |
| **IR-1** | **Treat `HQ-9` as the IA of record.** Record this document as a delta against it. **Do not merge two sitemaps** |
| **IR-2** | **Obtain CR-1 maturity values** for Assignment Workspace, Dashboard and Activity. It is the only action that could make `/platform` buildable |
| **IR-3** | **Build the compiler before any route** — `RL-3`. Routes before the ledger compiles produce hand-written copy, which is exactly how a string with no ledger entry reaches the public |
| **IR-4** | **Resolve `HQ-11`'s three blocking findings** — F-2, F-3, F-4 — before any copy is drafted |
| **IR-5** | **Run the C-13 verification test.** Still the only evidence gate closable without counsel, an entity or a supplied input |
| **IR-6** | **Add a G-7 human review step for the entity-name inference path** (§5.3). CI cannot catch it |
| **IR-7** | **Keep `/what-we-havent-built` in primary navigation** under any redesign pressure. It is the strategy, expressed as a nav decision |
| **IR-8** | **Do not add a route to hold a capability that has a UI but no maturity value.** The sitemap is computed from evidence, not from what exists on a screen |

---

# 9 ACCEPTANCE

| Criterion | Status |
| --- | --- |
| Complete sitemap | ✅ §2 — HQ-9's 21 routes, two deltas |
| Logical navigation | ✅ §3 — HQ-9 §4, one addition |
| Product hierarchy | ✅ §5 — **internal, per §0.1** |
| Platform-first positioning | ✅ **Satisfied by subtraction** (PH-2) |
| No duplicated pages | ✅ **And no duplicated sitemap** — §0.3 |
| No unsupported product claims | ✅ §1 — four reported capabilities tested, none publishable today |
| Ready for implementation | 🟡 **Ready as architecture. Not authorized** — the wall in `HQ-9` §3.3 is unmoved |

| # | Governance | Status |
| --- | --- | --- |
| **C-N1** | **⛔ Three canon conflicts declared and resolved, not executed silently** | ✅ |
| **C-N2** | **⛔ No prohibited programme name in any public artefact.** §5 is internal | ✅ |
| **C-N3** | **⛔ No `/roadmap`.** `/what-we-havent-built` is the substitute | ✅ |
| **C-N4** | **No capability claimed.** Reported ≠ Verified; **Agent Workspace blocked at M0** | ✅ |
| **C-N5** | **No second IA created.** HQ-9 remains the record | ✅ |
| **C-N6** | **No new phase vocabulary.** Mapped to `HQ-12` | ✅ |
| **C-N7** | **No implementation, copy, design, SEO or repository work** | ✅ |

---

## Stopping point

**Information architecture complete as a delta. Two sitemap changes, one navigation rule, one internal hierarchy, one capability evidence test, ten risks.**

**Not done:** no implementation · no copy · no design · no SEO · no repository work · no route built · no capability published · **no public product hierarchy authored** · **no roadmap page** · no further assignment generated.

**End of `AWHQ-IA-CC001` v1.0.**

# AIWHQ-CC-002 — INFORMATION ARCHITECTURE, REVISION 2

**Document ID:** `AWHQ-IA-CC002`
**Supersedes:** `AWHQ-IA-CC001` v1.0, 28 July 2026
**Resolves:** `AIWHQ-CW-001` (independent review) · `AIWHQ-CW-001A` (disposition worksheet)
**Date:** 28 July 2026 · **Executor:** Claude Chat · **Level:** L2
**Status:** **DESIGN ONLY.** ⛔ No implementation. No copy. No route built.

---

# 1 EXECUTIVE SUMMARY

**The review is correct on substance and I accept both BLOCKs.** Twenty of twenty-two items are Accepted; two are Accepted-with-correction; none is rejected outright.

## 1.1 ⛔ The two gating questions, answered

The worksheet stated that everything turns on two questions only the author can answer. **Both answer YES.**

| # | Question | Answer |
| --- | --- | --- |
| **Q1** | Does an `HQ-12` exist? | **✅ YES.** `AWHQ-REL-HQ12` — *Website Release Strategy* — authored by Claude Chat, 28 July 2026. Defines Alpha · Private Preview · Public Beta · GA; §2 reconciles five axes; **RS-1** classifies the stage names internal-only; **M-3** prohibits roadmap and dates. **⚠ It is a delivered artefact that was never filed to project knowledge, which is why the reviewer could not find it** |
| **Q2** | Does a second `HQ-11` exist? | **✅ YES — and the collision is confirmed.** See §1.2 |

## 1.2 ⛔ The identifier collision — confirmed, and it is mine

| | Filed register | My document |
| --- | --- | --- |
| **Document ID** | `AWHQ-REV-HQ11-00` | `AWHQ-RISK-HQ11` |
| **Title** | Findings Register | Public Claims & Trust Risk Review |
| **Date · Executor** | 27 July 2026 · Claude Cowork | 28 July 2026 · Claude Chat |
| **Series** | `F-01`…`F-16` | `F-1`…`F-11` · `P-1`…`P-13` · `CQ-1`…`CQ-9` |
| **L2 verdict** | *"FAIL-blocking — none"* | **Three blocking** |
| **In project knowledge?** | ✅ Yes | ⛔ **No** |

**The reviewer's second hypothesis was the correct one.** Not fabrication — two real documents sharing one short identifier.

> **⚠ And the collision is my fault, not the assignment's.** `hq11-review-findings_HQ-11_00_FINDINGS_REGISTER.md` was visible in my project file list when the HQ-11 assignment arrived. **I took the number without checking the register.** The same omission produced the `HQ-12` gap: a document delivered into a conversation is not a document in the record.

## 1.3 ⚠ How `BLOCK-02` was resolved without waiting for the renumbering

The worksheet warned: *"If Q2 is YES, `AIWHQ-CC-002` should not be written yet — the renumbering decision comes first, or Revision 2 inherits the collision."* **That is right, and there is a way through it.**

> ## **All nine citations were re-anchored to FILED PRIMARY SOURCES, not to either `HQ-11`.**
>
> **The revised document now cites zero findings from either register.** The renumbering remains a real register problem requiring founder ratification — but **it no longer gates this revision**, because nothing in Revision 2 depends on which document owns the number.

**In three cases the primary source is better than the citation it replaces** — notably `/about`, where `HQ-10`'s `CB-62` had already reached the same conclusion at copy level, in a document I had not read.

## 1.4 Outcome

| | |
| --- | --- |
| **Items dispositioned** | **22 of 22** |
| **Accepted** | **20** |
| **Accepted with correction to the finding's reasoning** | **2** — `BLOCK-01`, `BLOCK-02` |
| **Rejected** | **0** |
| **Citations re-anchored** | **9 of 9, all to filed primaries** |
| **PASS items weakened** | **0** — `PASS-02` and `PASS-07` restated intact at §5 |
| **Architecture changed** | **None.** `HQ-9` remains the IA of record |
| **Scope expanded** | **None** |

---

# 2 PROVENANCE REBUILD

**Every citation below was checked against the named artefact in this session, not recalled.**

| # | CC-001 said | Used to assert | 🔴 Re-anchored to | Verified |
| --- | --- | --- | --- | --- |
| **1** | `HQ-11` P-10 | Internal architecture never published | **`HQ-8/02` §7 item 2** — *"Ecosystem programme names… Never public"* | ✅ Read |
| **2** | `HQ-11` F-1 | Do not create a fifth scheme | **`HQ-9/03` §3.1** — the release plan of record is `R-0`…`R-5`; the mapping derives from it directly | ✅ Read |
| **3** | `HQ-11` F-2 | `/technology` six entries | **`HQ-7/03` Appendix A** — *"the six technologies named by the founder… **Plus two HQ identified**: the release/test toolchain and the ADR practice"*. Corroborated by **`AIWHQ-CW-001` PASS-09** | ✅ Read |
| **4** | `HQ-11` F-3 | Blocking: vendor naming | **`HQ-7/00` S-2** + **`HQ-8/02` TP-3** — the two rejections and the rule publishing them | ✅ Read |
| **5** | `HQ-11` F-4 | Blocking: defect count | **`HQ-8/00` TH-4** + **`HQ-8/02` §5.2** — *"the count publishable; the defects not"* | ✅ Read |
| **6** | `HQ-11` F-9 | `/about` demote | **`HQ-10` `CB-62`** — *"ACCOUNTABILITY BLOCK — WITHHELD… this page cannot yet answer its own central question"* + **`HQ-9/00` §3** | ✅ Read |
| **7** | `HQ-11` F-10 | `/enterprise` reframe | **`HQ-7/03` §3** (*1 of 4 answerable*) + **§4** (*six of ten unanswered*) against **`HQ-9/00` §3** (7 `Verified`) | ✅ Read |
| **8** | `HQ-11` CQ-6 | Entity capacity question | **`P1-E_CORPORATE_OBJECTS_CHECK`** — objects contain no software or IT object | ✅ Read |
| **9** | *"HQ-11's three blocking findings"* | IR-4 | **Removed.** Restated as rows 4, 5 and 3 above, each on its own primary. **⚠ `AWHQ-REV-HQ11-00` records *"FAIL-blocking — none"* and the revised document no longer implies otherwise** | ✅ |

## 2.1 🔴 New citation rule — applied throughout Revision 2

| Rule | Statement |
| --- | --- |
| **CIT-1** | **Cite by full document ID** (`AWHQ-REV-HQ11-00`), **never by short form** (`HQ-11`). This makes every citation unambiguous today, without waiting for the renumbering |
| **CIT-2** | **Cite an unfiled document only as corroboration, never as sole authority.** A reader who cannot open it cannot check it |
| **CIT-3** | **Before taking an assignment identifier, check the register.** The omission that caused this |

## 2.2 ⛔ Renumbering — routed to the founder, not decided here

**Editorial fixes (CIT-1) are applied. The register fix is not mine to make.** Per the worksheet: *"a founder decision, not an editorial one."*

| Recommendation | Rationale |
| --- | --- |
| `AWHQ-REV-HQ11-00` **keeps HQ-11** | Filed first, in durable record |
| `AWHQ-RISK-HQ11` → **HQ-12** | Unfiled; later |
| `AWHQ-REL-HQ12` → **HQ-13** | Unfiled; later still |
| **Both are filed to project knowledge on renumbering** | An unfiled document is uncitable — the root cause of `BLOCK-01` |

**⚠ Until ratified, neither of my two documents may be cited as authority by any downstream assignment.** Revision 2 complies: it cites neither.

---

# 3 CHANGE LOG — ALL 22 ITEMS

## 3.1 BLOCK items

| # | Disposition | Action |
| --- | --- | --- |
| **BLOCK-01** | **🟡 ACCEPTED with correction** | **Correction:** `HQ-12` exists (§1.1); it is unfiled, not absent. **Accepted:** a citation must resolve to something a reader can open, so §6 could not rest on it. **Action:** §6's finding **re-derived from `HQ-9/03` §3.1 alone**. Not hedged, not softened — it now stands on a filed source. `§0.2`'s `HQ-12` M-3 citation replaced with **P0 `01` §6** and **P0 `02` §3**, which say the same thing and are filed |
| **BLOCK-02** | **🟡 ACCEPTED with correction** | **Correction:** hypothesis 2, not hypothesis 1 — two real documents, one identifier (§1.2). **Accepted in full on effect:** the chain of custody was broken either way. **Action:** all nine re-anchored to filed primaries (§2); CIT-1/2/3 adopted; renumbering routed to founder (§2.2) |

## 3.2 FIX items

| # | Disposition | Action |
| --- | --- | --- |
| **FIX-01** | ✅ **ACCEPTED** | `/about` appears **once**, under **SHELLS**. The `BUILDABLE` line is deleted, not annotated |
| **FIX-02** | ✅ **ACCEPTED** | Downstream effect named: the demotion orphans **`CB-60`, `CB-61`, `CB-63`, `CB-64`**. **`CB-62` was already withheld** and gated on Open Item B — verified against `HQ-10` route contracts. HQ-10 reconciliation is flagged, not performed (scope) |
| **FIX-03** | ✅ **ACCEPTED** | `/security` CTA **removed**. Restored only when `CL-21` exists — `HQ-8/02` SP-3 |
| **FIX-04** | ✅ **ACCEPTED** — *rejection route offered and declined* | **Verified: P0 `03` §2 row 3 reads *"Five operating principles with one-line glosses"*.** No decision record reduces them. **The reviewer is right and I was wrong.** Corrected to five |
| **FIX-05** | ✅ **ACCEPTED** | §5.3 restated: Urjadata is the **candidate / proposed interim operator**. `FD-3` is a **RESERVED** decision blocked on **OP-1**; Open Item B is at **3 of 15**. **⚠ The inference-path risk is unchanged — it attaches to whichever entity is designated** |
| **FIX-06** | ✅ **ACCEPTED** | `/`'s key message flagged: *"There is a layer above the tools you already run"* is the category claim, **conditional on `POS-1`**, and `CL-26` is `Approved direction`. **The most prominent sentence on the site rests on an open reserved decision** |
| **FIX-07** | ✅ **ACCEPTED** — *rejection route offered and declined* | The reviewer offered a defensible rejection (`R-0` is not an assignment term). **Declined**, because their caveat is the stronger point: **a rollout that starts at `R-1` implies the wall is cleared.** `R-0 — THE WALL` is now the first row of the phase table |
| **FIX-08** | ✅ **ACCEPTED in the form offered** | **SEO:** explicitly deferred — **`HQ-9/03` §1 owns it**, and the worksheet states that closes the finding. **Maintainability:** genuinely uncovered anywhere; added as **R-11** (§4.4) |
| **FIX-09** | ✅ **ACCEPTED** | Re-derived from **`HQ-7/03` Appendix A** (§2 row 3). ⚠ **The reviewer's `PASS-09` is independent corroboration against their own prior work** — recorded, because that is the strongest form of evidence available here |

## 3.3 PASS items — carried forward, none weakened

`PASS-01` no second IA · `PASS-02` **the capability evidence test** · `PASS-03` Agent Workspace blocked at its M0 dependency · `PASS-04` three canon conflicts declared · `PASS-05` hierarchy internal-only · `PASS-06` *satisfied by subtraction* · `PASS-07` **the entity inference path** · `PASS-08` no `/roadmap` · `PASS-09` the technology critique · `PASS-10` N-7 structural refusal · `PASS-11` honest acceptance.

**⚠ The worksheet named the specific revision risk: `PASS-02` and `PASS-07` compressed while attention goes to citations.** Both are restated in full at §5 for exactly that reason.

---

# 4 APPLIED REVISIONS

## 4.1 Sitemap — `/about` shown once

```
   ── BUILDABLE ON EVIDENCE (all gated) ───────────────────────────
      /   /trust   /technology   /what-we-havent-built
      /security   /enterprise
      🔴 /about REMOVED from this block

   ── SHELLS ──────────────────────────────────────────────────────
      /privacy   /docs   /developers   /demo   /contact
      /about   🔴 single state — operator unnameable, address unpublishable

   ── CANNOT EXIST YET ── /platform 🟡  /api  /early-access  /status  /pricing
   ── PROHIBITED ──────── /customers  /compare  /roadmap    /blog (deferred)
```

**Downstream effect (FIX-02):** `CB-60`, `CB-61`, `CB-63`, `CB-64` orphaned. `CB-62` already withheld. **Reconciliation is HQ-10's, not this delta's.**

## 4.2 Page inventory corrections

| Route | Change |
| --- | --- |
| **`/`** | 🔴 *"the four principles"* → **five operating principles** (FIX-04) · 🔴 key message flagged **conditional on `POS-1`; `CL-26` is `Approved direction`** (FIX-06) |
| **`/security`** | 🔴 CTA **removed** until `CL-21` exists (FIX-03) |
| **`/technology`** | Six entries, ADR practice to *How we decide* — now on `HQ-7/03` Appendix A (FIX-09) |
| **`/enterprise`** | Framing unchanged — now on `HQ-7/03` §3, §4 vs `HQ-9/00` §3 |
| **`/about`** | 🔴 Shell. No purpose, audience, message, sections or CTA specified |

## 4.3 Phase rollout — `R-0` restored, re-derived from HQ-9

| Term | Maps to | Routes |
| --- | --- | --- |
| 🔴 **Before Phase 1** | **`R-0` — THE WALL** | ⛔ Two counsel opinions · an entity able to contract · C-13 untested · Design System supplied three times requested, never |
| **Phase 1** | `R-1` compiler → `R-2` | `/` · `/trust` · `/technology` · `/what-we-havent-built` |
| **Phase 2** | `R-3` | `/privacy` · `/security` · AI disclosure |
| **Beta** | ⚠ **`R-3` — the same stage as Phase 2** | *(as Phase 2)* |
| **GA** | `R-4` | `/enterprise` · `/demo` · `/contact` · `/about` *(gated)* |
| *(unnamed)* | `R-5` | Product surfaces — gated on Gate 4 PLATFORM |

**⚠ Finding preserved, provenance rebuilt:** *"Phase 2" and "Beta" are the same stage* — **now derived from `HQ-9/03` §3.1 alone.** Two names for one gate produce an argument later about which governs.

## 4.4 Risks — corrections and one addition

| # | Change |
| --- | --- |
| **R-4** | `/about` — now on `HQ-10` `CB-62` + `HQ-9/00` §3 |
| **R-8** | `/technology` — now on `HQ-7/03` Appendix A |
| **R-9** | `/enterprise` — now on `HQ-7/03` §3, §4 |
| 🔴 **R-11 (new)** | **Maintainability of the delta structure.** `AIWHQ-CC-002` amends `HQ-9` without editing it. **Two documents must stay in sync, and nothing asserts that they do.** `routes.py` computes HQ-9's sitemap; **the two deltas here are not in it.** Recommendation: fold both into `HQ-9` at its next revision, or add the assertion |
| 🔴 **SEO** | **Explicitly deferred to `HQ-9/03` §1** (FIX-08). Not an omission |

## 4.5 §5.3 — entity restated

🔴 **Urjadata Solar Renewable Energy Private Limited is the *candidate* operating entity.** `FD-3` is RESERVED and blocked on **OP-1**; Open Item B stands at **3 of 15**.

**⚠ Unchanged, and independent of which entity is chosen:** the footer must publish an operator name; **G-4's whole-word matching will not catch a human inference path**; and an enterprise AI buyer reading a renewable-energy company in the footer will ask why. **The credibility question survives the entity question.**

---

# 5 THE TWO CONTRIBUTIONS AT RISK OF COMPRESSION — RESTATED INTACT

**`PASS-02` — the capability evidence test.** A UI existing is not a capability being publishable. A rendered Agent Workspace is evidence that a screen exists; it is not evidence of agent identity, governance, orchestration or registry — **which are the things a claim would be about**. Dashboard, Activity and Assignment Workspace are `Reported`, not `Verified`, and carry no CR-1 maturity value. **Agent Workspace is blocked independent of evidence quality, because `CAP-FDN-900` is M0** and `HQ-8/02` CC-1 makes anything resting on agent identity not publicly describable.

**`PASS-07` — the entity-name inference path.** The footer must publish the operator. The prohibited-term test matches whole words, so *"Urjadata"* will not trip on *"UrjaOps"* — **the automated gate misses the inference entirely.** And separately: a renewable-energy company operating an enterprise AI platform site raises a credibility question that no counsel opinion resolves.

---

# 6 REMAINING DISAGREEMENTS

**Two, both narrow. Neither changes the reviewer's operative conclusion, and I accept both BLOCKs.**

| # | Disagreement | Evidence | Effect |
| --- | --- | --- | --- |
| **D-1** | **`BLOCK-01` frames `HQ-12` as non-existent.** It exists — `AWHQ-REL-HQ12`, 28 July 2026, this conversation | The document was delivered in full: five-axis reconciliation, four stages, four gate families, promotion **and demotion** criteria | **None on the remedy.** Unfiled is uncitable, so §6 was re-derived from `HQ-9` regardless. **The distinction matters only for what happens next: file it, rather than reconstruct it** |
| **D-2** | **`BLOCK-02`'s first hypothesis — *"citing from memory… nine fabricated references"*.** Both registers are real and both are mine | §1.2 — two document IDs, two dates, two executors, two series | **None on the disposition.** The reviewer said *"either way this blocks"* and that is right. **A real-but-unfiled source and an invented one are indistinguishable to a reader, which is the whole point** |

**⚠ Where the reviewer was more right than they claimed:** `PASS-09` credits my `/technology` critique **against their own prior work**, and offers `FIX-04`, `FIX-07` and `FIX-08` as rejectable. **I declined two of the three rejection routes** — `FIX-04` because P0 `03` §2 verifiably says five, and `FIX-07` because a rollout starting at `R-1` implies the wall is cleared. **A reviewer who names their own weak findings makes the strong ones harder to dismiss.**

---

# 7 FINAL IMPLEMENTATION READINESS

| Criterion (worksheet §4) | Status |
| --- | --- |
| **A-1** Every citation resolves, spot-checked | ✅ **Nine re-anchored, each read in this session** (§2) |
| **A-2** No identifier appears twice | 🟡 **Editorially resolved (CIT-1). Register fix routed to founder** (§2.2) — the one criterion not fully closable by an author |
| **A-3** All 22 items dispositioned | ✅ **22 of 22.** No silence |
| **A-4** Removed material removed, not softened | ✅ §6 **re-derived on a filed source, not hedged.** The nine broken citations are **deleted**, not annotated |
| **A-5** No PASS item weakened | ✅ Eleven intact; the two at risk restated at §5 |
| **A-6** No scope expansion | ✅ Revision only |
| **A-7** Architecture preserved | ✅ **`HQ-9` remains the IA of record. No second sitemap.** Two deltas, both narrowed |

| Surface | Ready? |
| --- | --- |
| **Homepage** | 🟡 Architecturally yes, **not authorized** — key message conditional on `POS-1` |
| **Product pages** | ⛔ **No.** 0 `Verified`; the four capabilities are `Reported` |
| **`/about`** | ⛔ **No.** Shell — cannot answer its own question |
| **Documentation · Developer portal · Pricing** | ⛔ **No** |
| **Blog** | 🟡 Deferred, not prohibited |

> ## ⛔ **NOT READY FOR IMPLEMENTATION — and Revision 2 does not claim to move that.**
>
> **The wall is unchanged:** two counsel opinions · an entity that can lawfully contract · one untested cookie commitment · a Shared Design System requested three times and supplied never.
>
> **⚠ And for the fifth consecutive pack, the same action remains unblocked by all of it: run the C-13 cookie verification.** No counsel, no entity, no supplied input — only a deployable preview.

---

## Stopping point

**Revision 2 complete. Two BLOCKs accepted and resolved, nine citations re-anchored to filed primaries, nine FIX items applied, eleven PASS items preserved, 22 of 22 dispositioned.**

**Not done:** no implementation · no copy · no design · no SEO · no repository work · no route built · **no renumbering executed** *(founder ratification required)* · no document filed to project knowledge · no architecture changed · no scope expanded · no further assignment generated.

**End of `AWHQ-IA-CC002` v2.0.**

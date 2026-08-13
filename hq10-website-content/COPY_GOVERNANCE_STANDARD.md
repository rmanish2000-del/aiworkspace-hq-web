# COPY_GOVERNANCE_STANDARD.md

**Document ID:** `AWHQ-CONTENT-HQ10-GOV`
**Version:** 1.0 · **Date:** 27 July 2026 · **Owner:** AI Workspace HQ
**Audience:** **anyone who writes a public sentence for AI Workspace — human or AI.**
**Status:** Standing standard. **⛔ Not a style guide. It says nothing about voice, and everything about truth.**

---

# 1 THE ONE RULE

> ## **You may not write a public sentence that is not in the claim ledger.**
>
> **Not "should not". May not.** A sentence with no ledger entry has no evidence, no tier, no review date and no owner — **so nobody can tell later whether it was ever true.**

**The correct response to *"we need copy for X"* is *"then a claim about X must exist first."*** Never the other way round.

---

# 2 TENSE IS NOT A STYLE CHOICE

**Tense is derived from tier. Getting it wrong is not a tone problem — it is an unsupported claim, and the grammar is what gives it away.**

| Tier | Permitted tense | Example form | Publishable |
| --- | --- | --- | --- |
| **Verified** | **Present** | *"We run on…"* · *"We do not offer…"* | ✅ at Gate 3 |
| **Approved direction** | **Present continuous** | *"We are building…"* | ✅ with the qualifier |
| **Under design** | **Intent** | *"It is designed to…"* | ⚠ sparingly |
| **Future vision** | **⛔ None** | — | **⛔ Never published** |

**⚠ Worked example.** *"AI Workspace connects the tools you already run"* is present tense on `Under design` evidence. It is an invented feature. **The permitted form is *"It is designed to work with the systems an organisation already runs"*** — same idea, honest tense.

---

# 3 THE PROHIBITED-TERM TEST

**Whole-word match, both sides. ⛔ It fires INSIDE A DENIAL as well as an assertion.**

```
  customer  customers  client  clients  user  users
  pilot  pilots  partner  partners  logo  logos
  funding  valuation  roadmap  SLA  certified
  ProjectOS  TradeOS  EduOS  UrjaOps
  "AI Workspace HQ"   "Legal Engineering"
  "case study"        "trusted by"
```

| # | Rule |
| --- | --- |
| **COPY-1** | **⛔ REWRITE, NEVER EXEMPT.** *"We have no customers"* fails the test. The fix is *"Early access is not yet open"* — which is shorter, already approved, and already binding |
| **COPY-2** | **⚠ The test cannot tell an assertion from a denial, and a test that tried would eventually let the wrong one through.** That is why it is blunt on purpose |
| **COPY-3** | **⛔ Exactly one exemption exists: the literal domain string.** Written narrowly. **A loose exemption lets the prohibited brand name through in prose** |
| **COPY-4** | **⚠ *"certified"* is prohibited; *"certification"* is not.** The adjective is a claim about us; the noun inside a denial is a fact. **`CB-12` uses the noun deliberately** |
| **COPY-5** | **Say "a person", "an organisation", "a team", "a reader", "an evaluator".** Never the banned nouns, even where they would read naturally |

---

# 4 EVERY FACTUAL SENTENCE CARRIES FIVE THINGS

| Field | Why |
| --- | --- |
| **Claim id** | What makes it true |
| **Tier** | How confident you may sound |
| **Evidence** | Where the truth is recorded |
| **Review date** | **⚠ When it stops being trustworthy** |
| **Owner** | Who re-verifies it |

**⚠ Rule COPY-6: a sentence with no review date is a sentence nobody will ever re-check.** Every factual block carries one and is re-verified quarterly.

**Rule COPY-7: a process fact may carry a stated `basis` instead of a claim id** — a review date is a fact about publication, not about the product. **But it must state the basis; it may not simply have neither.**

---

# 5 WHAT MAY NEVER BE WRITTEN

| | |
| --- | --- |
| **⛔ Any price, tier, discount or commercial term** | No pricing model is decided. **The model is a reserved founder decision, not a copy task** |
| **⛔ Any date, quarter, timeline or sequencing** | P0 `01` §6 |
| **⛔ Any certification, audit or compliance conclusion** | *"Compliant with X"* is a legal conclusion. **We collect; we do not conclude** |
| **⛔ Any uptime, availability or performance commitment** | None exists |
| **⛔ Any named comparison** | Our market work is internal |
| **⛔ Any infrastructure detail** | Versions, topology, configuration — attack surface, not trust signal |
| **⛔ Any internal identifier or programme name** | The governance machinery is internal; its **outcomes** are the trust signal |
| **⚠ Any capability at `Under design` or below, in present tense** | The single most likely failure, because it reads naturally |

---

# 6 UPDATE TRIGGERS

**⚠ Copy is not a one-time deliverable. These events oblige a re-issue.**

| # | Trigger | Action |
| --- | --- | --- |
| **UT-1** | **A capability's maturity changes** — M2→M3, M3→M4 | **⛔ Re-issue every block citing it.** Tense is derived from tier, so a tier change is a rewrite, not an edit |
| **UT-2** | **A negative claim stops being true** — SSO ships, a process is published | **⛔ The block becomes FALSE the moment the gap closes.** Remove it from the gap page and date the removal |
| **UT-3** | **`CL-03` is verified or falsified** | `CB-21` and `CB-74` either become shippable or must be **removed from the site and from the commitment set** |
| **UT-4** | **A model provider is integrated** | **`CB-19` becomes false silently.** UT-4 is the reason it carries a review date |
| **UT-5** | **`POS-1` is decided** | `CB-01` and `CB-61` are re-issued at whatever tier the decision leaves the category claim |
| **UT-6** | **Open Item B closes** | `CB-62` — the withheld accountability block — is drafted for the first time |
| **UT-7** | **Evidence passes its half-life** | Confidence drops a grade. **Below `C` the claim is ineligible for any public artefact** |
| **UT-8** | **Quarterly, unconditionally** | Re-verify every factual block. **A block only re-checked on change is indistinguishable from one that was forgotten** |

---

# 7 FOR AI WRITERS SPECIFICALLY

**⚠ Most of this standard exists because a capable writer produces plausible sentences faster than anyone can check them.**

| # | Rule |
| --- | --- |
| **AI-1** | **⛔ Do not write a sentence because it sounds like something the page needs.** The page needs what the ledger supports and nothing else |
| **AI-2** | **⚠ Do not smooth a limitation.** *"We are still maturing our identity story"* is worse than *"We do not offer single sign-on"* — **it is longer, vaguer, and it is a claim about direction that no evidence supports** |
| **AI-3** | **⛔ Do not add a qualifier to make a claim safe.** *"Currently"*, *"today"* and *"at this stage"* do not lower a tier. **If the tier does not permit the tense, rewrite the sentence** |
| **AI-4** | **⚠ Do not resolve a conflict between two sources by choosing the better-written one.** That is the exact failure that cost this programme three assignments. **Record the conflict and route it** |
| **AI-5** | **⛔ If you cannot find evidence, say so. Do not fill the gap.** An empty slot is a finding; an invented sentence is a defect that will be believed |
| **AI-6** | **⚠ Read the gap page before writing any other page.** It sets the honesty level the rest of the site has to match |

---

# 8 THE REVIEW CHECKLIST

**Run before any sentence goes near a repository.**

```
  1  Does every factual sentence have a claim id or a stated basis?
  2  Does the tense match the tier?
  3  Prohibited-term test — whole word, both sides, inside denials?
  4  Any price, date, certification, uptime or comparison?
  5  Any internal identifier, programme name or infrastructure detail?
  6  Does every factual block carry a review date and an owner?
  7  Is any claim past its evidence half-life?
  8  ⛔ Is anything cited that is Future vision?
  9  ⛔ Are CB-21 and CB-74 excluded until the cookie commitment is verified?
 10  Does the route still hold three or more Verified claims?

  Any NO → the copy does not ship. There is no partial pass.
```

---

## Cross-references

| For | See |
| --- | --- |
| The pack overview and L2 record | `HQ10_VERIFIED_WEBSITE_CONTENT_PACK.md` |
| Block-level contracts for all seven routes | `ROUTE_CONTENT_CONTRACTS.md` |
| The machine-readable ledger | `PUBLIC_CLAIMS_LEDGER.yaml` |
| The publication gate this serves | `hq8-trust-brand-public/HQ-8_00_TRUST_ARCHITECTURE.md` §4 |

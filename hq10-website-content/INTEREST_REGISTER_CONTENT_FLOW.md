# INTEREST_REGISTER_CONTENT_FLOW.md

**Document ID:** `AWHQ-CONTENT-HQ10-INTEREST`
**Version:** 1.0 · **Date:** 27 July 2026 · **Owner:** AI Workspace HQ
**Status:** Complete content flow. **⛔ Not published. No automation. No sequence.**

---

# 1 ⛔ ONE ACTION, ONE PURPOSE, NO FUNNEL

> **Binding commitment `CL-02`: *"We will only contact you about AI Workspace early access."***
>
> **That sentence is the entire product design of this flow.** A multi-purpose form makes it unenforceable, because the same address arrives through several doors with different implied permissions.

**⛔ Rule IR-1: there is exactly one form on the site and it does exactly one thing.** No demo request, no sales enquiry, no newsletter, no download gate.

**⚠ Rule IR-2: the interest register is not a pipeline.** It is a consented list under a binding promise. **Treating it as a sales pipeline would breach `CL-02`, not merely stretch it.**

---

# 2 THE FLOW

```
   ENTRY        the landing action, or /contact
                  ⚠ no exit-intent, no interstitial, no chat widget

   FORM         email                        required
                organisation                 optional
                what you are looking for     optional, free text

                ⛔ NOT COLLECTED
                  name · phone · job title · size · country ·
                  anything inferred, and anything not needed

   CONSENT      explicit · unticked by default · states the purpose

   SUBMIT       confirmation stating what we will and will not do

   ⛔ THEN      nothing. Deliberately.
                no sequence · no nurture · no scoring · no routing
```

---

# 3 THE COPY

### `IR-01` — form heading

> **Hear when early access opens.**

`CL-01` · **Verified** → present tense · reviewed 25 October 2026 · owner AI Workspace HQ
*Evidence: binding commitment C-11 — early access is not yet open.*

### `IR-02` — form introduction

> **AI Workspace is in development. Early access is not yet open. If you would like to know when that changes, leave an email address.**

`CL-01` · **Verified** · **⛔ The first sentence is binding commitment C-11, verbatim.**

### `IR-03` — the promise, adjacent to the field

> **We will only contact you about AI Workspace early access.**

`CL-02` · **Verified** · **⛔ BINDING COMMITMENT C-12, verbatim. It sits next to the input, not in a footer.**

### `IR-04` — consent line

> **I agree to AI Workspace storing this email address so it can contact me about early access. I can ask for it to be deleted at any time.**

*Basis:* DPDP Rules 2025 consent requirements. **⛔ Unticked by default. A pre-ticked box is not consent.**
**⛔ GATED ON OPEN ITEM A** — the privacy notice this refers to has not been legally reviewed.

### `IR-05` — optional field label

> **Anything you want us to know (optional).**

*Basis:* Form design. **⚠ Free text, never a dropdown. A dropdown of job titles or company sizes is qualification data, and collecting it implies a sales motion.**

### `IR-06` — confirmation

> **Thank you. We have your address and we will use it once — to tell you when early access opens. We will not add you to anything else, and we will not pass it on. If you change your mind, ask us to delete it.**

`CL-02` · **Verified** · **⚠ States what will NOT happen, because that is the part people cannot verify for themselves.**

### `IR-07` — deletion instruction

> **To have your address removed, reply to any message from us or write to the address in our privacy notice.**

*Basis:* DPDP deletion obligation. **⛔ Blocked on Open Item A — the notice is not reviewed.**

### `IR-08` — bot-protection notice

> **This form is protected against automated abuse. That protection does not set a tracking cookie.**

`CL-03` · **Verified tier — ⛔ AND UNVERIFIED IN FACT.** **This block must not ship until the cookie test is run.**

---

# 4 RULES

| # | Rule |
| --- | --- |
| **IR-3** | **⛔ Collect only what is needed.** Every optional field is personal data carrying a retention obligation |
| **IR-4** | **⚠ Consent is explicit and unticked** — DPDP Rules 2025 |
| **IR-5** | **⛔ No auto-responder sequence, no newsletter, no nurture, no scoring, no routing.** `CL-02` permits contact **about early access** and nothing else |
| **IR-6** | **⚠ Deletion is three-location** — the store, the operational mailbox and any export. **Verification once found deletion that did not delete: a full copy survived in the mailbox** |
| **IR-7** | **⛔ `IR-08` must not ship before the cookie commitment is tested** |
| **IR-8** | **⚠ `IR-04` and `IR-07` reference a privacy notice that is not legally reviewed.** The whole flow is gated on that |
| **IR-9** | **⛔ Success is not the submission count.** With one action and nothing to sell, **a high submission rate would mean the page over-promised** |

---

# 5 ⚠ WHAT THIS FLOW DELIBERATELY LACKS

| Absent | Why |
| --- | --- |
| **Progressive profiling** | Collecting more over time is exactly the drift `CL-02` forbids |
| **Lead scoring or qualification** | There is nothing to qualify for |
| **Calendar booking** | There is no meeting to book |
| **Content gating** | ⚠ Gating the evidence content would contradict the entire trust strategy |
| **A second form anywhere** | One promise, one door |

**⚠ Rule IR-10: when early access does open, this flow is redesigned — not extended.** Extending a flow built under a narrow promise is how the promise gets broken quietly.

---

## Cross-references

| For | See |
| --- | --- |
| The pack overview and L2 record | `HQ10_VERIFIED_WEBSITE_CONTENT_PACK.md` |
| The single-conversion funnel this implements | `hq9-website-architecture/HQ-9_02_PORTALS_AND_FLOWS.md` §5 |
| The form and data workflow of record | `p0-holding-page/05-form-and-data-workflow.md` |
| The rules for writing any of this | `COPY_GOVERNANCE_STANDARD.md` |

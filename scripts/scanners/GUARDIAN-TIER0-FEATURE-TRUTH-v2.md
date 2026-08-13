# GUARDIAN TIER-0 — FEATURE TRUTH **v2 (amended)**

**Amends:** `GUARDIAN-TIER0-FEATURE-TRUTH.md` (v1, 2026-08-06) under its own §0
**Basis of amendment:** repository facts supplied by Chat, **graded REPORTED**
**Date:** 2026-08-06
**v1 is retained unchanged.** Corrections are published as corrections; the original marks are preserved in §B.1 so nothing is silently revised.

---

## WHAT CHANGED

> **v1 said: zero Guardian product features exist. That was wrong, and it was wrong for the reason v1 itself predicted.**
>
> v1 §0 stated that it assessed only the delivered artifact corpus and could not establish what existed on your machine — *"if such code exists, this document is incomplete rather than wrong."* **Code exists. v1 is now amended.**

| | v1 | **v2** |
|---|---|---|
| SHIPPED product features | 0 | **3** |
| BUILT-NOT-WIRED | 0 | **2** |
| DESIGNED-ONLY | 9 | **5** |
| **T-3** | FAIL | **STILL FAILS — but by one config flag, not a greenfield build** |

**And one claim moved in the opposite direction:** the kill-switch copy is now **unsupportable by construction**, not merely unbuilt. §D.

---

# A · GRADING OF THIS AMENDMENT

**Every fact in §A.1 was supplied by Chat and has not been independently verified by me.** I have still never had access to the repository — no clone, no file read, no test run. This session's constraint is unchanged.

| Grade | Applies to |
|---|---|
| **`SHIPPED (REPORTED)`** | Reported to exist and work. **Not observed by me.** Carries the parenthetical permanently until someone verifies it against the source |
| **`SHIPPED (VERIFIED)`** | Observed working in this session. **Applies to website rows only** |

> **`AM-1` — No row may lose its `(REPORTED)` qualifier without a repository read.** A reported fact does not become verified by being restated in a nicer table. This is the same rule that governed the release-evidence work, applied to us.

## A.1 Facts supplied

| # | Fact as supplied |
|---|---|
| **F-1** | `guardian/monitor.py` — `GuardianLimitSet`: daily loss, per-trade, qty, square-off, 3-loss halt |
| **F-2** | Per-limit states: **OK / WARN / BREACH / UNKNOWN** |
| **F-3** | `PositionsRead` **verified live against a real Groww account** |
| **F-4** | `guardian/ledger.py` — FIFO round-trips; consecutive-loss computable |
| **F-5** | Ledger **refuses a streak on any unparseable row — returns UNKNOWN** |
| **F-6** | `guardian/alerts.py` — edge-triggered Telegram, **gated by `GUARDIAN_ALERTS_ENABLED=false`** |
| **F-7** | **Structural test: the build fails if any order-method name appears in `guardian/`** |

---

# B · RE-MARKED TRUTH TABLE

## B.1 Change record

| # | Feature | v1 | **v2** | Basis |
|---|---|---|---|---|
| 01 | WATCHES — limit evaluation | DESIGNED-ONLY | **SHIPPED (REPORTED)** | F-1, F-2, F-3 |
| 02a | WARNS — warn state | DESIGNED-ONLY | **SHIPPED (REPORTED)** | F-2 |
| 02b | WARNS — delivery | DESIGNED-ONLY | **BUILT-NOT-WIRED** | F-6 |
| 03 | KILL-SWITCH | DESIGNED-ONLY | **DESIGNED-ONLY** — *and now constrained by F-7* | — |
| 04a | RECORDS — trade ledger | DESIGNED-ONLY | **SHIPPED (REPORTED)** | F-4, F-5 |
| 04b | RECORDS — Guardian's own audit trail | DESIGNED-ONLY | **DESIGNED-ONLY** | — |
| P1 | Pro — more limit types | DESIGNED-ONLY | **DESIGNED-ONLY** (tiering) | §B.3 |
| P2 | Pro — alerts off-device | DESIGNED-ONLY | **BUILT-NOT-WIRED** | F-6 |
| P3 | Pro — audit export | DESIGNED-ONLY | **DESIGNED-ONLY** | — |
| P4 | Pro — retained history | DESIGNED-ONLY | **DESIGNED-ONLY** | — |

## B.2 Core functions — detail

### 01 · WATCHES — **SHIPPED (REPORTED)**

Five limit types with a four-state evaluation, reading real positions from a real broker account. **This is the product's core, and it is real.**

**But the page's list and the built list are not the same list.** This is the most actionable finding in §F:

| Page claims | Built? | Note |
|---|---|---|
| Position size | **✓** | = `qty` |
| Drawdown against your stated ceiling | **✓** | = daily loss |
| Time-of-day boundaries | **~** | = `square-off`, **if** it is a time limit. ⚠ Ambiguous name — confirm |
| **Open exposure** | **✗** | `qty` is quantity, not notional exposure. **Not built as claimed** |
| **Trade count** | **✗** | `3-loss halt` counts *consecutive losses*, not trades. **Different thing** |
| *(not claimed)* | **✓** | **per-trade limit** — built, not advertised |
| *(not claimed)* | **✓** | **3-loss halt** — built, not advertised, and arguably the most distinctive limit in the set |

**Two claimed limits do not exist; two built limits are not claimed.** Copy fix in §F.

### 02 · WARNS — **split**

| Part | Mark | Basis |
|---|---|---|
| **Warn state** — a distinct WARN before BREACH | **SHIPPED (REPORTED)** | F-2. This makes *"before the breach, not after"* structurally true |
| **Delivery** — the warning reaching a human | **BUILT-NOT-WIRED** | F-6. Telegram code exists; `GUARDIAN_ALERTS_ENABLED=false` |

> **⚠ Open question the supplied facts do not answer: with alerts gated off, does the WARN state surface anywhere at all?** No UI, console, or on-device display was reported. If it does not, WARN is currently computed and discarded — which is a warning system that warns nobody. **Confirm before any present-tense claim about warning.**

### 03 · KILL-SWITCH — **DESIGNED-ONLY, and now constrained**

Nothing was supplied. It remains unbuilt — but F-7 changes its meaning, not just its status. See §D.

### 04 · RECORDS — **split**

| Part | Mark | Note |
|---|---|---|
| **Trade ledger** — FIFO round-trips, consecutive-loss | **SHIPPED (REPORTED)** | F-4 |
| **Guardian's own audit trail** — limits set, warnings raised, overrides taken | **DESIGNED-ONLY** | Nothing supplied. **The ledger reconstructs the user's trading; it is not a log of Guardian's behaviour.** These are different artifacts and the page claims the second |
| **Export** | **DESIGNED-ONLY** | — |
| **Retained history** | **DESIGNED-ONLY** | Persistence implied by a ledger, but retention unstated |

## B.3 Pro tier — the tiering itself does not exist

**Nothing supplied indicates any Free/Pro separation in the code.** Even where a feature is real, **no mechanism assigns it to a tier.**

> **P1 "more limit types and rule sets" cannot be marked against the code at all.** Five limit types exist; *which* are Free and which are Pro is a product decision that has not been made, let alone implemented. **Pro as a distinct sellable object does not exist**, independent of whether its features do.

---

# C · WHAT THE SUPPLIED FACTS DO **NOT** ESTABLISH

Listed so the amendment does not overreach.

| # | Not established |
|---|---|
| 1 | **That any of it works.** F-1 to F-7 are reported. Only F-3 carries a verification claim (`PositionsRead` live), and that verification was not witnessed by me |
| 2 | **That `GuardianLimitSet` ships with no default thresholds.** The page claims *"Guardian ships with none of its own."* That is **HR-1, a compliance rule**, not a nice-to-have. **Nothing supplied confirms it. Verify before publishing that sentence** |
| 3 | **Whether the WARN state reaches a human** with alerts gated off (§B.2) |
| 4 | **What `square-off` means** — a time boundary, or an action? If an action, it collides with HR-3 and F-7 |
| 5 | **Architecture C or D** (counsel brief §1.5). F-3 proves a broker API is being read; it does not say from where or with whose credentials. **See §G** |
| 6 | **Test coverage, CI state, or whether the build passes today** |
| 7 | **Whether any of this runs unattended**, or only when you run it by hand |

---

# D · THE STRUCTURAL TEST — the most valuable artifact reported

> **F-7: the build fails if any order-method name appears in `guardian/`.**

**This converts a promise into a property.** HR-3 — *"Guardian never transmits, modifies, or blocks an order"* — stops being a policy someone could forget and becomes a condition the build enforces. Every other honesty commitment in this project is a document; this one is a test.

## D.1 Take this to counsel

The counsel brief asks whether a monitor-only tool falls inside the algo framework, and its weakest point was that "we don't place orders" was an assertion. **It no longer is.**

> **Amend the counsel brief to state: order placement is excluded by a compile-time structural test, and the build fails if it is reintroduced.**

That is a materially stronger fact pattern for **Q1** than anything the brief currently contains.

## D.2 The honest caveat — state it to counsel too

**A name-based test is a strong heuristic, not a proof.** It catches known order-method names. It would not catch a raw HTTP call to an order endpoint, a dynamically constructed method name, or an order placed through a dependency.

**Say so.** A test presented with its limitation is more credible than one presented as airtight — and the obvious hardening (deny-list the broker's order *endpoints* and outbound hosts, not just method names) is worth doing anyway.

## D.3 What it does to the kill-switch

**F-7 guarantees the kill-switch can never stop anything at the broker.**

The page says: *"You press it. It stops."*

**By construction, "it" cannot be the order flow.** So the kill-switch can only stop Guardian itself, or signal the user's own strategy out-of-band — and neither is built or specified.

> **That sentence is no longer merely unbuilt. It is unsupportable as written, and no future build can make it true without breaking F-7.** It must come off the page. §F.

## D.4 The other thing that got built right

**F-2 and F-5 — the `UNKNOWN` state, and a ledger that refuses to compute a streak on an unparseable row.**

That is the fail-closed doctrine implemented rather than documented: *bad data stays visible; when Guardian cannot tell, it says so instead of guessing.* Of everything supplied, this is the strongest signal that the product is being built to the standard the page claims for it.

**It is also a present-tense claim you can make honestly today, and nobody in the category makes it.** §F.4.

---

# E · T-3 RE-VERDICT

**T-3 required one Pro feature at SHIPPED.**

| Candidate | Mark | Why not SHIPPED |
|---|---|---|
| Alerts off-device | **BUILT-NOT-WIRED** | `GUARDIAN_ALERTS_ENABLED=false`. **Not observed working** |
| More limit types | DESIGNED-ONLY | No tiering exists (§B.3) |
| Audit export | DESIGNED-ONLY | — |
| Retained history | DESIGNED-ONLY | — |

> ### **T-3 still fails — but the gap is one flag, not a build.**

**Strictly applied:** SHIPPED means observed working, and a feature behind a `false` flag has not been. I am not bending the mark to produce a friendlier answer.

**To close T-3:**

1. Set `GUARDIAN_ALERTS_ENABLED=true`
2. Drive one real WARN edge and confirm the Telegram message arrives
3. Confirm it is **edge-triggered** — one message per transition, not per evaluation cycle
4. Confirm the failure path: what happens when Telegram is unreachable

**Then off-device alerting is SHIPPED, T-3 passes, and Pro becomes priceable** — because per the pricing pack §1.1, off-device alerting *is* the honest core of Pro. Everything else in Pro is secondary.

**Pricing recommendation unchanged until then:** ratify ₹0 and Enforcer-unavailable; leave Pro unpriced.

---

# F · CORRECTED PAGE COPY

## F.1 May stand in the present tense

| Claim | Condition |
|---|---|
| **"Guardian watches your limits continuously"** | ✓ — with the corrected limit list, F.2 #1 |
| **"A distinct warning state before a breach, not after"** | ✓ as a *state*. **Not** as "you will be alerted" until F-6 is on |
| **"Never places a trade"** | ✓✓ — **now the best-supported claim on the page.** Consider adding: *"the build fails if order-placing code ever appears"* |
| **"Reads your real positions from your broker account"** | ✓ — F-3 |
| **"Reconstructs your round-trips FIFO"** | ✓ — F-4 |
| **"When Guardian can't tell, it says UNKNOWN"** | ✓ — F-2, F-5. **Newly claimable. Use it** |

## F.2 Must be corrected — the limit list is wrong

**1 · Replace the WATCHES card copy.** Current text names two limits that do not exist and omits two that do.

> **Current:** *"Position size, open exposure, drawdown against your own stated ceiling, trade count, time-of-day boundaries."*
>
> **Corrected:** *"Daily loss, loss on a single trade, position quantity, a consecutive-losing-trades halt, and a square-off boundary. Each one is a number you typed in."*

Accurate, and **stronger** — "a consecutive-losing-trades halt" is a more distinctive thing to own than "trade count."

**2 · Verify before publishing:** *"Guardian ships with none of its own."* This is HR-1. §C #2.

## F.3 Must be marked planned — or removed

| Claim | Action |
|---|---|
| **"You press it. It stops."** (kill-switch) | **REMOVE.** Unsupportable by construction — §D.3. Not "planned": as written it can never be true |
| *"One control, separate from your strategy"* | Mark **planned**, and only once it is defined |
| **"Guardian raises the alarm on approach"** | Mark **planned** until `GUARDIAN_ALERTS_ENABLED=true` and one alert is observed |
| *"Every warning raised, every breach, every override"* (audit) | Mark **planned** — the trade ledger is not this. §B.2 |
| *"Plain records, exportable"* | Mark **planned** |
| **Pro tier bullets** | Mark **planned**; **remove ₹499** (§E). Off-device alerts move to present tense the day F-6 is on |
| Free tier bullets | Keep only the three that are real: limit watching, warn state, trade ledger. **Kill-switch and audit record come out** |

## F.4 Newly claimable — two things worth adding

| Claim | Why it is worth the space |
|---|---|
| **"When Guardian cannot tell, it says UNKNOWN — it does not guess."** With the concrete example: an unparseable row means no losing-streak figure at all, not a figure computed from what parsed | Fail-closed behaviour, actually implemented, that **nobody in this category advertises**. It is the single most differentiating true sentence available to you |
| **"Guardian cannot place an order. The build fails if order-placing code appears."** | Converts the strongest never-do from a promise into a testable property. **State the caveat too** (§D.2) — a name-based test is a strong heuristic, not a proof |

## F.5 The honesty banner

v1 recommended one line above the four cards. It is still needed, and now it can be **specific rather than apologetic**:

> **"Some of this works today. Some is being built. Every card says which."**

Then per-card: **WORKING** / **PLANNED**. That is more persuasive than either the current implied-working page or a blanket "nothing is built."

---

# G · CONSEQUENCES FOR OTHER ARTIFACTS

| Artifact | Consequence |
|---|---|
| **Counsel brief §1.5** | **⚠ Escalates.** F-3 means a **real broker API is being read against a live Groww account.** Q2 is no longer hypothetical. **Fill in the architecture blank — C or D — before booking.** Groww's specific API terms and any developer agreement are now also relevant: add them to the materials list |
| **Counsel brief Q1** | **Strengthens.** Add F-7 — order placement is structurally excluded at build time — with the §D.2 caveat |
| **Pricing pack** | **T-3 unchanged (fail).** But the "bad case" softens: Telegram delivery has no per-message cost, so the ₹88–154/month SMS scenario (§2.4) may be moot. **If Telegram is the alert channel, `UE-1` is satisfied by construction** — no per-alert marginal cost, therefore no incentive to warn less |
| **GTM pack HR-2 (white-box)** | Five named limits with four explicit states is white-box in substance, not just in claim. Supports the RA-registration argument |
| **FUNNEL-02** | Unaffected |

---

# §5.3 — UNCHANGED, AND IT STANDS

**The v1 finding is not amended and is not softened.**

`COMPLIANCE-CHECK.md` scanned 42 banned-claim terms across 1,303 words and reported zero affirmative claims. **That check asked only whether the marketing language was permissible. It never asked whether the product description was true.** Zero feature-existence checks were performed.

**The discovery that code exists does not rehabilitate that check.** It made no attempt to find out. That it now turns out to have been partly lucky is not a defence — and this amendment proves the point twice over, because the scan also missed that the WATCHES card names two limits that do not exist and omits two that do. **A copy scan that had checked feature truth would have caught that. Mine did not.**

**Remedy stands:** extend the compliance scan so that any present-tense capability claim must map to a row marked SHIPPED in this document. Run it against the corrected copy in §F before the page goes live.

---

# H · SUMMARY

| Category | SHIPPED (REPORTED) | BUILT-NOT-WIRED | DESIGNED-ONLY |
|---|---|---|---|
| **Guardian product** | **3** — limit evaluation · warn state · trade ledger | **2** — alert delivery · Pro off-device alerts *(same code)* | **5** — kill-switch · Guardian's audit trail · export · retained history · tiering |
| Website / funnel | 7 *(verified)* | 3 | 1 |

| Question | v2 answer |
|---|---|
| Does Guardian do anything today? | **Yes.** It evaluates five real limits against a real broker account, four-state, fail-closed |
| Does T-3 pass? | **No — one flag away** |
| Can Pro be priced? | **Not yet.** Enable alerts, observe one, then yes |
| May the page use the present tense? | **For six claims, yes.** Six more must be marked planned; one must be removed entirely |
| Is anything now *less* true than v1 thought? | **Yes — the kill-switch copy.** F-7 makes *"You press it. It stops."* unsupportable by construction |

---

**All product facts in this amendment are `REPORTED` and were not verified by me. Per `AM-1`, no row loses that qualifier without a repository read. v1 is retained unchanged.**

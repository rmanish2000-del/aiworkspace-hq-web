# AIWHQ-CC-008 — R-1 CLAIM COMPILER + CONTENT WIRING

**Document ID:** `AWHQ-WEB-CC008`
**Version:** 1.0 · **Date:** 4 August 2026 · **Author:** Claude Chat · **Assignee:** Claude Code (Claude Fable 5)
**Sequence:** After CC-007. One active assignment at a time: CC-005 → CC-006 → CC-007 → **CC-008**.
**Authorization:** AG-2 build + AG-3 staging (granted 4 Aug 2026). **⛔ AG-4 (publication/indexing) remains NOT granted — everything stays local + protected staging.**

---

## 0 FOUNDER CONTENT DECISIONS OF RECORD — 4 Aug 2026

Ratified by founder directive (*"sahi sahi assignment dete jao taki sab sahi chalne lage"*), each per the standing recommendation; each reversible by one line before AG-4:

| # | Decision | Ruling |
| --- | --- | --- |
| **FD-F2** | `/technology` entry count | ✅ **Six technologies.** The ADR practice moves to a **"How we decide"** section; the unnamed toolchain is omitted until its constituents are named individually |
| **FD-F4** | Defect-count claim | ✅ **No bare count anywhere.** Replacement ledger entry (sourced to this record): *"We verify before we approve, and verification has blocked releases."* — tier `Verified`, dated |
| **FD-POS1** | Homepage category claim | ✅ **CL-26 upgraded `Approved direction` → `Approved`.** The category framing may render on `/`. ⚠ This is the site's most prominent sentence — founder may revert with one line any time before AG-4 |

## STEP 0 — FILE HOUSEKEEPING (STANDING)

As before, plus this assignment needs the **HQ-10 content sources**: locate `hq10-website-content_HQ10_VERIFIED_WEBSITE_CONTENT_PACK.md` and `hq10-website-content_ROUTE_CONTENT_CONTRACTS.md` in `C:\AI-Workspace-HQ\hq10-website-content\` (or Downloads) → copy to `docs/specs/` → commit. **⛔ Not found → STOP and report.** Never reconstruct content from memory.

## OBJECTIVE

Build the R-1 claim compiler — the engine that makes the ledger the single source of every public string — and wire the seven buildable routes to real HQ-10 content through it.

## SCOPE

1. **Ledger as data** — `src/content/ledger/*.yaml`: one entry per claim with `id · text · tier (Verified/Approved/Reported/Under-design/Gated) · date · source (document + section) · routes[] · reverify (cadence + last date)`. Populate **only** from the HQ-10 pack and route contracts, with FD-F2/FD-F4/FD-POS1 applied. **Withheld blocks (e.g. CB-62) stay withheld.** No entry may be authored from conversation or memory — every `source` field cites a spec file in `docs/specs/`.
2. **Compiler** — build-time: ledger → route content. Each rendered claim carries its §6 tier badge and date (CC-004 encoding). **Tier rendering rules enforced in code:** only `Verified` and `Approved` render as assertions on buildable routes; `Reported`/`Under design` never render publicly; `Gated` renders only as an explicit withheld notice where a contract requires one.
3. **The eight-check gate as CI (`G-LEDGER`):**
   - Every rendered string on every route traces to exactly one ledger entry (crawl the built HTML; unmatched text outside chrome/labels fails).
   - Tier ≤ evidence is asserted mechanically from the ledger file (T-1); no editorial override path exists.
   - Every negative claim has `date` + `reverify` (T-3) — missing either fails.
   - Existing G-4 prohibited-terms test runs over the **ledger file itself**, not only the output.
4. **Routes on real content** — `/` · `/trust` · `/technology` (six entries + "How we decide") · `/what-we-havent-built` · `/enterprise` (question–position framing per contract) · shells stay honest-empty. `/security` renders **without CTA** until CL-21 exists.
5. **Redeploy to protected staging** (CC-007 pipeline) so the founder reviews real content at the staging URL.

## PROHIBITED

⛔ Authoring any claim not in HQ-10/this record · rendering `Reported`/`Under design` as assertions · any count reinstated · programme names/stage names anywhere including the ledger · indexing · unprotecting staging · touching the holding page.

## ACCEPTANCE CRITERIA

1. `G-LEDGER` green: 100% of rendered strings trace; seeded orphan-string proof fails CI.
2. Ledger sources verified: every entry's `source` opens to a real section in `docs/specs/`.
3. FD-F2/F4/POS1 visibly applied on the built routes.
4. All prior gates (six DS gates, G-C13, budgets, a11y) still green — full `verify:release`.
5. Staging redeployed; URL + screenshots (both themes, mobile + desktop) in the evidence pack.

## STOPPING POINT

Stop after evidence. No merge without founder acceptance, no indexing, no AG-4 action. Propose exactly one next assignment.

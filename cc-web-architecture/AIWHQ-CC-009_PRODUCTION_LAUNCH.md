# AIWHQ-CC-009 — PRODUCTION LAUNCH (AG-4 EXECUTION)

**Document ID:** `AWHQ-WEB-CC009`
**Version:** 1.0 · **Date:** 4 August 2026 · **Author:** Claude Chat · **Assignee:** Claude Code (Claude Fable 5)
**Sequence:** After CC-008 is merged with all gates green. Queue: CC-008 → **CC-009**.

---

## 0 AUTHORIZATION RECORD — AG-4 GRANTED

**Founder ratification, verbatim, 4 Aug 2026:** *"FD-AG4: A, B, C teeno sweekrit. Launch karo."*

| # | Accepted risk (recorded, reversible later) |
| --- | --- |
| **A** | `/privacy` publishes from approved P0 `06` text **without** the Open Item A counsel review. Wave 1 collects nothing (form disabled) except hosting logs |
| **B** | Launch on 1-day log retention; CERT-In B-04 remains open. This overrides Claude Chat's prior production-blocker ruling — founder authority |
| **C** | Vendor rejections publish **de-identified** (reason without name), per HQ-11 F-3's own remedy — counsel naming question mooted for launch |

**AG-4 scope — WAVE 1 ONLY:** `/` · `/trust` · `/technology` · `/what-we-havent-built` · `/privacy` · 404. Everything else stays noindex shell or absent. **Interest register / form: DISABLED** — C-11 (*early access not yet open*) stays true; no dead CTA, no "coming soon" promises.

## STEP 0 — HOUSEKEEPING (STANDING)

Per CC-000. Also verify CC-008 actually merged with `G-LEDGER` green before proceeding; if not, finish the queue first.

## PRE-LAUNCH (in order)

1. **De-identification (FD-AG4-C):** rejection entries in the ledger carry reason + date, **no vendor name**, sourced to this record. G-4 rerun over ledger + built HTML.
2. **`/privacy`:** rendered verbatim from P0 `06` via the ledger — twelve `h2`s in P0 order (P1-J §9 asserted in CI).
3. **Public-artifact audit:** scan final built HTML, headers, meta, OG images, sitemap, robots for: `urjadata` (any casing/stem) · all G-4 prohibited terms · stage names · staging URLs. Any hit → stop, report.
4. **Wave-1 indexing config:** the five routes indexable + in sitemap; every other route `noindex` and out of sitemap. Assert per-route in CI.
5. **Rollback tested BEFORE launch:** document and dry-run the two levers — re-enable Deployment Protection (instant un-publication) and instant-rollback to previous deployment. Untested rollback is not rollback.

## LAUNCH SEQUENCE

6. **Domain — reversible attach only:** add `aiworkspacehq.com` + `www` to the Vercel project; print the exact A/CNAME records for the founder to set at the registrar (**F-L1 — the one founder action**). ⛔ **No nameserver delegation. No HSTS preload submission** (DEC-024 irreversibles stay unperformed). HSTS header allowed with `max-age=86400`, no `preload`.
7. Verify domain resolves + TLS issued; production serves the wave-1 build.
8. **Remove Deployment Protection from production only** — previews stay protected. Confirm `X-Robots-Tag` noindex is **gone from the five routes only**.

## SAME-HOUR POST-LAUNCH VERIFICATION

9. **C-13 suite against `https://aiworkspacehq.com`** — full cookie inventory on the live edge; any tracking cookie = pull protection back ON immediately + report (HQ-12 D-3).
10. Re-run the public-artifact audit against the **live** site. Headers capture, Lighthouse (both themes, mobile+desktop), screenshot set, all five routes.
11. **Evidence pack:** DNS records set · TLS proof · per-route index/noindex matrix · live C-13 inventory · audit results · Lighthouse · rollback dry-run log · the live URL.

## PROHIBITED

⛔ NS delegation · HSTS preload · analytics (stays OFF — AN-1, separate decision) · enabling the form or any storage · publishing any route outside wave 1 · any new claim not in the ledger · touching V-2 retention settings beyond documenting them.

## ACCEPTANCE

Live on `aiworkspacehq.com` · five routes indexed, all else noindex · C-13 green on production · audits clean · rollback proven · full `verify:release` green · evidence pack complete.

## STOPPING POINT

Stop after evidence. Report the live URL. Propose exactly one next assignment (expected: wave-2 readiness — `/security` + CL-21 disclosure policy + Open Item A closure for the form).

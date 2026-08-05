# AIWHQ-CC-011 — RE-VERIFICATION AUTOMATION + OPS

**Document ID:** `AWHQ-WEB-CC011` · **v1.0 · 4 Aug 2026 · Author:** Claude Chat · **Assignee:** Claude Code
**Sequence:** After CC-010. No founder gates.

## STEP 0 — Housekeeping per CC-000.

## SCOPE

1. **Scheduled re-verification (T-3 engine):** weekly GitHub Actions cron — full `verify:release` + live-site C-13 + audits against production. Any failure → issue auto-opened with the failing claim/gate.
2. **Claim expiry watchdog:** CI fails when any ledger entry passes its `reverify` cadence without a refreshed date; report lists entries due within 14 days.
3. **Demotion lever (HQ-12 D-1/D-4):** script `npm run demote -- <claim-id|route>` — withdraws a claim (or noindexes a route below 3 Verified), redeploys, logs to `docs/evidence/demotions.md`. Dry-run tested.
4. **Uptime + TLS expiry check** in the same cron (no third-party monitor, no analytics).
5. Evidence: first scheduled run green + seeded-expiry proof + demotion dry-run log.

## PROHIBITED
Analytics · new routes · third-party monitoring services · form.

## STOPPING POINT
Evidence pack. Propose one next assignment.

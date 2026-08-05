# AIWHQ-CC-012 — SEO + METADATA HARDENING

**Document ID:** `AWHQ-WEB-CC012` · **v1.0 · 5 Aug 2026 · Author:** Claude Chat · **Assignee:** Claude Code
**Sequence:** After CC-011. No founder gates.

## STEP 0 — Housekeeping per CC-000.

## SCOPE

1. **Structured data:** `Organization` + `WebSite` JSON-LD only (SEO-3: no Product/Offer/Rating/SoftwareApplication). Values from the ledger.
2. **Per-route metadata:** title/description compiled from ledger entries — same eight-check gate as body copy (SEO-2); CI asserts no meta string without a ledger source.
3. **OG images:** generated per route from DS tokens (both themes' safe variant), no text over untested gradient stops; audit for prohibited terms.
4. **Canonical URLs, sitemap hygiene, 404/redirect audit** — indexed routes only.
5. **`G-SEO` gate:** schema types whitelist + meta-ledger trace + canonical/sitemap consistency, wired into `verify:release`.
6. Evidence: gate log, rendered JSON-LD, meta table per route, OG image set.

## PROHIBITED
New schema types · analytics · search-console integrations · any indexing change beyond current waves · link building (M-1).

## STOPPING POINT
Evidence pack. Propose one next assignment.

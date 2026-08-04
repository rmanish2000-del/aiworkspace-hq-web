# CC-008 evidence pack — R-1 claim compiler + content wiring

**Assignment:** `AWHQ-WEB-CC008` v1.0 · **Date:** 2026-08-04 · **Branch:**
`feature/cc008-claim-compiler`

## Delivered

| Scope                       | Where                                                                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ledger as data              | `src/content/ledger/claims.yaml` (20 claims) + `blocks.yaml` (48 blocks) — every entry sourced to `docs/specs/`; FD-F2/F4/POS1 applied; CB-21/CB-74/CB-62 withheld                       |
| Compiler                    | `src/lib/ledger.ts` — build-time, ships 0 bytes; tier→tense rules, T-3 dating, Gated-never-renders all THROW at build                                                                    |
| G-LEDGER gate               | `scripts/ledger-gate.mjs` in `verify:release` — rendered-string tracing, G-4 over the ledger, withheld assertions; **seeded orphan → exit 1, proven**                                    |
| Routes on real content      | `/` (FD-POS1 headline) · `/trust` · `/technology` (six + "How we decide") · `/what-we-havent-built` · `/enterprise` · `/security` (no CTA) — zero JS, tier badges + dates on every claim |
| Wave-1 indexing (CC-009 §0) | Sitemap = exactly `/`,`/trust`,`/technology`,`/what-we-havent-built`,`/privacy`; all other routes noindex — asserted per route in CI                                                     |
| FD-W1                       | Footer "Warrant console" link → `/warrant/console` (edge proxy from PR #19)                                                                                                              |

## Gates

`verify:release` **31/31 green** — includes DS gates (78 checks), G-C13
(20/20), G-LEDGER (19 checks), 12-route browser matrix, budgets, audit.
Seeded-orphan proof: injected untraced sentence → 2 route failures, exit 1.

## Notes for the founder

- New devDependency: `yaml` (build-time only, 0 bytes shipped).
- Holding-page baseline superseded on this branch (FD-POS1 authorizes the new
  `/`); merge deploys to **protected** production — public exposure happens
  only at CC-009 step 8.
- CB-21/CB-74 (C-13 sentence on /trust,/security) stay withheld under CT-4
  until staged C-13 verification completes — one founder line lifts it.

## Screenshots

`{home,trust,technology,what-we-havent-built,enterprise,security}-{375,1280}-{light,dark}.png`

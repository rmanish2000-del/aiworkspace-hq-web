# STATUS: aiworkspace-hq-web (aiworkspacehq.com, the AI Workspace / CAID website)
> Protocol: `COORDINATION.md` in rmanish2000-del/grok-ops-state. Git `main` is the truth; Grok Bot coordinates all tools.
> Native state (wins on detail): this file + `docs/HANDOFF_LOG.md`; CI `.github/workflows/ci.yml`

Owner: lead Grok Engineering desk; also Claude (CAID redesign), Lovable  ·  Visibility: PUBLIC (no private data here)  ·  Deploy: Vercel: every push to `main` deploys production
Last updated: 2026-10-19 08:10 IST by Grok Bot

## Current state
- Live on Vercel (TanStack Start). Checkout uses Razorpay.
- PR #82 merged 18 Oct 19:13 IST (cf290e1): create-subscription guard (same-origin, body validation, rate limit) + tests.

## In progress (claim before you start)
| Task | Agent | Claimed (IST) | Branch / PR | Notes |
|---|---|---|---|---|
| Payment alert emails | Grok Engineering desk | 2026-10-18 | PR #83 | merge after the mail-sender env check on Production |

## Next (unclaimed)
- (none)

## Blocked / needs founder (human-only)
- (none)

## Decisions
- Code changes go through a PR with green CI; docs-only commits may go to `main`.

## Open questions
- (none)

## Recent (newest first)
- cf290e1 security: guard create-subscription (#82) · de2b550 CAID redesign + security fix (#81)

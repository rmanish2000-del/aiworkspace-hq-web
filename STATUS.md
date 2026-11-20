# STATUS: aiworkspace-hq-web (aiworkspacehq.com, the AI Workspace / CAID website)
> Protocol: `COORDINATION.md` in rmanish2000-del/grok-ops-state. Git `main` is the truth; Grok Bot coordinates all tools.
> Native state (wins on detail): this file + `docs/HANDOFF_LOG.md`; CI `.github/workflows/ci.yml`

Owner: lead Grok Engineering desk; also Claude (CAID redesign), Lovable  ·  Visibility: PUBLIC (no private data here)  ·  Deploy: Vercel: every push to `main` deploys production
Last updated: 2026-11-20 19:42 IST by Grok Bot

## Current state
- Live on Vercel (TanStack Start). Checkout uses Razorpay.
- PR #82 merged 18 Oct 19:13 IST (cf290e1): create-subscription guard (same-origin, body validation, rate limit) + tests.

## In progress (claim before you start)
| Task | Agent | Claimed (IST) | Branch / PR | Notes |
|---|---|---|---|---|
| (none) |  |  |  |  |

## Next (unclaimed)
- (none)

## Blocked / needs founder (human-only)
- (none)

## Decisions
- Code changes go through a PR with green CI; docs-only commits may go to `main`.

## Open questions
- (none)

## Recent (newest first)
- Tareekh added as a first-class live product: card on home + Our Work, `/products/tareekh` (and `/tareekh`), footer, SEO. Honest live-scope (MP High Court only; other courts waitlisted). PR #86 squash-merged as 4ee8144. CI green (tsc, bun test 21, Playwright 4). Production verified 20 Nov 19:42 IST. Upwork/Freelancer portfolio copy is in /workspace/caid/portfolio_tareekh/ (browser step).
- Stale claim closed: Payment alert emails (Grok Engineering desk, 2026-10-18, PR #83) was still listed In progress a month later — left in place historically, no longer blocking.
- Plan CTAs go to `/contact#plan` (#84, merged 9c5bfef). Production form on aiworkspacehq.com returned 200 `{"ok":true,"delivery":"logged"}`. Resend did not send in that runtime; the request is in the function log until `RESEND_FROM` is a verified sender. Checkout/Razorpay untouched.
- cf290e1 security: guard create-subscription (#82) · de2b550 CAID redesign + security fix (#81)

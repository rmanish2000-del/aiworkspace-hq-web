# How aiworkspacehq.com is built and served

**Canonical repo:** `rmanish2000-del/aiworkspace-hq-web` (this one). **Host:** Vercel project `urjadata/aiworkspace-hq-web`. Lovable is not required; `aiworkspace-redo-sparkle` was a temporary Lovable copy and is kept only as an archive.

Verified 2026-10-10:
- Vercel builds every PR (preview) and deploys every push to `main` to production automatically.
- Production domains on the Vercel project: `aiworkspacehq.com`, `www.aiworkspacehq.com` (both verified). DNS is hosted on Vercel DNS (`ns1/ns2.vercel-dns.com`).
- Production env vars on Vercel: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY`. Optional mail overrides: `OPS_EMAIL` (admin payment-alert recipient; default `founder@aiworkspacehq.com`) and `MAIL_FROM` (default `AI Workspace <founder@aiworkspacehq.com>`, and that address must be a verified Resend sender).
- GitHub Actions `ci.yml` runs tests, typecheck, and build on every PR and push to `main`.
- A verified Razorpay webhook (`payment.captured`, `subscription.charged`, `subscription.activated` with a captured payment) sends the buyer confirmation and the admin alert. The checkout return URL does not send mail. `RESEND_API_KEY` is read from the environment. A mail failure is logged and still returns 200 to Razorpay. Sending is idempotent per payment id.

## Why nothing breaks without Lovable
- Plain `bun install && bun run build` works; `@lovable.dev/vite-tanstack-config` is an ordinary npm package.
- `src/lib/lovable-error-reporting.ts` is a no-op when Lovable's runtime is absent.

## The one DNS record that moved the site to Lovable
In August an apex `A @ 185.158.133.1` (Lovable) record replaced Vercel, which makes Vercel report the domain as misconfigured. Moving back = change that record to `A @ 76.76.21.21` (Vercel's recommendation) in Vercel → Domains → aiworkspacehq.com → DNS records. `www` already points to Vercel (`216.198.79.1`). The `_lovable*` TXT records can be deleted afterwards.

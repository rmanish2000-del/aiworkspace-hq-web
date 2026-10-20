# How aiworkspacehq.com is built and served

**Canonical repo:** `rmanish2000-del/aiworkspace-hq-web` (this one). **Host:** Vercel project `urjadata/aiworkspace-hq-web`. Lovable is not required; `aiworkspace-redo-sparkle` was a temporary Lovable copy and is kept only as an archive.

Verified 2026-10-10:
- Vercel builds every PR (preview) and deploys every push to `main` to production automatically.
- Production domains on the Vercel project: `aiworkspacehq.com`, `www.aiworkspacehq.com` (both verified). DNS is hosted on Vercel DNS (`ns1/ns2.vercel-dns.com`).
- Production env vars on Vercel: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY`.
- `POST /api/plan-request` emails `founder@aiworkspacehq.com` through Resend when `RESEND_API_KEY` is set (`RESEND_FROM` optional). If the key is missing or Resend refuses the message, the function writes the request to its logs and still returns 200. The key is never stored in the repo.
- GitHub Actions `ci.yml` typechecks and builds every PR and push to `main`.

## Why nothing breaks without Lovable
- Plain `bun install && bun run build` works; `@lovable.dev/vite-tanstack-config` is an ordinary npm package.
- `src/lib/lovable-error-reporting.ts` is a no-op when Lovable's runtime is absent.

## The one DNS record that moved the site to Lovable
In August an apex `A @ 185.158.133.1` (Lovable) record replaced Vercel, which makes Vercel report the domain as misconfigured. Moving back = change that record to `A @ 76.76.21.21` (Vercel's recommendation) in Vercel → Domains → aiworkspacehq.com → DNS records. `www` already points to Vercel (`216.198.79.1`). The `_lovable*` TXT records can be deleted afterwards.

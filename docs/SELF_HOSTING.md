# Running aiworkspacehq.com without Lovable

Canonical source: **this repository (`aiworkspace-hq-web`)**. Lovable is optional — an editor, not a dependency.

## Why it does not break if Lovable is dropped (verified 2026-10-10)
- Builds with plain `bun install && bun run build` (TanStack Start + Nitro, Cloudflare preset). The build emits `.output/server/wrangler.json`, so it deploys to any Cloudflare account.
- `@lovable.dev/vite-tanstack-config` is an ordinary npm package; it works outside Lovable.
- `src/lib/lovable-error-reporting.ts` only calls `window.__lovableEvents` if present — a no-op elsewhere.
- Lovable's hosting adds its own analytics scripts at serve time; they are not in this repo and disappear with self-hosting.

## Deploy pipeline (`.github/workflows/`)
- `ci.yml` — every PR and push to main: install, typecheck, build.
- `deploy.yml` — every push to main: build, `wrangler deploy` as Worker `aiworkspacehq`, smoke-test 4 pages. Skips cleanly until the secrets below exist.

## One-time setup (founder: tokens only, then nothing)
1. Cloudflare API token with "Edit Cloudflare Workers" → GitHub repo secret `CLOUDFLARE_API_TOKEN`; account id → `CLOUDFLARE_ACCOUNT_ID`.
2. Razorpay keys as Worker secrets: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (`wrangler secret put …`, or Cloudflare dashboard → Worker → Settings → Variables).
3. Cut-over: in Cloudflare, add `aiworkspacehq.com` as a Custom Domain on Worker `aiworkspacehq`, then remove the domain from Lovable. Update the Razorpay webhook URL if it changes.

Until step 3 the live domain keeps serving from Lovable (repo `aiworkspace-redo-sparkle`, which carries the same CAID redesign as PR #1, merged 928a148).

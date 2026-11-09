# Site content audit checklist

Run after any content change, and at least monthly.

## Command (cheap, automated)

```bash
node scripts/site-audit.mjs
```

Writes `docs/site-audit-report.json` and `docs/site-audit-report.md`. Exit code non-zero on failures.

Optional: `SITE_AUDIT_BASE=https://aiworkspacehq.com node scripts/site-audit.mjs`

Also refresh GitHub portfolio facts when repos change:

```bash
node scripts/sync-github.mjs
```

## Manual content checklist (global first-time client)

For **every** public route:

1. **Clear offer** — What do we do, for whom, in one screen?
2. **Proof** — Receipts, GitHub, live product links, or an explicit “not built” label. No invented clients, numbers, testimonials, or returns.
3. **Hire path** — Visible CTA to `/contact#plan` and/or the Upwork AI Eval Audit listing (`https://www.upwork.com/services/product/2109673752356316568`).
4. **English only** — Zero Devanagari or other non-English marketing copy.
5. **Facts match source of truth** — Compare product blurbs to live sites (`jachega.in`, `eduos.global`, ProofShot Space) and public GitHub READMEs. `/building` kill dates must not contradict `/our-work`.
6. **No placeholders** — No `TODO`, `FIXME`, `lorem ipsum`, or `{{TOKENS}}` in rendered HTML.
7. **Meta** — Unique `<title>` and meta description per page.
8. **Links** — Internal links 200 (or intentional redirect). External product/repo links not 404. Upwork may 403 to bots; verify manually if flagged soft.
9. **Legal consistency** — Entity name, address, GSTIN on Contact/About match Terms/Privacy/Delivery/Refunds. Pricing/checkout must not contradict About (“on sale” vs “nothing on sale”).
10. **CTA language** — Prefer “Ask for a scoped plan” over obsolete “Request Early Access” / “register interest” when the plan form is the real path.
11. **No third-party trackers** — Social is link-only; no X/IG embed scripts.
12. **Visual smoke** — Mobile (~390×844) and desktop (~1440×900): no overflow, broken images, or unusable menu. Screenshots optional under `/workspace/awhq-qa/`.

## Cost-effective cadence

| Trigger | What to run |
| --- | --- |
| Every content PR / push to `main` | `node scripts/site-audit.mjs` after Vercel deploy |
| Monthly (calendar) | Full checklist above + `sync-github.mjs` + spot-check Upwork listing in a real browser |
| When a product URL or kill date changes | Update `src/content/work.ts` / `caid.ts` / `copy.ts` building block the same day, then audit |

Do **not** spin a cloud coding agent for routine audits; the script is enough unless the HTML structure changes.

## SEO / discoverability (free, no trackers)

Automated via `node scripts/site-audit.mjs`:

- `/sitemap.xml` present with `<loc>` entries
- `/robots.txt` lists Sitemap + allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- `/llms.txt` and `/llms-full.txt` present
- Each HTML route has canonical link and parseable JSON-LD where emitted
- curl of HTML includes visible page text (SSR/prerender) — spot-check home H1

Manual / one-time human (not automated):

1. **Google Search Console** — verify domain (DNS or HTML tag). No verification token is stored in this repo; add one only after Manish completes Google login.
2. **Bing Webmaster Tools** — same, one-time human login.
3. Submit `https://aiworkspacehq.com/sitemap.xml` in both consoles after verify.

Analytics choice: **skip third-party and cookie trackers**. Do not add GA/Meta pixels. Vercel Web Analytics is cookieless and free on many plans but is **not** installed in this repo — leave off unless explicitly enabled later on the Vercel project (still no cookies).

OG image: `/og.png` (1200×630). Prefer WebP/lazy for large content images when added; current product cards are CSS-first.

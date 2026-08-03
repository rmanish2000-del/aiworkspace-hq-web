# CC-007 evidence pack — first deployment (staging) + AG-3 record

**Assignment:** `AWHQ-WEB-CC007` v1.0 · **Date:** 2026-08-04 · **Branch:**
`feature/cc007-staging` · **Status:** deployed and access-verified; two items
parked on founder gates (below).

## Staging deployment — live, protected, unindexed

- **Staging URL (founder only, per the assignment):**
  `https://aiworkspace-hq-28xwxbcc2-urjadata.vercel.app`
  (Vercel preview deployment of this branch, project `aiworkspace-hq-web`,
  team `urjadata`; GitHub deployment id `5734323358`, state `success`.)
- **Protection challenge proof (F-A2):** an unauthenticated `GET /` returns
  **HTTP 302 → `https://vercel.com/sso-api?...`** (Vercel Authentication
  challenge), not the site. Response headers captured 2026-08-03T21:58Z:
  `X-Robots-Tag: noindex` · `X-Frame-Options: DENY` ·
  `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` ·
  `Set-Cookie: _vercel_sso_nonce=…; Max-Age=3600; Secure; HttpOnly;
SameSite=Lax`.
- **noindex:** present in response headers (`X-Robots-Tag: noindex`, Vercel
  default on previews) **and** as `<meta name="robots">` in every built route
  — belt and braces.
- **No custom domain · no production promotion · no analytics** — nothing
  attached; the deployment is the git-integration preview of this branch.

## Cookie inventory (unauthenticated surface)

| Cookie              | Class                       | Verdict                                                                   |
| ------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `_vercel_sso_nonce` | Access control (protection) | Expected — the deployment-protection cookie; **not** tracking (CC-007 §3) |

Zero tracking cookies observed. The authenticated inventory completes with
the C-13 staging run (parked, below).

## TDR-03 verification

| Check                      | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **V-1 · Pro plan**         | ⛔ **PARKED — founder gate.** The Vercel connector granted to this session sees only `pmkusum-ops-ai` in team `urjadata`; the `aiworkspace-hq-web` project's plan page is not visible from here, and the SSO-type challenge does not by itself prove the tier. Needed: extend the connector's project access, or file a dashboard capture of the plan page. **No deploy decision was taken on this**: the deployment used is the git-integration preview that Vercel produces for every push — no new deploy was issued by me. |
| **V-2 · Log retention**    | **Shortfall — reported, not absorbed.** Vercel docs (`/docs/logs/runtime`, last_updated 2026-07-08): runtime-log retention is **Hobby 1 hour · Pro 1 day · Pro + Observability Plus 30 days · Enterprise 3 days**. Against the 30-day requirement, the plain Pro plan provides **1 day**. Meeting 30 days requires the Observability Plus add-on ($1.20/1M events) or an external log drain. Founder decision required; nothing here silently absorbs it.                                                                      |
| **V-3 · Commercial terms** | Captured. Vercel Pro plan doc (`/docs/plans/pro-plan`, last_updated **2026-07-15**): the Pro plan is "designed for professional developers, freelancers, and businesses" — commercial use is the plan's stated purpose. (Hobby's non-commercial restriction was our recorded rejection reason; this deployment is on the team plan, not Hobby — plan-tier proof itself is V-1, parked.)                                                                                                                                        |

## C-13 re-verification on the deployed artifact

⛔ **PARKED — founder gate.** Running the CC-006 suite against the staging
URL requires authenticating through Deployment Protection. Needed: the
project's **Protection Bypass for Automation** secret (Project Settings →
Deployment Protection), which lets the suite send
`x-vercel-protection-bypass` and inventory every cookie on the authenticated
surface. Until then, C-13 on staging remains **unverified**, exactly as the
CC-006 scope limitation anticipated.

## Acceptance status

| #   | Criterion                                                       | Status                                               |
| --- | --------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Staging live behind protection; unauthenticated request blocked | ✅ proven (302 challenge)                            |
| 2   | V-1 Pro evidenced · V-2/V-3 recorded honestly                   | V-2 ✅ (shortfall flagged) · V-3 ✅ · **V-1 parked** |
| 3   | C-13 suite green on deployed URL + full cookie inventory        | **Parked on bypass secret**                          |
| 4   | noindex in response headers on every route                      | ✅ header present (deployment-wide)                  |
| 5   | Evidence pack; `verify:release` green in CI                     | This document; CI green on the branch push           |

Prohibitions held: no Hobby deploy issued · no unprotected URL · no custom
domain · no DNS/HSTS-preload action · no analytics · no indexing · URL
reported to the founder only.

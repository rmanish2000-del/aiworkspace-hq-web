# Production readiness — report

**Assignment:** P1-L · **Version:** `0.5.0` · **Date:** 2026-07-26

> ## ⚠️ READY TO BE DEPLOYED IS NOT DEPLOYED
>
> Nothing in this report describes a running system. No host exists, no DNS
> record has been touched, no mailbox is connected, and no service is active.
> **AG-3 and AG-4 remain ungranted, and P1-A §9.3 freezes production release
> while Open Items A, B or C are open — all three are.**
>
> This report states what is now ready, what still blocks a deployment, and
> which checks cannot be run until one exists.

---

## 1. What P1-L added

| Area                 | Delivered                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Crawl directives     | `robots.txt`, generated from the same constant as the `noindex` tag                                    |
| Icon set             | `favicon.svg`, `favicon.ico` (32×32), `apple-touch-icon.png` (180×180)                                 |
| Social preview       | `og-image.png` (1200×630) + committed SVG source; `og:image`, `twitter:image`, alt text on every route |
| Manifest             | Refined — `id`, `scope`, `lang`, `dir`, two icons, still no `display`                                  |
| Windows tiles        | `browserconfig.xml` — tile colour, deliberately no tile image                                          |
| Header specification | `src/lib/production.ts` — `08` §9.2 as machine-readable data                                           |
| CSP hash             | `sha256` over the exact JSON-LD block, so `script-src` need not be loosened                            |
| Cache policy         | Six rules, each with its reason, in the same module                                                    |
| Deployment check     | `scripts/check-headers.mjs`, staged for AG-3                                                           |
| Deferred scaffolds   | `security.txt`, `humans.txt`, Atom feed — built, tested, **not emitted**                               |
| Regression suites    | 27 production unit tests; 61 new e2e assertions across all six routes                                  |

**No public behaviour changed.** The six routes render exactly as they did at
`0.4.0`; the additions are files browsers and crawlers fetch separately, plus
metadata in `<head>`.

---

## 2. The one judgement call, flagged for confirmation

### The social card and P-15

`04` §8 specifies the OG image precisely: _"the wordmark 'AI Workspace' and the
line 'Enterprise AI Operating Layer' on a plain background, using the type and
colours in `07`. No photography, no product imagery, no claim text."_

AWHQ-AUT-P1F **P-15** prohibits _"any logo, wordmark, ™ or ® symbol, or brand
asset"_ while 0 of 8 IP assets have evidenced ownership.

**These pull in opposite directions, and P1-L asked for the asset.** The card
was built on this reading:

- it contains **type, not a mark** — the approved words set in the `07` §3
  system font stack, with no logotype, monogram, glyph or symbol;
- both strings are already published as visible text on every route, so the
  card discloses nothing new;
- it introduces no font, no vendor, and no third-party origin;
- the source is a committed SVG, so replacing it later is one file.

**Confirmation requested:** that P-15 is read as prohibiting a _brand asset_
(logotype, monogram, wordmark artwork) rather than the typographic setting of an
already-published string. If that reading is wrong, `og-image.png`,
`og-image.svg` and the four `og:image*` / `twitter:image*` tags come out in one
commit — nothing else depends on them.

The **favicon set** does not carry this tension: it is a plain two-rectangle
glyph with no letterform, and `07` §11's suggested `"AI"` monogram is
deliberately not used. A test asserts the SVG contains no text, tspan or
font-family.

---

## 3. Crawl posture — deliberately closed

`robots.txt` currently reads `Disallow: /`.

`08` SEO-04 asks for an allow-all robots.txt — that is the **production** file.
`08` §13 requires every non-production environment to disallow crawling, and
`08` SEO-10 calls indexing mistakes _"common and damaging in both directions"_:
shipping production with a leftover `noindex`, or letting a non-production build
get indexed and compete with the canonical domain.

Both directives are generated from **one constant**, `CRAWLABLE` in
`src/lib/production.ts`, which is `IS_INDEXABLE` from `src/lib/site.ts` — the
same value driving the `noindex` meta tag. They cannot disagree. When a
production deployment exists and the constant flips, `robots.txt` becomes the
allow-all form with no edit.

A test asserts the two agree in whichever state the constant is in.

---

## 4. Security headers — specified, not applied

`src/lib/production.ts` states `08` §9.2 as data. It is **host-agnostic on
purpose**: a `_headers` file, a `vercel.json` or an `nginx.conf` would each be a
hosting-vendor artifact, and choosing one is the technology decision TDR-03 has
not made (P-02 forbids opening the account that would settle it).

| Header                         | Value                                                                                                                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Content-Security-Policy`      | `default-src 'self'; script-src 'self' <hash>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security`    | `max-age=31536000; includeSubDomains` — **no `preload`**                                                                                                                                                                                               |
| `X-Content-Type-Options`       | `nosniff`                                                                                                                                                                                                                                              |
| `Referrer-Policy`              | `strict-origin-when-cross-origin`                                                                                                                                                                                                                      |
| `X-Frame-Options`              | `DENY`                                                                                                                                                                                                                                                 |
| `Permissions-Policy`           | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()`                                                                                                                                                                     |
| `Cross-Origin-Opener-Policy`   | `same-origin`                                                                                                                                                                                                                                          |
| `Cross-Origin-Resource-Policy` | `same-origin`                                                                                                                                                                                                                                          |

`preload` is absent deliberately: `08` SEC-04 and DEC-024 add it only after 30
days of stable operation, because submitting to the preload list is effectively
irreversible. A test asserts it never appears.

### The CSP finding worth knowing about

`08` §9.2 sets `script-src 'self'` with no `'unsafe-inline'`. The page carries
an inline `<script type="application/ld+json">`.

A `ld+json` element is a _data block_ — the HTML standard never executes it, so
on a strict reading there is nothing for `script-src` to block. Engines have
differed on whether the inline check runs anyway, and a CSP is a header that
ships to production and **fails silently**: a page that loses its structured
data reports nothing a visitor would notice.

So a `sha256` hash of the block is computed at build time and added to
`script-src`. It costs one directive and removes the question. The hash is
derived from the same serialisation the page renders, in
`src/lib/structured-data.ts`, and a test asserts the two cannot drift.

**This is the cheaper side of an uncertainty, not a claim that the block would
otherwise definitely be blocked.**

---

## 5. Cache policy

| Match                       | `Cache-Control`                       | Why                                                                                                                                   |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Route documents             | `public, max-age=0, must-revalidate`  | `08` OPS-08 requires rollback in under two minutes without a rebuild. A long-lived HTML cache keeps serving the rolled-back document. |
| `/_astro/*`                 | `public, max-age=31536000, immutable` | Content-hashed: the filename changes when the content does, so the response can never be wrong.                                       |
| Icons, social card          | `public, max-age=86400`               | Not content-hashed; a long cache would pin a stale icon.                                                                              |
| Manifest, browserconfig     | `public, max-age=86400`               | Same reasoning as the icons they reference.                                                                                           |
| `robots.txt`, `sitemap.xml` | `public, max-age=3600`                | Bounds how long a stale crawl directive survives a correction.                                                                        |
| `security.txt`              | `public, max-age=3600`                | RFC 9116 expects it current; it carries its own `Expires`.                                                                            |

A test asserts only content-hashed paths are ever `immutable`.

---

## 6. Deferred, and why

Each is fully implemented in `src/lib/deferred-static.ts`, tested, and **not
routed**. A test asserts each URL returns 404.

| File                        | Blocked by                                                                                                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/.well-known/security.txt` | **Open Item C.** RFC 9116 makes `Contact` mandatory, and an address that bounces tells a researcher they have reported a vulnerability when they have not. `08` SEC-14 / P-13.                                                 |
| `/humans.txt`               | **Approved copy, and consent.** Its whole purpose is naming people. `04` §10 admits no unlisted string; P1-J §8.2 rules team names off `/contact`, and a different path does not change that.                                  |
| `/feed.xml`, `/rss.xml`     | **Nothing to syndicate.** `/research` and `/docs` are deferred (P1-J §12, §13) and there is no blog. An empty feed announces a publishing cadence nobody has decided — `02` §3 prohibits claims about dates and forward plans. |

The feed generator **throws** on an empty item list, and `securityTxt` throws
without a contact, so wiring a route before the blocker clears fails loudly
instead of publishing a promise.

---

## 7. Verification

| Check                          | Result                                                                |
| ------------------------------ | --------------------------------------------------------------------- |
| Unit tests                     | **100 pass** (27 new, production-specific)                            |
| End-to-end                     | **336 pass** across six routes × three viewports                      |
| axe-core                       | **0 violations**, all six routes, both colour schemes                 |
| Lighthouse                     | **100 / 100 / 100 / 100** on all five indexable routes                |
| Transfer budget                | 4.4–6.1 KB gzipped per route, against a 35 KB target and 60 KB budget |
| Requests on first load         | 3 per route, against a target of 4 and a budget of 6                  |
| Client JavaScript              | **0 bytes**                                                           |
| Web fonts                      | **0**                                                                 |
| Third-party requests           | **0**                                                                 |
| Cookies / storage              | **0 / none**                                                          |
| `html-validate`                | 0 errors                                                              |
| `npm audit`                    | 0 high or critical                                                    |
| Build, `tsc`, ESLint, Prettier | clean                                                                 |

The social card adds no request to page load — it is fetched only by link-preview
crawlers, never during a render (`07` §11).

### Lighthouse remains a **local baseline**, not evidence

Unchanged from
[`lighthouse-local-baseline.md`](lighthouse-local-baseline.md): `08` §8 measures
the deployed production URL under mobile emulation, 4× CPU throttling and Slow
4G. None of that exists. Re-measure after AG-3.

---

## 8. What still blocks a deployment

Ordered by what has to happen first.

| #   | Blocker                                               | Needed for                                                                                         |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | **Open Item D** — TDR-03 hosting unsigned             | There is no host to deploy to, and no way to apply the headers in §4                               |
| 2   | **Open Item C** — no mailbox                          | `/contact` addresses, `security.txt`, and `06` §12                                                 |
| 3   | **Open Item B** — legal entity                        | Footer entity line, copyright, `06` §1 and §12                                                     |
| 4   | **Open Item A** — counsel review of `06`              | `/privacy` publication; `06` §7 must not be published in its current form                          |
| 5   | **Open Item E** — brand assets                        | Replacing the placeholder icon set; possibly the social card (§2)                                  |
| 6   | **AG-3**                                              | Any deployment at all                                                                              |
| 7   | **AG-4**                                              | Any publication of content                                                                         |
| 8   | Manual accessibility passes A11Y-02…A11Y-12, M-1…M-10 | Still **all outstanding** — see [`manual-accessibility-checks.md`](manual-accessibility-checks.md) |
| 9   | Server-side branch protection                         | Still unavailable on the account plan — `HANDOFF.md` E-8                                           |

Items 1–5 are founder or counsel acts. Items 8 and 9 are the two engineering
obligations that no amount of further building will discharge.

---

## 9. Checks that cannot run until a deployment exists

Listed so they are not mistaken for passing.

| Check                                        | Why it cannot run                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `08` §14 post-deploy header check            | `scripts/check-headers.mjs` needs a URL                                                                 |
| `08` §8 performance budgets                  | Measured on the production URL under specified throttling                                               |
| `08` SEO-06 — `www` 308 → apex               | A DNS and host concern                                                                                  |
| `08` SEC-01…04 — HTTPS, TLS, HSTS            | Supplied by the host                                                                                    |
| `/404` returning HTTP 404 and `X-Robots-Tag` | A static build emits `404.html`; the status code is the host's. The `noindex` meta tag holds regardless |
| Cache-Control behaviour                      | Set by the host, per §5                                                                                 |
| `08` OPS-01…09 — uptime, backup, rollback    | TDR-10 unsigned; nothing to monitor                                                                     |

---

## 10. Recommendation on sequence

Endorsing the founder's note, with one engineering observation.

The public surface is now complete for what can honestly be said: six routes,
every claim traceable, every unverifiable statement withheld rather than
softened. **Adding pages from here would mean adding claims**, and every
remaining page in the eventual site — `/docs`, `/research`, an API reference —
describes capability that does not exist yet. `02` §3 prohibits exactly that,
and P1-J §12/§13 already declined both on those grounds.

The binding constraint on the website is no longer engineering. It is that there
is nothing further it can truthfully say until the platform produces something —
a documented surface, or a research output. Building more site now would either
idle or force a claim.

**The two things worth doing to this repository before the platform catches up**
are the ones in §8 that are not blocked on anyone else: the manual accessibility
passes, and branch protection. Both are outstanding, and neither needs a page.

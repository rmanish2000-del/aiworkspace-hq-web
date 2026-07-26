# public/

Files here are copied to the output root verbatim. Anything in this directory is
**served publicly**, so it carries no internal comment, no governance note and no
placeholder token.

## Present

| File                   | Status                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| `favicon.svg`          | **Placeholder.** Plain geometric glyph. No letterform, no monogram. |
| `favicon.ico`          | 32×32, generated from `favicon.svg` by `npm run assets`.            |
| `apple-touch-icon.png` | 180×180, same source.                                               |
| `og-image.svg`         | Social card source. Type only — see below.                          |
| `og-image.png`         | 1200×630, rendered from `og-image.svg` by `npm run assets`.         |
| `site.webmanifest`     | **Placeholder.** Names the product with the approved public string. |
| `browserconfig.xml`    | Windows tile metadata. No new string.                               |

`robots.txt` and `sitemap.xml` are **generated at build time**, not stored here —
`src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts`. Both are driven by the
single `IS_INDEXABLE` constant in `src/lib/site.ts`, so the crawl directive, the
`noindex` meta tag and the sitemap cannot disagree with one another.

## Why none of these is a brand asset

P0 `07` §11 suggests an `"AI"` monogram for the real favicon. That is
deliberately **not** used. A monogram is a brand asset, and AWHQ-AUT-P1F **P-15**
blocks brand assets while 0 of 8 IP assets have evidenced ownership
(Open Item E).

- the icon carries no wordmark, monogram, logotype, or letterform;
- the manifest introduces no new string — `name` and `short_name` are the
  approved public product string from P0 `04` §2 and §8.

`npm run verify:release` asserts both mechanically: `favicon.svg` must contain no
`<text>`, `<tspan>` or `font-family`, and `og-image.svg` must embed no raster and
contain no `™` or `®`.

**When P-15 lifts, replace these files wholesale. Do not edit them toward a
brand** — that would turn a placeholder into an unapproved brand decision.

## The social card, and why it is emittable

`04` §8 specifies the content exactly: "the wordmark 'AI Workspace' and the line
'Enterprise AI Operating Layer' on a plain background, using the type and colours
in `07`. No photography, no product imagery, no claim text."

Both strings are approved copy, already published as text on every page. The
colours are the `bg`, `fg` and `fg-muted` tokens from `07` §2 (light theme — a
social card has no colour scheme to follow). The type is the `07` §3 system
stack, so the card introduces no font and no vendor.

**Founder decision, P1-L review — approved as implemented:**

> Using the approved text "AI Workspace" typographically in the social card is
> not the same as introducing a new logo, trademark symbol, or unapproved brand
> artwork. The social card must not introduce a separate graphic mark, stylized
> emblem, `™`, or `®` until branding and IP approvals exist.

The card therefore carries the wordmark as **type**, not as a logotype or
monogram. If a real brand asset ever arrives, this file is replaced wholesale.

This rationale lives here rather than inside `og-image.svg` because that file is
served publicly and must not ship internal governance notes (P1-M).

## Still absent, each with a reason

| Missing                    | Blocked by                                          |
| -------------------------- | --------------------------------------------------- |
| Wordmark SVG               | P-15, Open Item E                                   |
| `.well-known/security.txt` | Open Item C, P-13 — needs a real contact and expiry |
| `humans.txt`               | No approved credits list                            |
| `feed.xml` / `rss.xml`     | No published items to feed                          |

The last three have working generators in `src/lib/deferred-static.ts` that throw
rather than emit an incomplete file, and `verify:release` asserts none of them
reaches `dist/`.

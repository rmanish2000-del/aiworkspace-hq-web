# public/

Files here are copied to the output root verbatim. Anything in this directory is
**served publicly**, so it carries no internal comment, no governance note and no
placeholder token.

## Present

| File                   | Status                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `favicon.svg`          | Evidence Aperture identity; responsive light/dark SVG.            |
| `favicon.ico`          | 32×32, generated from `favicon.svg` by `npm run assets`.          |
| `apple-touch-icon.png` | 180×180, same source.                                             |
| `og-image.svg`         | Brand V1.2 social-card source with mark and approved positioning. |
| `og-image.png`         | 1200×630, rendered from `og-image.svg` by `npm run assets`.       |
| `site.webmanifest`     | Product metadata and founder-approved identity assets.            |
| `browserconfig.xml`    | Windows tile metadata in structural indigo.                       |

`robots.txt` and `sitemap.xml` are **generated at build time**, not stored here —
`src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts`. Both are driven by the
single `IS_INDEXABLE` constant in `src/lib/site.ts`, so the crawl directive, the
`noindex` meta tag and the sitemap cannot disagree with one another.

## Brand approval boundary

Brand System V1.2 founder approval supersedes the placeholder-only identity
constraint for the Evidence Aperture mark and the visual tokens implemented in
this repository. It does not establish trademark registration or visual-
similarity clearance; those remain separate legal checks.

- the icon carries the approved Evidence Aperture symbol and no letterform;
- the manifest introduces no new string — `name` and `short_name` are the
  approved public product string from P0 `04` §2 and §8.

`npm run verify:release` asserts mechanically that both assets contain the
approved evidence-node geometry, embed no raster, and contain no `™` or `®`.

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

The card combines the approved Evidence Aperture mark with the canonical product
name and approved candidate positioning line.

This rationale lives here rather than inside `og-image.svg` because that file is
served publicly and must not ship internal governance notes (P1-M).

## Still absent, each with a reason

| Missing                    | Blocked by                                          |
| -------------------------- | --------------------------------------------------- |
| `.well-known/security.txt` | Open Item C, P-13 — needs a real contact and expiry |
| `humans.txt`               | No approved credits list                            |
| `feed.xml` / `rss.xml`     | No published items to feed                          |

The last three have working generators in `src/lib/deferred-static.ts` that throw
rather than emit an incomplete file, and `verify:release` asserts none of them
reaches `dist/`.

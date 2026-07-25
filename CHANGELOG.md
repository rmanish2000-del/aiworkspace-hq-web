# Changelog

All notable changes to this repository are recorded here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html), per
P1-A §5.3 — `0.y.z` until the first production release is accepted at Gate C;
`1.0.0` at first accepted production cutover, not before and not as an
aspiration.

**Traceability rule (P1-A §5.3):** every entry records the specification version
it implements. An entry whose specification version cannot be named is not
releasable.

---

## [Unreleased]

Nothing. `main` is at `0.4.0`.

---

## [0.4.0] — 2026-07-26

**Implements:** P0 v1.1.1 + `AWHQ-WEB-P1J` v1.0
**Authorized under:** AG-2-S, assignment P1-K
**Released:** no. No tag, no deployment. AG-3 and AG-4 expressly withheld.

The Phase 1 website: six routes, a navigation shell, and a sitemap.

### Cleanup — landed first, in its own commit

P1-J §0 makes the P1-I cleanup a precondition, not a parallel task, and CL-5
requires it as a separate commit before the first route commit.

`Badge`, `Card`, `Tag` and `Grid` were **removed from the codebase**, not merely
un-exported, so a build importing one fails rather than falling back silently
(CL-4). Elevation tokens were removed entirely — P0 `07` defines no elevation
scale, and P1-J §0: "Phase 1 pages use borders and background tokens for
separation, never shadow." `Navigation` moved the other way: P1-J §4.1 approves
it, replacing DEC-008.

### Added

- **`/platform`** — P1-J §6. The category, the problem, three "is designed to"
  pillars, and seven definitional distinctions. No architecture, no feature, no
  integration, no deployment model, no performance figure, no date, no
  competitor named.
- **`/principles`** — P1-J §7. The five principles resolve from the **same copy
  entry** `/` uses; a test asserts they are byte-identical on both routes.
- **`/contact`** — P1-J §8, **shell only**. Structure and prose render; every
  address is withheld. P1-J §8.1: "A contact page that publishes a non-existent
  address is worse than no contact page."
- **`/privacy`** — P0 `06` Part B via P1-J §9. All twelve headings in order,
  `[LEGAL]` markers stripped, and three classes of content withheld: build-time
  placeholders, `06` §7 ("must not be published in this form"), and any
  sentence describing processing this build does not perform.
- **Navigation** — four items, `aria-current` on the active route, wordmark
  linking home on every route except `/`. No dropdown, no hamburger, no
  JavaScript.
- **`/sitemap.xml`** — the five indexable routes. No `lastmod`: there is no
  publication date, and inventing one would assert a date `02` §3 prohibits.
- **`Organization` JSON-LD** on `/` only, without `logo` (a brand asset, P-15).
- **`tests/e2e/routes.spec.ts`** — every route rendered, axe-clean, canonical,
  noindex, landmark map, link integrity, and the deferred routes proven absent.

### Changed

- **The 404 body string.** P0 `04` §11 read "There is only one page here at the
  moment." — false the moment a second route shipped. P1-J §10 supplies the
  replacement, and a test asserts the old string appears nowhere in the build.
- Internal template comments no longer ship to the browser. HTML comments in
  `.astro` render into output; several named the placeholders they explained,
  so `{{LEGAL_ENTITY_NAME}}` and three others were reaching `/privacy`. All are
  now `{/* */}` comments, stripped at build. **Zero HTML comments ship.**
- `Link` no longer puts whitespace inside its anchor — it rendered as
  "register interest ." on `/contact`.
- The prohibited-term gate now also matches `pricing` and `roadmap`, which
  P1-J §7.1 relies on existing.

### Known deviations, each recorded

- `/principles` renders the principles as **h2, not h3**. P1-J §7.3's outline
  skips a level, which fails `08` HTML-01/HTML-03 and WCAG 1.3.1. P1-A §6.1
  puts P0 above P1-J.
- `06` Part B's "This site is a single page" is withheld — the same defect
  P1-J §10 corrected in the 404 string, not yet corrected in `06`.
- `/404` returns HTTP 404 and `X-Robots-Tag` only from a host; a static build
  emits `404.html`. The `noindex` meta tag holds regardless.

All in
[`docs/reviews/implementation-notes.md`](docs/reviews/implementation-notes.md).

### Verified

73 unit · 276 e2e · axe **0 violations on all six routes in both colour
schemes** · Lighthouse **100/100/100/100 on all five indexable routes** ·
zero cookies, zero storage, zero third-party requests, zero client JavaScript.

---

## [0.3.0] — 2026-07-26

**Implements:** P0 v1.1.1
**Authorized under:** AG-2-S, assignment P1-I
**Released:** no. No tag, no deployment. AG-3 expressly withheld.

The design system: reusable foundations and components for every future page.

### Added

- **Ten foundations**, declared twice and kept in step by test — as CSS custom
  properties in `src/styles/tokens.css` and typed values in
  `src/lib/tokens.ts`. Typography, spacing, grid, breakpoints, colour,
  elevation, radius, motion, icon sizing, z-index.
- **Fifteen components** in `src/components/ui/`: `Container`, `Stack`,
  `Section`, `Grid`, `Button`, `Link`, `Logo`, `Hero`, `Footer`, `Callout`,
  `Divider`, `Card`, `Badge`, `Tag`, `Navigation`. Zero JavaScript, fully typed,
  no content authority.
- **`docs/design-system/`** — token reference, component catalog, usage rules,
  accessibility notes.
- **53 new unit tests.** Components are rendered in-process through Astro's
  Container API, so the system is covered without the component showcase page
  P1-I prohibits.

### Changed

- The page is now composed from the system. `SiteHeader` uses `Container` +
  `Logo`; `SiteFooter` uses `Footer` + `Container`; `Hero` uses the `Hero`
  primitive with `Callout` and `Button`; `Principles` and `InterestForm` use
  `Section`; `Base` uses `Container`.
- Component CSS moved out of `global.css` into the components that own it.
  What remains there is page-level rhythm — spacing _between_ blocks, which is
  the page's concern rather than any component's.
- `vitest.config.ts` now uses Astro's Vite pipeline so `.astro` files can be
  rendered in tests.

**The refactor is pixel-identical.** All ten review screenshots — mobile,
tablet and desktop in both colour schemes, plus focus state and print — compare
byte-for-byte equal at the pixel level against the `0.2.0` baseline. Lighthouse
holds at 100/100/100/100.

### Provenance, and what is deliberately unapproved

P0 `07` opens by stating it is **"Not a design system"**. P1-I directs that one
be built for reuse, so every token and component is tagged `CANONICAL`
(transcribed from `07`) or `EXTENSION` (new, and **not approved until
ratified**).

Five components ship **unapproved for the current routes**, each rejected by an
approved specification: `Badge` and `Tag` (`07` §1, §6.3 — a pill "would read as
a status chip and imply a state we are not claiming"), `Card` (`07` §1, `03`
§3), `Grid` (`07` §4 — single column), `Navigation` (`03` §2 — nothing to
navigate to). A test asserts none of them reaches a page.

Elevation levels 1 and 2 are defined but unapproved: `07` §1 rejects floating
cards, so the page's depth model is that there is no depth.

---

## [0.2.0] — 2026-07-26

**Implements:** P0 v1.1.1
**Authorized under:** AG-2-S, assignment P1-H
**Released:** no. No tag, no deployment. AG-3 expressly withheld.

The static holding page, complete against `03` §2 for the two routes in scope.

### Added

- **Block 4, Early interest — visual only.** All five fields with visible
  labels and hints, the consent checkbox, the submit control, and the privacy
  micro-notice carrying binding commitments C-12, C-13 and C-14. No submission
  path exists: no `action`, `method="dialog"` so both click and Enter are
  no-ops, zero JavaScript, nothing persisted. Proven by
  `tests/e2e/form-inert.spec.ts`, not asserted in a comment.
- **Hero primary call to action**, restored now that `#interest` exists.
- **Print stylesheet** (`src/styles/print.css`) — forces black on white even
  from dark mode, drops the form, the CTA and the skip link, keeps headings and
  principles whole across page breaks, and never expands a link into a visible
  URL.
- **Favicon and manifest placeholders.** Neither is a brand asset: the icon is a
  plain geometric glyph with no letterform, and the manifest introduces no new
  string. `07` §11's `"AI"` monogram is deliberately not used — P-15.
- `src/lib/site.ts` — the canonical origin and the indexability constant, in one
  place.
- `scripts/screenshots.mjs` and `npm run screenshots` — reproducible review set
  across mobile, tablet and desktop in both colour schemes, plus print.
- Tests: form inertness, field labelling, consent defaults, tab order, asset
  placeholders, print behaviour, and a guard that no environment variable is
  read. 19 unit and 147 e2e, up from 17 and 90.

### Changed

- **No environment variable is read anywhere.** The canonical origin is the
  literal from `04` §1 rather than `PUBLIC_SITE_URL`, and every route is
  `noindex` unconditionally rather than by `ENVIRONMENT`. There is no
  environment to vary by, and reading an origin from the environment would let
  an unapproved one reach the page. `.env.example` stays as documentation of a
  future need; a unit test asserts nothing reads it.
- `astro.config.mjs` → `astro.config.ts`.
- Fixed a spacing defect: the `07` §4 hero→principles gap was missing on screen
  and in print, because `.hero` does not carry the `.section` class.
- The scope guards now strip comments before scanning, so prose explaining why
  a construct is absent no longer trips the guard looking for it.

### Known deviations

- "Read the privacy notice" renders as text, not a link — `/privacy` is not
  built. The sentence is verbatim; only the anchor is absent.
- `autocapitalize="none"` omitted from the email field — `html-validate`
  rejects it on `type="email"` and `08` HTML-01 requires zero errors.
- The CTA does not move focus into the form (`07` §7) — that needs JavaScript.

All three, with reasoning, in
[`docs/decisions/ADR-0003-visual-only-form.md`](docs/decisions/ADR-0003-visual-only-form.md).

---

## [0.1.0] — 2026-07-25

**Implements:** P0 v1.1.1
**Authorized under:** AG-1 + AG-2-S (`AWHQ-AUT-P1F` v1.0 §7)
**Released:** no. No tag, no deployment. AG-3 expressly withheld.

First commit. Repository initialization and the non-public development
foundation.

### Added

- Repository skeleton: `README`, `PROJECT_STATE`, `HANDOFF`, `CHANGELOG`,
  `LICENSE` placeholder, `docs/{spec,governance,decisions,reviews}`, `src`,
  `public`, `tests`, `.github/workflows`.
- Toolchain on the six signed technology rows: Astro 7 static output (TDR-01);
  TypeScript strict, Node 22.23.1 pinned, npm with committed lockfile (TDR-02);
  GitHub Actions (TDR-04); ESLint, Prettier, Vitest, Playwright, axe-core,
  html-validate, Lighthouse CI, npm audit, gitleaks (TDR-12); zero web fonts,
  system font stack (TDR-13).
- `src/content/copy.ts` — every visible string, transcribed verbatim from
  P0 `04`, as the single source. No string literal appears in a template.
- Design tokens and stylesheet from P0 `07`: two first-class colour themes, a
  fluid type scale clamped between the 360 px and 1280 px viewports, a 4 px
  spacing base, and a 720 px single-column container.
- `Base` layout — head metadata, skip link, and the `03` §5 landmark map.
- Route `/` — header, hero, principles, footer landmark.
- Route `/404`.
- Unit tests: prohibited-term gate against `02` §1.3 and §3, placeholder
  discipline, verbatim invariants, provisional-string quarantine, copy
  completeness, and scope-boundary guards.
- End-to-end tests: axe-core on both routes in both colour schemes, document
  outline, landmark map, responsive behaviour from 320 px, 400 % zoom reflow,
  text-spacing resilience, metadata, and boundary assertions (zero cookies, zero
  third-party requests, zero web fonts, zero JavaScript, no leaked placeholder).
- CI: quality, build, link check, accessibility/e2e, Lighthouse, and security
  jobs. CodeQL for JavaScript/TypeScript and for the workflows themselves.
  Dependabot for npm and GitHub Actions, grouped by concern.
- `.env.example` with names only and empty values; `.gitleaks.toml` including a
  rule that fails if a value is ever assigned in `.env.example`.

### Deliberately not added

Deployment configuration, hosting or any other vendor account, DNS change,
security response headers, analytics, bot mitigation, storage, email, the
submission form and its endpoints, `/privacy`, `robots.txt`, `sitemap.xml`,
`security.txt`, favicons, OG image, web manifest, and any secret.

Each is blocked by a named prohibition in `AWHQ-AUT-P1F` §8 or by an open item.
See [`PROJECT_STATE.md`](PROJECT_STATE.md) §7.

### Security

- Every direct dependency is at its current release. The first install produced
  1 critical and 18 high advisories; all are resolved. Four `overrides` entries
  force patched transitive versions where a parent still pins a vulnerable
  range. Two moderate findings remain knowingly — reasoning in
  [`PROJECT_STATE.md`](PROJECT_STATE.md) §6.

### Known deviations

- Hero primary CTA omitted with the early-interest block it targets.
- Footer renders as a landmark with no copy; all four lines blocked.
- Two provisional strings pending founder ratification (GAP-01, GAP-02).

Recorded in [`docs/decisions/ADR-0002-scope-deviations.md`](docs/decisions/ADR-0002-scope-deviations.md)
and escalated in [`HANDOFF.md`](HANDOFF.md).

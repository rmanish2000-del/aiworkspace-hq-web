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

Nothing. `main` is at `0.1.0`.

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

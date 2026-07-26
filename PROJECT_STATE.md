# PROJECT_STATE

**Repository:** `aiworkspace-hq-web`
**Implementation version:** `0.6.0`
**Specification version implemented:** P0 v1.1.1 + `AWHQ-WEB-P1J` v1.0
**Authorization operated under:** AG-1 + AG-2-S, scope-limited (`AWHQ-AUT-P1F` v1.0 §7)
**Last updated:** 2026-07-26 (P1-M.1 — release-candidate freeze)

This file records what is actually true of this repository. Where it disagrees
with any planning document, this file is wrong and should be corrected — the
running system is the authority on reality, not the other way round.

---

## 1. Lifecycle state

| #   | State       | Status                                                        |
| --- | ----------- | ------------------------------------------------------------- |
| 1   | Proposed    | passed                                                        |
| 2   | Authorized  | passed                                                        |
| 3   | Initialized | passed                                                        |
| 4   | **Active**  | **current** — Phase 1 complete, frozen as a release candidate |
| 5   | Maintained  | not reached                                                   |
| 6   | Archived    | not reached                                                   |

### Phase 1 Release Candidate — frozen

|                        |                                                                    |
| ---------------------- | ------------------------------------------------------------------ |
| Assignment             | P1-M.1 — final merge, release-candidate freeze and project closure |
| Tag                    | `v0.5.0-rc1`                                                       |
| Implementation version | `0.6.0` (see the note below)                                       |
| Deployment             | **Not authorized.** AG-3 and AG-4 remain expressly withheld        |
| Publication            | **Not performed.** No DNS, no hosting, no services activated       |

**A release candidate is not a release.** The tag marks a verified, frozen state
of the repository. It authorizes nothing: nothing is deployed, no DNS record
exists, no vendor account has been created, and `/privacy` remains
unpublishable while Open Items A and B are open.

**Version/tag mismatch, recorded rather than silently reconciled.** The tag name
`v0.5.0-rc1` was specified by the founder in the P1-M.1 assignment. The tree it
points at is version `0.6.0` — `0.5.0` was P1-L. The tag was created as
instructed and the discrepancy is flagged here. Retagging costs one command and
no GitHub Release exists, so this is recoverable at any time.

## 2. Gates

| Gate   | Authorizes                             | State                                        |
| ------ | -------------------------------------- | -------------------------------------------- |
| AG-1   | Repository existence and configuration | Granted                                      |
| AG-2-S | Scope-limited implementation           | Granted — **this assignment**                |
| AG-2   | Unrestricted implementation            | **Not granted.** Requires Open Item D closed |
| AG-3   | Deployment                             | **Not granted. Expressly withheld**          |
| AG-4   | Publication                            | **Not granted. Expressly withheld**          |

## 3. Open items

| Item | Subject                                      | State                | What it blocks here                                                             |
| ---- | -------------------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| A    | Legal review of the privacy notice           | Open                 | `/privacy` route; any publication                                               |
| B    | Legal entity and jurisdiction                | Open                 | Footer entity line; copyright line; `LICENSE`                                   |
| C    | Published contact and notification mailboxes | Open                 | Footer email; `security.txt`; success-message body                              |
| D    | Technology decisions                         | **Partially closed** | 6 of 13 rows signed; the 7 unsigned rows are the components this scope excludes |
| E    | Brand assets                                 | Open                 | Favicons, OG image, wordmark SVG, web manifest                                  |

### Open Item D — which rows are in force

| TDR | Component                            | State        | In use here                                                                                               |
| --- | ------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------- |
| 01  | Site framework                       | Signed       | Astro 7, static output                                                                                    |
| 02  | Language / runtime / package manager | Signed       | TypeScript strict, Node 22.23.1 pinned, npm + committed lockfile                                          |
| 04  | Repository host + CI                 | Signed       | GitHub + GitHub Actions                                                                                   |
| 11  | DNS posture                          | Signed       | Not exercised — no DNS change made                                                                        |
| 12  | Test / quality toolchain             | Signed       | ESLint, Prettier, tsc, html-validate, lychee, axe, Lighthouse CI, Vitest, Playwright, npm audit, gitleaks |
| 13  | Web fonts                            | Signed       | Zero web fonts; system font stack                                                                         |
| 03  | Hosting + serverless                 | **Unsigned** | Excluded — nothing is deployed                                                                            |
| 05  | Submission store                     | **Unsigned** | Excluded — no storage                                                                                     |
| 06  | Rate-limit KV                        | **Unsigned** | Excluded — no storage                                                                                     |
| 07  | Transactional email                  | **Unsigned** | Excluded — no email                                                                                       |
| 08  | Bot mitigation                       | **Unsigned** | Excluded — no challenge, no keys, no CSP entries                                                          |
| 09  | Analytics                            | **Unsigned** | Excluded — no analytics                                                                                   |
| 10  | Uptime monitoring                    | **Unsigned** | Excluded — nothing to monitor                                                                             |

Every technology this repository depends on has a signed decision. Every
component with an open decision is excluded by an enumerated prohibition.

## 4. What is built

Six routes, per P1-J §3.

| Route                       | File                         | Status                                             |
| --------------------------- | ---------------------------- | -------------------------------------------------- |
| `/`                         | `src/pages/index.astro`      | Built — hero, principles, visual-only form         |
| `/platform`                 | `src/pages/platform.astro`   | Built — P1-J §6                                    |
| `/principles`               | `src/pages/principles.astro` | Built — P1-J §7                                    |
| `/contact`                  | `src/pages/contact.astro`    | Built **as a shell** — 2 of 4 sections withheld    |
| `/privacy`                  | `src/pages/privacy.astro`    | Built — **not publishable**, Open Items A and B    |
| `/404`                      | `src/pages/404.astro`        | Built — body string corrected by P1-J §10          |
| `/sitemap.xml`              | `src/pages/sitemap.xml.ts`   | Built — the five indexable routes                  |
| `/docs`                     | —                            | **Deferred.** P1-J §13 — no approved platform spec |
| `/research`                 | —                            | **Deferred.** P1-J §12 — no approved research      |
| `/robots.txt`               | `src/pages/robots.txt.ts`    | Built — `Disallow: /`, matching the noindex state  |
| `/.well-known/security.txt` | —                            | Scaffolded, **not emitted.** Open Item C; P-13     |
| `/humans.txt`               | —                            | Scaffolded, **not emitted.** No approved copy      |
| `/feed.xml`, `/rss.xml`     | —                            | Scaffolded, **not emitted.** Nothing to syndicate  |
| `/api/interest`             | —                            | **Not built.** MF-1 — and none is possible         |
| `/api/form-token`           | —                            | **Not built.** MF-1                                |

Nothing links to a route that does not exist, and a test asserts it.

### Blocks on `/`, against `03` §2

| #   | Block          | Status                                                                   |
| --- | -------------- | ------------------------------------------------------------------------ |
| 0   | Skip link      | Built. Text is **provisional** — GAP-01                                  |
| 1   | Header         | Built                                                                    |
| 2   | Hero           | Built, including the primary CTA to `#interest`                          |
| 3   | Principles     | Built, all five, in order                                                |
| 4   | Early interest | Built, **visual only** — no submission path exists (ADR-0003)            |
| 5   | Footer         | Landmark built; **all four content lines blocked** on Open Items B and C |

Since P1-I the page is composed from the design system in
[`src/components/ui/`](src/components/ui/) — see
[`docs/design-system/`](docs/design-system/). The refactor was verified
**pixel-identical** across all ten review screenshots, so nothing about the
rendered page changed.

Deviations from `03` are recorded in
[`docs/decisions/ADR-0002-scope-deviations.md`](docs/decisions/ADR-0002-scope-deviations.md).

## 5. Verified facts about the running system

Measured on 2026-07-25 against the local build. Commands in `README.md`.

| Property                                | Value                             | How verified                            |
| --------------------------------------- | --------------------------------- | --------------------------------------- |
| Routes rendering                        | 2                                 | `npm run build`                         |
| Client JavaScript                       | **0 bytes**                       | e2e assertion; no `<script>` in output  |
| Web fonts                               | **0**                             | e2e assertion; no font request          |
| Third-party requests on first render    | **0**                             | e2e assertion                           |
| Cookies set                             | **0**                             | e2e assertion — binding commitment C-13 |
| Client-side storage used                | **none**                          | e2e assertion                           |
| `<img>` elements                        | **0**                             | e2e assertion                           |
| Build-time `{{placeholders}}` in output | **0**                             | e2e assertion + CI grep                 |
| Total page weight                       | ~4 KiB                            | Lighthouse                              |
| Requests on first load                  | 1                                 | Lighthouse                              |
| Indexable                               | **No** — `noindex` on every route | e2e assertion                           |

## 6. Gate results

Run locally on 2026-07-26, Windows 11, **Node 22.14.0** — see the caveat below.

| Gate                           | Result                                                                      |
| ------------------------------ | --------------------------------------------------------------------------- |
| Build                          | **pass**                                                                    |
| `tsc --noEmit`                 | **pass** — 0 errors                                                         |
| ESLint                         | **pass** — 0 errors                                                         |
| Prettier `--check`             | **pass**                                                                    |
| Vitest                         | **pass** — 17/17                                                            |
| `html-validate`                | **pass** — 0 errors                                                         |
| Playwright                     | **pass** — 90/90                                                            |
| axe-core                       | **pass** — 0 violations, `/` and `/404`, light and dark                     |
| Lighthouse                     | **pass** — 100 / 100 / 100 / 100; LCP 211 ms; CLS 0; 4,346 bytes; 1 request |
| `npm audit --audit-level=high` | **pass** — 0 high or critical; **2 moderate remain**, recorded below        |
| `lychee`                       | not run locally — runs in CI                                                |
| `gitleaks`                     | not run locally — runs in CI                                                |
| CodeQL                         | runs in CI                                                                  |

### Caveat — the local runs used an older Node than the pin

`.nvmrc` pins **22.23.1**, because two build-time dependencies declare
`node: ^22.22.3`. The machine used for the runs above has **22.14.0** installed.
Every gate passes on 22.14.0 with `EBADENGINE` warnings and no errors, so the
pinned version is newer than the verified one rather than older — a lower-risk
direction, but still unverified. **The first CI run is the authoritative check
of the pin.**

### Two moderate vulnerabilities remain, knowingly

| Package        | Advisory                                                 | Path                 |
| -------------- | -------------------------------------------------------- | -------------------- |
| `uuid` <11.1.1 | Missing buffer bounds check in v3/v5/v6 when `buf` given | `@lhci/cli` → `uuid` |

The only remediation `npm audit` offers is downgrading `@lhci/cli` from 0.15.1
to 0.6.1 — a breaking change that would lose the budget assertions. The package
is a dev-time reporting tool that never touches the delivered page, and the
affected path requires a caller-supplied buffer this repository never supplies.

`08` SEC-11 sets the gate at `--audit-level=high`, which passes. This is
recorded so the moderate findings are a decision rather than an oversight.
Review when `@lhci/cli` ships a fix.

All high and critical findings present at first install were resolved by
upgrading the direct dependencies and by four `overrides` entries in
`package.json` (`brace-expansion`, `minimatch`, `tmp`, `sharp`). Each override
should be removed once its parent ships the fix.

**Lighthouse results are indicative, not evidence.** `08` §8 measures the
deployed production URL under mobile emulation, 4× CPU throttling and Slow 4G.
None of that exists here. Re-measure after AG-3.

## 6a. Remote repository configuration — as applied

| Control                              | State                                                       |
| ------------------------------------ | ----------------------------------------------------------- |
| Visibility                           | ✅ **Private** — verified                                   |
| Default branch                       | ✅ `main`                                                   |
| Principals with access               | ✅ Account owner only. No collaborator, no bot, no app      |
| Dependabot alerts                    | ✅ Enabled                                                  |
| Dependabot automated security fixes  | ✅ Enabled                                                  |
| Merge commits                        | ✅ Disabled — squash and rebase only                        |
| Delete branch on merge               | ✅ Enabled                                                  |
| Secret scanning / push protection    | ⛔ **Unavailable on this plan** — `gitleaks` in CI instead  |
| Branch protection on `main` (server) | ⛔ **NOT APPLIED — unavailable on this plan**               |
| Direct push to `main` (local)        | 🟡 Refused by `.githooks/pre-push` — a seatbelt, not a lock |
| Working practice                     | ✅ Short-lived branches, merged by pull request             |

**Server-side branch protection still could not be applied.** Retried under
P1-H.1 on 2026-07-26: the rulesets API and the classic branch-protection API
both return `403 — Upgrade to GitHub Pro or make this repository public`. The
account is on the Free plan, where these features exist on public repositories
only, and making this repository public is prohibited by SEC-12, P-09 and P-17.

**What is in force instead**

`.githooks/pre-push` refuses a push whose target is `main`, and
`npm run prepare` points `core.hooksPath` at it on every install. All work now
goes through a short-lived branch and a pull request.

Stated precisely, so the gap is not mistaken for closure:

- the hook **prevents the ordinary mistake** — pushing to `main` out of habit;
- it does **not** prevent a bypass: `git push --no-verify` skips it, and it only
  runs where `core.hooksPath` has been set;
- nothing mechanically requires CI to be green before a merge.

So P1-A §4.1 is **partly enforced and partly convention**, and P1-A **CC-9** is
still **not satisfied**. P1-A §2.4 step 5 (secret scanning) is met in substance
by `gitleaks` as a CI gate, which does not depend on the plan.

Closing this needs one founder act — see [`HANDOFF.md`](HANDOFF.md) E-8.
The moment the plan allows it, apply the server-side rule and **delete the
hook**: two overlapping controls invite the belief that the weaker one is the
strong one.

## 6b. First CI run

| Job                              | Result     |
| -------------------------------- | ---------- |
| Lint, types, format, unit tests  | ✅ success |
| Build and validate HTML          | ✅ success |
| Accessibility and end-to-end     | ✅ success |
| Lighthouse (indicative only)     | ✅ success |
| Dependency audit and secret scan | ✅ success |
| Link check (`lychee`)            | ❌ → fixed |

`lychee` correctly rejected the 404 page's root-relative link to `/`: resolving
such a link against files on disk needs an explicit root directory. Fixed by
passing `--root-dir`. The failure is worth recording rather than quietly
patching — it is evidence the link gate actually works.

The CI run also **verifies the Node pin**: the workflow installs 22.23.1 from
`.nvmrc`, and every job succeeded on it. That closes the caveat in §6.

## 7. What has deliberately not been done

No deployment. No hosting account. No vendor account of any kind, including free
tiers. No DNS or registrar change. No production configuration. No secret
created, requested, stored, or transmitted. No analytics. No bot-mitigation
widget, key, or CSP entry. No storage of any kind. No email sent. No personal
data collected or collectable. No public URL. No second repository. No
governance change.

## 8. Outstanding — carried to the next assignment

1. **Six manual accessibility checks remain outstanding** — A11Y-12, M-1, M-2
   (no screen reader available), M-3 (no real High Contrast), M-4, M-5 (no real
   devices). The other 15 are discharged and automated. The instrument for four
   of the six is
   [`docs/reviews/nvda-checklist.md`](docs/reviews/nvda-checklist.md).
2. Two provisional strings need founder ratification — GAP-01, GAP-02.
3. Branch-protection status on the remote — see `HANDOFF.md`.
4. Security response headers (`08` §9.2) cannot be configured without a host.
5. **Firefox does not run on the Windows development machine** (Win32
   side-by-side activation failure, fully diagnosed). Gecko evidence comes from
   CI on Linux. See `docs/reviews/known-limitations.md` L-11.

Everything this release candidate does **not** prove is enumerated in
[`docs/reviews/known-limitations.md`](docs/reviews/known-limitations.md).

Detail and required founder acts: [`HANDOFF.md`](HANDOFF.md).

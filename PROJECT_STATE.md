# PROJECT_STATE

**Repository:** `aiworkspace-hq-web`
**Implementation version:** `0.1.0`
**Specification version implemented:** P0 v1.1.1 (`00`–`12`, `DECISION_LOG.md`)
**Authorization operated under:** AG-1 + AG-2-S, scope-limited (`AWHQ-AUT-P1F` v1.0 §7)
**Last updated:** 2026-07-26

This file records what is actually true of this repository. Where it disagrees
with any planning document, this file is wrong and should be corrected — the
running system is the authority on reality, not the other way round.

---

## 1. Lifecycle state

| #   | State       | Status                                                     |
| --- | ----------- | ---------------------------------------------------------- |
| 1   | Proposed    | passed                                                     |
| 2   | Authorized  | passed                                                     |
| 3   | Initialized | passed                                                     |
| 4   | **Active**  | **current** — first assignment complete, no release tagged |
| 5   | Maintained  | not reached                                                |
| 6   | Archived    | not reached                                                |

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

| Route                       | File                    | Status                                            |
| --------------------------- | ----------------------- | ------------------------------------------------- |
| `/`                         | `src/pages/index.astro` | Built — header, hero, principles, footer landmark |
| `/404`                      | `src/pages/404.astro`   | Built                                             |
| `/privacy`                  | —                       | **Not built.** Open Item A; P-11                  |
| `/robots.txt`               | —                       | **Not built.** P-14                               |
| `/sitemap.xml`              | —                       | **Not built.** P-14                               |
| `/.well-known/security.txt` | —                       | **Not built.** Open Item C; P-13                  |
| `/api/interest`             | —                       | **Not built.** MF-1                               |
| `/api/form-token`           | —                       | **Not built.** MF-1                               |

### Blocks on `/`, against `03` §2

| #   | Block          | Status                                                                   |
| --- | -------------- | ------------------------------------------------------------------------ |
| 0   | Skip link      | Built. Text is **provisional** — GAP-01                                  |
| 1   | Header         | Built                                                                    |
| 2   | Hero           | Built **without the primary CTA** — its target does not exist            |
| 3   | Principles     | Built, all five, in order                                                |
| 4   | Early interest | **Not built.** Forms excluded from the assignment                        |
| 5   | Footer         | Landmark built; **all four content lines blocked** on Open Items B and C |

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

## 7. What has deliberately not been done

No deployment. No hosting account. No vendor account of any kind, including free
tiers. No DNS or registrar change. No production configuration. No secret
created, requested, stored, or transmitted. No analytics. No bot-mitigation
widget, key, or CSP entry. No storage of any kind. No email sent. No personal
data collected or collectable. No public URL. No second repository. No
governance change.

## 8. Outstanding — carried to the next assignment

1. Two provisional strings need founder ratification — GAP-01, GAP-02.
2. All manual accessibility checks A11Y-02…A11Y-12 are outstanding.
3. Branch-protection status on the remote — see `HANDOFF.md`.
4. Security response headers (`08` §9.2) cannot be configured without a host.

Detail and required founder acts: [`HANDOFF.md`](HANDOFF.md).

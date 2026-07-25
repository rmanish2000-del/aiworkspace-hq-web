# ADR-0001 — Technology stack in force

**Status:** Accepted (records a founder decision; does not make one)
**Date:** 2026-07-25
**Applies to:** `aiworkspace-hq-web` only

---

## Context

P1-A §8.2 requires a decision record for every technology selection **before any
code depends on it**. The selections themselves were evaluated in `AWHQ-TDR-P1B`
v1.0 and signed by the founder as condition C-1 of `AWHQ-AUT-P1F` §11 — six of
the thirteen rows, deliberately, and not the other seven.

This record is not a decision. It states which decisions this repository
actually depends on, so that the dependency is visible from inside the code
rather than only from the governance chain.

## Decision

The repository depends on exactly these six signed rows and nothing else.

| TDR | Component                            | Selection                                                                                                                   | Reversal cost                           |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 01  | Site framework                       | Astro 7, static output                                                                                                      | Low                                     |
| 02  | Language / runtime / package manager | TypeScript strict; Node 22.14.0 pinned; npm with committed lockfile                                                         | High (language) / Low (package manager) |
| 04  | Repository host + CI                 | GitHub + GitHub Actions                                                                                                     | Low                                     |
| 11  | DNS posture                          | Registrar DNS, records only, no nameserver delegation                                                                       | Trivial                                 |
| 12  | Test / quality toolchain             | ESLint, Prettier, `tsc`, `html-validate`, `lychee`, axe-core via Playwright, Lighthouse CI, Vitest, `npm audit`, `gitleaks` | Trivial per tool                        |
| 13  | Web fonts                            | None. System font stack                                                                                                     | Trivial                                 |

TDR-11 is signed but **not exercised**: no DNS record has been created, changed,
or inspected.

## The load-bearing property

These six are exactly and completely the technology set a local, non-deployed,
storage-free static build requires. The seven unsigned rows — hosting, store,
KV, email, bot mitigation, analytics, monitoring — are precisely the components
this scope excludes.

That is not a coincidence to be exploited; it is the natural boundary of the
work. **The safe-development boundary is: work whose every technology dependency
is already decided.** Anything needing an undecided vendor is, by definition,
outside it.

## Consequences

- Adding any dependency that reaches a browser, or any dependency belonging to
  an unsigned row, is out of scope and requires a new decision under P1-A §8.
- `astro.config.mjs` declares `integrations: []` deliberately. An integration is
  a technology decision, not a convenience.
- Node's LTS cadence imposes roughly one runtime upgrade a year. The pin must
  move to a version the eventual host supports **and will continue to support** —
  which is not knowable until TDR-03 is signed.
- A green CI run does **not** discharge the manual accessibility obligations
  A11Y-02…A11Y-12. This is TDR-12's recorded condition. See
  [`../reviews/manual-accessibility-checks.md`](../reviews/manual-accessibility-checks.md).

## Review triggers

- Open Item D closes → the remaining seven rows become available; re-read this
  record before building anything that depends on one.
- A framework major version that breaks zero-JavaScript-by-default output.
- Node LTS end-of-life, or a host runtime deprecation notice.
- CI minute exhaustion on a private repository.

## Deviations from the specified toolchain, and why

| Item                     | `08` §14 expectation | Here                         | Reason                                                                                                                               |
| ------------------------ | -------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `lychee`                 | Link check           | Runs `--offline`             | The site is not deployed and must make no outbound request (P-02, P-09). Internal links and fragments only.                          |
| Lighthouse CI            | Performance budgets  | Runs against the local build | `08` §8 measures the deployed production URL. Local results are indicative, never Gate B evidence (P1-F §7.2).                       |
| Post-deploy header check | `08` §9.2 headers    | Absent                       | There is no deployment and no host on which to set a header.                                                                         |
| CodeQL                   | Not in `08` §14      | Added                        | Required by the current assignment. Additive: blocks nothing `08` §14 does not, adds no runtime dependency, and handles source only. |

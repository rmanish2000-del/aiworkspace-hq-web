# Specifications — pointers, not copies

Accepted specifications are cited by document ID and version. They are **not**
copied into this repository (P1-A §3.5). A copy would drift, and a drifted copy
of a specification is worse than no copy at all.

## Canonical source-of-truth map

Per P1-A §6.1. Exactly one canonical source per class; anything else holding
that information is a copy, and a copy is corrected to match the canon.

| Information class                                          | Canonical source                                   | Not canonical           |
| ---------------------------------------------------------- | -------------------------------------------------- | ----------------------- |
| Platform architecture, orchestration, governance internals | AI Workspace specifications                        | Anything here           |
| Public positioning and category                            | P0 `01-public-positioning.md`                      | Site copy               |
| Approved terminology and prohibited claims                 | P0 `02-approved-terminology-and-claims.md`         | Anyone's memory         |
| Every visible public string                                | P0 `04-final-public-copy.md`                       | Templates, components   |
| Information architecture                                   | P0 `03-page-information-architecture.md`           | The implemented routes  |
| Form and data workflow                                     | P0 `05-form-and-data-workflow.md`                  | The database            |
| Privacy commitments                                        | P0 `06-privacy-notice.md` _(pending legal review)_ | The published page      |
| Visual and interaction rules                               | P0 `07-visual-and-interaction-spec.md`             | The stylesheet          |
| Technical requirements                                     | P0 `08-technical-requirements.md`                  | The build configuration |
| Deployment and DNS procedure                               | P0 `09-domain-and-deployment-checklist.md`         | The host dashboard      |
| Measurement                                                | P0 `10-measurement-and-monitoring.md`              | The analytics console   |
| Acceptance                                                 | P0 `12-acceptance-checklist.md`                    | —                       |
| **What is actually built, tested, and live**               | **This repository, CI, tests, logs**               | Any document            |

That last row is the direction of the evidence rule: for _specification_,
documents win; for _reality_, the running system wins.

## Package in force

**P0 v1.1.1** — documents `00` through `12` plus `DECISION_LOG.md`.

## Where each specification lands in this repository

| Specification       | Implemented by                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `02` §1.3, §3       | `tests/unit/copy.test.ts` — the prohibited-term gate                                                  |
| `03` §2, §3         | `src/pages/index.astro`, `src/components/`                                                            |
| `03` §4, §5         | `tests/e2e/structure.spec.ts` — outline and landmark map                                              |
| `04` (all)          | `src/content/copy.ts` — verbatim, single source                                                       |
| `07` §2, §3, §4     | `src/styles/tokens.css`                                                                               |
| `07` §1, §5–§12     | `src/styles/global.css`                                                                               |
| `08` ARCH-_, HTML-_ | `astro.config.mjs`, `src/layouts/Base.astro`                                                          |
| `08` §6 A11Y-01     | `tests/e2e/a11y.spec.ts`                                                                              |
| `08` §6 A11Y-02…12  | **Manual** — [`../reviews/manual-accessibility-checks.md`](../reviews/manual-accessibility-checks.md) |
| `08` §7 SEO-\*      | `src/layouts/Base.astro`, `tests/e2e/metadata-and-boundary.spec.ts`                                   |
| `08` §8             | `lighthouserc.json` — _indicative locally, see ADR-0001_                                              |
| `08` §10            | `.env.example`                                                                                        |
| `08` §14            | `.github/workflows/ci.yml`                                                                            |

## Specifications deliberately not implemented yet

`05` (form and data workflow), `06` (privacy notice), `09` (domain and
deployment), `10` (measurement) — every one of them describes a component
excluded from the current authorized scope. See
[`../../PROJECT_STATE.md`](../../PROJECT_STATE.md) §4.

# ADR-0003 — The interest form has no submission path

**Status:** Accepted
**Date:** 2026-07-26
**Supersedes:** [ADR-0002](ADR-0002-scope-deviations.md) D-1 and D-2

---

## Context

`03` Block 4 is the interest form. Building it collects personal data, and
collecting personal data engages Open Item A (legal review of the privacy
notice) and Open Item B (the entity that would be the controller). Both are
open.

The page nevertheless needs the block: it is the only conversion path on the
page, and the hero call to action targets it.

## Decision

**Build Block 4 as markup and styling, with no submission path in existence.**

Inertness is a structural property of the component, not a behaviour it chooses
at runtime:

| Mechanism                              | Effect                                                                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| No `action` attribute                  | Nothing to submit to, and no endpoint exists to point one at                                        |
| `method="dialog"` outside a `<dialog>` | The HTML form submission algorithm returns immediately, so click and implicit submission both no-op |
| Zero client JavaScript                 | No fetch, no cookie, no `localStorage`, no `sessionStorage`, no in-memory state                     |
| Nothing persisted                      | Values die with the page                                                                            |

The submit control is a real `type="submit"`, because a form whose only control
cannot submit it is not operable the way a screen-reader user expects
(WCAG H32). Accessibility and inertness are not in tension here: `method="dialog"`
already makes submission a no-op, so the control can announce and behave
correctly while doing nothing.

## Consequences

- **No personal data can be collected, even by accident.** That property is what
  keeps Open Items A and B untouched while the page exists.
- The document outline matches `03` §4 exactly, including the trailing
  `h2 Register interest`. ADR-0002 D-1 and D-2 are superseded.
- ADR-0002 D-3 (empty footer) and D-4 (provisional strings) still stand.
- Inertness that rests on a browser honouring `method="dialog"` is a claim that
  must be tested, not asserted. `tests/e2e/form-inert.spec.ts` drives the form
  as a person would and fails CI on any navigation, network request, cookie, or
  stored value.

## Review trigger

**Any work that gives this form a submission path voids this record.** A
submission path means an endpoint, a store, a validation route, and a processor
— which is a different authorization (full AG-2), not an extension of this one.

Implementation detail, temporary omissions, and open ratification items are
**not** recorded here. They live in
[`../reviews/implementation-notes.md`](../reviews/implementation-notes.md),
because they change on a different clock from this decision.

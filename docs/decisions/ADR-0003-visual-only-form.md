# ADR-0003 — The visual-only form, and what it deliberately omits

**Status:** Accepted — **two items need founder ratification**
**Date:** 2026-07-26
**Assignment:** P1-H
**Relates to:** [ADR-0002](ADR-0002-scope-deviations.md), which recorded the
opposite decision under P1-G. D-1 and D-2 there are now superseded.

---

## Context

P1-G excluded forms outright, so `03` Block 4 was not built and the hero CTA was
omitted with it. P1-H asks for the form, **visual only**: no submit, no API, no
storage, no fetch, no cookie, no `localStorage`, no `sessionStorage`.

That reopens Block 4 and, with it, `#interest` — so the hero CTA returns too.

## Decision

Build Block 4 as markup and styling with **no submission path in existence**.

### How inertness is guaranteed

Not by convention. By construction, in four independent ways:

| Mechanism                              | Effect                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| No `action` attribute                  | Nothing to submit to; no endpoint exists                                                                                           |
| `method="dialog"` outside a `<dialog>` | Per the HTML standard the form submission algorithm returns immediately. Click **and** implicit submission (Enter) both do nothing |
| Zero client JavaScript                 | No fetch, no cookie, no storage, no in-memory state                                                                                |
| Nothing persisted                      | Values die with the page; a reload clears the form                                                                                 |

`tests/e2e/form-inert.spec.ts` drives the form as a person would and asserts no
navigation and no network request on both paths, plus zero cookies and zero
storage after a full completion and a reload.

### The submit button is a real `type="submit"`

An earlier revision used `type="button"` to guarantee inertness. That failed
`html-validate`'s `wcag/h32` rule — a form must have a submit button — and
`08` HTML-01 requires zero validator errors.

The rule is right: a form whose only control cannot submit it is not operable
the way a screen-reader user expects. Because `method="dialog"` already makes
submission a no-op, accessibility and inertness are not in tension. The control
announces and behaves as the form's submit button; submitting does nothing.

The risk this trades into is browser-dependent: if a browser ignored
`method="dialog"`, a submit with no `action` would GET the current URL with the
field values in the query string. That is precisely why the no-navigation
assertions exist in CI rather than a comment claiming safety.

## What is deliberately omitted, and why

| Omitted                        | Specified in     | Reason                                                                                                                                                                                        |
| ------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Honeypot field                 | `03` §3, `05` §5 | It exists to be **read** by the endpoint. With no endpoint it is decoration, and decoration shaped like a security control is worse than none.                                                |
| Live character counter         | `04` §5.1        | The string is the runtime placeholder `%n% of 1000 characters`. A live counter needs JavaScript; rendering the literal would leak a placeholder. `maxlength="1000"` still enforces the limit. |
| Success and error states       | `04` §5.5, §5.6  | Each needs a submission that cannot happen. The success body also carries `{{PRIVACY_EMAIL}}`, blocked on Open Item C.                                                                        |
| Client-side validation         | `07` §10         | Would need JavaScript. Native `required` and `maxlength` are present and cost nothing.                                                                                                        |
| CTA moving focus into the form | `07` §7          | Needs JavaScript. The anchor targets the section, so a keyboard user lands on the heading and reaches the email field with one more Tab. One step short of specified.                         |

The `role="status"` live region **is** present and empty, because `07` §7
requires it in the DOM from first render — regions injected at update time are
unreliably announced.

## Two items needing ratification

### R-1 · "Read the privacy notice" is rendered as text, not a link

`04` §5.4 makes that phrase a link to `/privacy`. `/privacy` is not built
(P-11, Open Item A), so a link would be broken — the failure the `lychee` gate
exists to catch, and one it _did_ catch in the P1-G CI run.

The whole micro-notice sentence is rendered **verbatim**, including that phrase.
Only the anchor is absent. No approved string is edited. This follows the
precedent AWHQ-AUT-P1F §9.2 sets: where a destination is out of scope, the link
and the destination are omitted together.

The sentence still reads as an instruction to do something the reader cannot do.
That is a real wart, and the alternatives are worse: editing the string breaches
P-10, and dropping the sentence would remove binding commitments C-12, C-13 and
C-14 from the page.

**Required act:** confirm, or authorise `/privacy` so the link can be restored.

### R-2 · `autocapitalize="none"` is omitted from the email field

`07` §9 specifies it. `html-validate` rejects the attribute on
`<input type="email">`, and `08` HTML-01 requires zero validator errors.

Nothing is lost: `type="email"` already suppresses autocapitalisation on every
mobile keyboard, so the attribute was redundant as well as invalid.

**Required act:** confirm, and correct `07` §9 if it should not have specified it.

## Consequences

- The document outline now matches `03` §4 **exactly**, including the trailing
  `h2 Register interest`. ADR-0002 D-1 and D-2 are superseded.
- ADR-0002 D-3 (empty footer) and D-4 (provisional strings) still stand.
- No personal data can be collected even by accident. That property is what
  keeps Open Items A and B untouched, and it must survive any future change to
  this component — if a submission path appears, this ADR is void and the work
  needs a new authorization.

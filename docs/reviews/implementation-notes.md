# Implementation notes

Transient detail: what was left out of the current build, why, and what is
waiting on a decision.

**This file is expected to shrink.** Everything in it is temporary by
construction — an omission pending a later phase, or a question pending an
answer. Anything here that turns out to be permanent belongs in
[`../decisions/`](../decisions/) as a decision record instead.

Moved out of `ADR-0003` on 2026-07-26, under P1-H.1, so that the decision
records hold long-term architectural decisions only.

**Last updated:** 2026-07-26 · **Applies to:** `0.2.0`

---

## 1. Open — needs a founder decision

### R-1 · "Read the privacy notice" renders as text, not a link

**Component:** `src/components/InterestForm.astro` · **Since:** P1-H

`04` §5.4 makes that phrase a link to `/privacy`. `/privacy` is not built
(P-11, Open Item A), so the link would be broken — the failure the `lychee` gate
exists to catch, and one it did catch during the P1-G CI run.

The whole micro-notice sentence renders **verbatim**, including that phrase.
Only the anchor is absent, so no approved string is edited. This follows the
precedent AWHQ-AUT-P1F §9.2 sets: where a destination is out of scope, the link
and the destination are omitted together.

It remains a wart — the sentence tells the reader to do something they cannot
do. The alternatives are worse: editing the string breaches P-10, and dropping
the sentence would remove binding commitments C-12, C-13 and C-14 from the page.

**Resolves when:** `/privacy` is authorized, or the founder confirms the interim
state.

### R-2 · `autocapitalize="none"` omitted from the email field

**Component:** `src/components/InterestForm.astro` · **Since:** P1-H

`07` §9 specifies it. `html-validate` rejects the attribute on
`<input type="email">`, and `08` HTML-01 requires zero validator errors.

Nothing is lost: `type="email"` already suppresses autocapitalisation on every
mobile keyboard, so the attribute was redundant as well as invalid.

**Resolves when:** the founder confirms, and `07` §9 is corrected if it should
not have specified it.

---

## 2. Deliberately omitted from the form, pending a later phase

Each of these is specified, and each needs something the current scope excludes.

| Omitted                        | Specified in     | Why it cannot be built yet                                                                                                                                                    |
| ------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Honeypot field                 | `03` §3, `05` §5 | It exists to be **read** by the endpoint. With no endpoint it is decoration, and decoration shaped like a security control is worse than none.                                |
| Live character counter         | `04` §5.1        | The string is the runtime placeholder `%n% of 1000 characters`; a live counter needs JavaScript, and rendering the literal would leak a placeholder. `maxlength` still holds. |
| Success and error states       | `04` §5.5, §5.6  | Each needs a submission that cannot happen. The success body also carries `{{PRIVACY_EMAIL}}`, blocked on Open Item C.                                                        |
| Client-side validation         | `07` §10         | Needs JavaScript. Native `required` and `maxlength` are present and cost nothing.                                                                                             |
| CTA moving focus into the form | `07` §7          | Needs JavaScript. The anchor targets the section, so a keyboard user lands on the heading and reaches the email field with one more Tab.                                      |

The `role="status"` live region **is** present and empty, because `07` §7
requires it in the DOM from first render — regions injected at update time are
unreliably announced.

---

## 3. Resolved — kept for the reasoning

### The submit control was briefly `type="button"`

**Resolved:** P1-H, before merge.

The first revision used `type="button"` to guarantee the form could not submit.
That failed `html-validate`'s `wcag/h32` rule — a form must have a submit
button.

The rule is right. A form whose only control cannot submit it is not operable
the way a screen-reader user expects, and `08` HTML-01 requires zero validator
errors. Because `method="dialog"` already makes submission a no-op, the two
requirements were never actually in tension.

The residual risk is browser-dependent: if a browser ignored `method="dialog"`,
a submit with no `action` would issue a GET to the current URL with the field
values in the query string. That is why the no-navigation assertions live in
CI rather than in a comment claiming safety.

### The `07` §4 hero→principles gap was missing

**Resolved:** P1-H, before merge.

`.hero` does not carry the `.section` class, so `.section + .section` never
matched it and the call to action butted straight into the next heading. The
same defect existed in the print sheet. Both now name `.hero + .section`
explicitly. Caught by looking at a screenshot, not by a test — worth noting,
because no gate covers vertical rhythm.

---

## 4. Where the other open items live

| Item                                                             | Recorded in                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Provisional strings GAP-01, GAP-02                               | [`../../HANDOFF.md`](../../HANDOFF.md) E-1                         |
| Empty footer                                                     | `HANDOFF.md` E-2, ADR-0002 D-3                                     |
| Local workspace path                                             | `HANDOFF.md` E-4                                                   |
| Accepted moderate dependency advisories                          | [`../../PROJECT_STATE.md`](../../PROJECT_STATE.md) §6              |
| Branch protection, secret scanning and code scanning unavailable | `HANDOFF.md` E-8, `PROJECT_STATE.md` §6a                           |
| Manual accessibility checks                                      | [`manual-accessibility-checks.md`](manual-accessibility-checks.md) |

# Implementation notes

Transient detail: what was left out of the current build, why, and what is
waiting on a decision.

**This file is expected to shrink.** Everything in it is temporary by
construction — an omission pending a later phase, or a question pending an
answer. Anything here that turns out to be permanent belongs in
[`../decisions/`](../decisions/) as a decision record instead.

Moved out of `ADR-0003` on 2026-07-26, under P1-H.1, so that the decision
records hold long-term architectural decisions only.

**Last updated:** 2026-07-26 · **Applies to:** `0.5.0`

---

## 1. Open — needs a founder decision

> **P1K-1, P1K-2 and P1K-3 were RATIFIED at the P1-K founder gate on
> 2026-07-26.** All three are resolved as decisions; what remains is applying
> the corresponding edits in the canonical documents, which this repository
> does not hold. See
> [`../decisions/ADR-0004-founder-gate-corrections.md`](../decisions/ADR-0004-founder-gate-corrections.md).
>
> They are kept below, marked resolved, because the implementation still looks
> the way it does _because_ of them.

### P1K-1 · `06` Part B says "This site is a single page", which is now false

> **RESOLVED — ratified.** The sentence is to be removed or replaced in `06`. Until approved replacement text exists the paragraph stays withheld; it is not edited in code, because P-10 reserves that to the specification.

**Component:** `src/pages/privacy.astro` · **Since:** P1-K

P0 `06` Part B opens: _"This site is a single page. It does not have accounts,
does not sell anything, and does not track you across the web."_

The first sentence stopped being true the moment `/platform` shipped. This is
the **identical defect** P1-J §10 caught in the `04` §11 404 string and
corrected — P1-J simply did not check `06` for the same problem.

The sentence is withheld rather than edited (P-10 forbids editing approved
copy). The rest of the paragraph is withheld with it, because the three clauses
are one string.

**Resolves when:** `06` is amended the same way `04` §11 was.

### P1K-2 · P1-J §7.3 specifies a heading outline that fails the validator

> **RESOLVED — ratified.** The implementation stands; P1-J §7.3 is corrected to `h1 -> h2`. Changing the headings back would now be a regression, not a correction.

**Component:** `src/pages/principles.astro` · **Since:** P1-K

P1-J §7.3 specifies `h1 → h3 ×5 → h2` for `/principles`. That skips a level,
which fails `08` HTML-03, fails `08` HTML-01 (`html-validate` rejects it), and
is a WCAG 1.3.1 problem — a screen-reader user hears a level-3 heading with no
level-2 parent.

P1-A §6.1 puts P0 above P1-J, so the principles render as **h2** here. The
strings are unchanged and still resolve from the one shared copy entry; only
the element differs, and it differs correctly: on `/` the principles sit under
the h2 "How we are building it", so they are h3; on `/principles` that string
IS the h1, so they are its direct children.

**Resolves when:** P1-J §7.3 is corrected to `h1 → h2 ×5 → h2`.

### P1K-3 · The P0 v2.0 amendment could not be verified

> **RESOLVED — ratified.** Recorded as one decision: "P1-J supersedes the original P0 single-page information architecture for Phase 1 implementation." No historical rewrite required.

P1-J §2.2 states that `/platform` and `/contact` are named in `03` §1 as "not
created at P0", that DEC-008 forbids a navigation menu, and that the `04` §11
404 string must change — and concludes that **a P0 v2.0 amendment must be
approved before the first route commit** (§15, Governance).

The assignment supplied P1-J as approved and directed implementation, so the
build proceeded on that basis. Whether the P0 amendment was formally recorded
is not something this repository can verify.

**Resolves when:** the amendment is recorded, or the founder confirms P1-J's
approval subsumes it.

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

### P1-L: the ignore file written to silence gitleaks tripped gitleaks

**Resolved:** P1-K, before merge — recorded because the shape recurs.

Three `generic-api-key` findings were a field literally named `key`. Renaming
it to `path` fixed the tree, but gitleaks scans HISTORY, so the finding
survived in the superseded commit. A `.gitleaksignore` was added — and it
quoted the offending lines verbatim so a reader could see what was ignored,
which tripped the same rule on the ignore file itself.

The branch history was collapsed instead, so neither commit exists and no
ignore file is needed. **Rewriting unmerged history is cheaper than carrying a
permanent exception**, and a stale ignore file is how a real finding eventually
gets ignored.

### The `Link` component put whitespace inside its anchor

**Resolved:** P1-K, before merge.

`Link.astro` formatted its slot across lines, so every inline use rendered with
a leading and trailing space inside the `<a>`. On `/contact` that showed as
"register interest ." — a space before the period, underlined.

Fixed by keeping the slot flush against the tags. Caught by looking at a
screenshot; a regression test now asserts it.

### Internal template comments were shipping to the browser

**Resolved:** P1-K, before merge.

HTML comments in `.astro` templates render into the output. Several documented
_why_ a placeholder was withheld — and named the placeholder, so
`{{LEGAL_ENTITY_NAME}}` and three others reached `/privacy` inside comments.
That is exactly what `04`'s header note forbids.

Every template comment is now an Astro `{/* */}` comment, which is stripped at
build. Zero HTML comments ship. The placeholder test caught this.

### The `07` §4 hero→principles gap was missing

**Resolved:** P1-H, before merge.

`.hero` does not carry the `.section` class, so `.section + .section` never
matched it and the call to action butted straight into the next heading. The
same defect existed in the print sheet. Both now name `.hero + .section`
explicitly. Caught by looking at a screenshot, not by a test — worth noting,
because no gate covers vertical rhythm.

---

## 3a. Withheld content — Phase 1

Approved strings this build holds but does not render. Each would otherwise put
a `{{...}}` placeholder in front of a reader, which `04`'s header note and
P1-J §8.4/§9 both forbid — and editing the string to remove the placeholder is
forbidden by P-10. The full list with reasons is
`WITHHELD_UNTIL_UNBLOCKED` in `src/content/copy.ts`; a test asserts none of it
reaches output.

| Where          | Withheld                                            | Blocked by                                    |
| -------------- | --------------------------------------------------- | --------------------------------------------- |
| `/contact`     | Every email address; the whole "Where we are" block | Open Item C; Open Item B / P1-E B-F04         |
| `/privacy` §1  | Entire section                                      | Open Item B                                   |
| `/privacy` §2  | Visit-measurement and bot-check paragraphs          | No analytics (P-06), no bot mitigation (P-08) |
| `/privacy` §4  | The aggregate-measurement sentence                  | No analytics exists                           |
| `/privacy` §6  | The four-item processor list                        | Open Item D — processor set not fixed         |
| `/privacy` §7  | Entire body                                         | `06` §7: "must not be published in this form" |
| `/privacy` §8  | The address to email                                | Open Item C                                   |
| `/privacy` §12 | Entire section                                      | Open Items B and C                            |
| Footer         | Entity line, contact email, copyright               | Open Items B and C; P-12                      |

All twelve `/privacy` headings still render, per P1-J §9 — a heading with a
withheld body tells the reader the section exists and tells a reviewer exactly
what is missing.

## 4. Where the other open items live

| Item                                                             | Recorded in                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Provisional strings GAP-01, GAP-02                               | [`../../HANDOFF.md`](../../HANDOFF.md) E-1                         |
| Empty footer                                                     | `HANDOFF.md` E-2, ADR-0002 D-3                                     |
| Local workspace path                                             | `HANDOFF.md` E-4                                                   |
| Accepted moderate dependency advisories                          | [`../../PROJECT_STATE.md`](../../PROJECT_STATE.md) §6              |
| Branch protection, secret scanning and code scanning unavailable | `HANDOFF.md` E-8, `PROJECT_STATE.md` §6a                           |
| Manual accessibility checks                                      | [`manual-accessibility-checks.md`](manual-accessibility-checks.md) |

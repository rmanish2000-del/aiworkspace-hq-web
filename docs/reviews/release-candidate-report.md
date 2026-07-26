# Release candidate report — P1-M

**Assignment:** P1-M — Manual Accessibility and Release-Candidate Hardening.
**Branch:** `feature/p1-m`, based on `79a2648`.
**Nothing is deployed.** This report describes a verified candidate, not a
release, and it authorizes no deployment.

---

## Verdict

The site is a **release candidate with six outstanding manual checks.** The one
decision that needed a founder call — CONTACT-1 — has been confirmed.

|                           |                                                               |
| ------------------------- | ------------------------------------------------------------- |
| Automated gates           | `npm run verify:release` — **27 gates, 0 failed**             |
| Browser matrix            | Chromium and WebKit pass locally; Firefox via CI (Linux)      |
| Manual accessibility      | 15 of 21 discharged; **6 outstanding**, none of them silently |
| Site defects found        | **6**, all fixed                                              |
| Harness defects found     | **12**, all fixed                                             |
| Founder decisions         | CONTACT-1 **confirmed**                                       |
| Client JavaScript shipped | 0 bytes                                                       |
| Deployment performed      | none                                                          |

**It is not ready to publish.** `/privacy` cannot be published while legal
placeholders are withheld, and six manual accessibility checks are outstanding.
Those are recorded in `known-limitations.md`, not glossed.

---

## CONTACT-1 — confirmed by the founder

### Two `/contact` sections are no longer rendered

**What was found.** `/contact` shipped two `<h2>` headings — **"General
enquiries"** and **"Where we are"** — with completely empty bodies. Their entire
content is withheld placeholders: `{{PRIVACY_EMAIL}}` for the first,
`{{LEGAL_ENTITY_NAME}}` and `{{REGISTERED_ADDRESS}}` for the second. On screen
that is a heading followed by a gap. To a screen reader it is a heading
announced into silence, which reads as a broken page.

**What was changed.** Both sections are no longer rendered. Neither heading is
edited or removed from the copy module — `contact.generalHeading` and
`contact.locationHeading` are untouched — and both sections return unchanged the
moment Open Items B and C resolve.

**Why this reading.** P1-J §8.1 already states the principle: _"A contact page
that publishes a non-existent address is worse than no contact page."_ A section
that announces a contact route and then supplies none is the same failure one
step removed. The withholding pattern approved in P1-K holds a
placeholder-bearing string verbatim and does not render it; a section existing
only to present such a string falls under the same rule. Rendering its heading
alone applied the pattern halfway.

**Founder decision, P1-M continuation:** _"I approve CONTACT-1: hide the two
`/contact` sections whose actual content is unavailable, rather than render empty
headings. That is the correct accessibility and content-integrity decision. The
`/privacy` headings may remain because the page is explicitly non-publishable and
its structure is frozen for legal completion."_

**Why `/privacy` was NOT changed the same way.** `/privacy` has the same
condition — "Who we are" and "Where your information is held" render empty — but
P1-J §9 **requires** all twelve `h2`s in P0 order, and `06` §7 says the page must
not be published in this form, so no reader is exposed to it. The two situations
differ and were not collapsed. A test freezes the privacy set at exactly those
two, so a third emptying out fails the build.

---

## Site defects found and fixed

| ID            | Defect                                                                                                                                                                                                                                                                                                       | Fix                                                                                                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A11Y-09-1** | The wordmark link measured 104 × 20 — as a standalone control the SC 2.5.8 inline exception does not cover it, so it was 4px under the AA minimum.                                                                                                                                                           | `min-height: 44px` + `inline-flex` in `Logo.astro`, matching `.site-nav__link`. In the centred flex row the two agree, so header height is unchanged. Home is unaffected — there the wordmark is a `<p>`.                                                                       |
| **A11Y-09-2** | Three standalone text links measured 21px tall (`/contact` privacy link, `/privacy` back link, `/` footer link), each alone in its own paragraph where the inline exception is arguable at best.                                                                                                             | `padding-block: 2px` in `Link.astro`. Vertical padding on a non-replaced inline element does not affect line-box height, so the hit box grows to ≥25px with **no layout change and no visual change**.                                                                          |
| **A11Y-09-3** | The A11Y-09-2 fix above was calibrated on Windows font metrics (21px line box + 2px each side = 25px). CI on Linux renders the same text at 18-19px, so the identical rule landed at **22-23px** — still under the 24px minimum. Every engine failed on `/contact` and `/privacy`.                           | `padding-block` raised from 2px to 4px: 26-29px on both platforms, and holds for any font whose line box is at least 16px. Still no layout and no visual change. **Only CI on Linux could have caught this** — a target-size fix measured on one platform's fonts is not a fix. |
| **CONTACT-1** | `/contact` rendered two headings with empty bodies.                                                                                                                                                                                                                                                          | Sections withheld rather than rendered headless. Frozen by a regression test that runs on every route. See above.                                                                                                                                                               |
| **ASSET-1**   | `public/og-image.svg` carried a 24-line internal governance comment — quoting P-15 including the `™` and `®` characters — and `public/` ships verbatim, so it was served publicly. It also still described the card as "PLACEHOLDER, pending ratification" after the founder approved it in the P1-L review. | Comment removed; the rationale and the founder's decision moved to `docs/public-assets.md`. The release check that flags `™`/`®` in the card now tests only rendered content, and passes honestly.                                                                              |
| **DOC-1**     | `docs/public-assets.md` listed `favicon.ico`, `apple-touch-icon.png`, `og-image.png`, `robots.txt` and `sitemap.xml` as "still absent, each with a reason" — all five had shipped in P1-L.                                                                                                                   | Rewritten to describe what is actually present, including that `robots.txt` and `sitemap.xml` are build-time generated from `IS_INDEXABLE` rather than stored files.                                                                                                            |

## Harness defects found and fixed

These were faults in the new verification code, not in the site. They are listed
because a test that reports the wrong thing is worse than no test — several of
these would have produced confident, wrong evidence.

| ID   | Defect                                                                                                                                                                                                                                                                                                                                                                 | Fix                                                                                                                                                                                                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H-1  | A11Y-02 identified focused elements by class name. Three nav links share one class, so the "each element visited once" check reported a keyboard trap that did not exist.                                                                                                                                                                                              | Stamp each focusable with its DOM index and assert the visited sequence equals `[0…n-1]`.                                                                                                                                                                                                                               |
| H-2  | A11Y-03 compared the focus ring against the control's own fill unconditionally, flagging the skip link at 1:1. The ring sits on a 2px gap of page background, so the comparison was wrong.                                                                                                                                                                             | Offset-aware: compare against page background, and against the control's fill only when `outline-offset` is 0.                                                                                                                                                                                                          |
| H-3  | A11Y-09 applied the 44px bar to text links in prose, where a 44px inline box would overlap adjacent lines.                                                                                                                                                                                                                                                             | 24px SC 2.5.8 minimum for everything (with the inline exception); 44px only for controls that are not inline-flowed.                                                                                                                                                                                                    |
| H-4  | A11Y-09 measured the consent checkbox as its 24px box. Clicking its label toggles it, so the real target is larger.                                                                                                                                                                                                                                                    | Measure the union of the box and its associated label.                                                                                                                                                                                                                                                                  |
| H-5  | M-8 compared strings truncated to 40 characters against full copy strings, so it could never match.                                                                                                                                                                                                                                                                    | Stop truncating.                                                                                                                                                                                                                                                                                                        |
| H-6  | The accessibility-tree tests used `page.accessibility`, removed from Playwright — every one errored with `Cannot read properties of undefined`.                                                                                                                                                                                                                        | Rewritten against `locator.ariaSnapshot()`.                                                                                                                                                                                                                                                                             |
| H-7  | The empty-heading detector fell back to the parent's text when a heading had no following siblings. On `/privacy`, where headings are direct children of the article, that returned the whole article and masked all three empty sections.                                                                                                                             | Sibling walk only.                                                                                                                                                                                                                                                                                                      |
| H-8  | A11Y-04b filtered controls by `appearance === 'none'`, which excluded every text input (they compute `auto`) and left the check asserting nothing.                                                                                                                                                                                                                     | Exclude only native checkboxes and radios, which SC 1.4.11 exempts as user-agent-controlled.                                                                                                                                                                                                                            |
| H-9  | Tab-order and `forced-colors` assertions ran in WebKit, where they measure a Safari preference and an unimplemented emulation rather than the site. 177 failures said nothing about the product.                                                                                                                                                                       | Engine-scoped with the reason in the skip message, plus replacement coverage that runs everywhere — see `known-limitations.md` L-12.                                                                                                                                                                                    |
| H-10 | CI installed only Chromium while `playwright.config.ts` declared Firefox and WebKit projects, so the new engines would have failed on first push.                                                                                                                                                                                                                      | CI installs all three.                                                                                                                                                                                                                                                                                                  |
| H-11 | Playwright's default worker count oversubscribed a 4-core / 8 GB machine with under 1 GB free, producing four failures inside `page.evaluate` that all passed on re-run in isolation.                                                                                                                                                                                  | `workers: 1` locally, 2 in CI. **Retries were deliberately not added** — they would have turned those four into a silent green and hidden the next real intermittent failure behind them.                                                                                                                               |
| H-12 | Even at one worker the suite still invented failures — `role="status"` reported absent when it is plainly in the built HTML, axe-core failing to inject at all. The set moved between runs and every one passed in isolation. WebKit averages ~16s per test on this machine, against Playwright's 30s test / 5s expect defaults.                                       | `timeout: 90_000`, `expect.timeout: 15_000`. This changes how long a check will **wait**, never what it asserts. A timeout on a thrashing machine is a false negative, and a suite that cries wolf gets ignored.                                                                                                        |
| H-13 | A11Y-06 treated any `scrollHeight > clientHeight` as clipping. An element whose `overflow` is `visible` — the default — paints outside its box and loses nothing. Once `.link` gained 4px of vertical padding, the padded inline box exceeded its paragraph's line box and Firefox reported `/contact` as clipped; Blink and WebKit did not. Nothing was ever cut off. | Only count elements whose computed `overflow` is not `visible`. Because that alone would pass vacuously on a site that sets `overflow: hidden` nowhere, the test now also asserts the failure that actually bites at 320px: no sideways document scroll and no text pushed past the viewport once spacing is forced up. |

## Environment findings — not defects

| Finding                                                                                                                                                                                          | Consequence                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Playwright's Firefox will not launch on this Windows machine (Win32 side-by-side activation failure on the `mozglue` private assembly). Fully diagnosed; a clean 120 MB reinstall reproduces it. | Gecko evidence is produced by CI on Linux. `known-limitations.md` L-11.                         |
| NVDA is not installed and cannot be driven from the harness.                                                                                                                                     | A11Y-12, M-1, M-2 remain **NOT VERIFIED**. `nvda-checklist.md` is the instrument to close them. |

---

## `npm run verify:release`

One command, no configuration, no credential, no network beyond the local
preview server, no vendor, no deployment. It runs cheapest-first so a failure
points at the smallest possible cause, and **stops at the first material
failure** rather than burying the real one under consequences.

| #   | Gate                      | Proves                                                                          |
| --- | ------------------------- | ------------------------------------------------------------------------------- |
| 1   | Node version              | the runtime satisfies `engines`; warning locally, **hard failure in CI**        |
| 2   | format                    | Prettier clean                                                                  |
| 3   | lint                      | ESLint clean, including the storage/cookie/fetch bans on page code              |
| 4   | types                     | `tsc --noEmit` under `strict` + `exactOptionalPropertyTypes`                    |
| 5   | unit tests                | copy gates, tokens, design system, production config                            |
| 6   | build                     | Astro static build                                                              |
| 7   | html validity             | `html-validate` on every built document                                         |
| 8   | build output exists       | exactly 6 route documents                                                       |
| 9   | no build-time placeholder | no `{{…}}` reaches any page                                                     |
| 10  | no `[LEGAL]` marker       | no review marker reaches any page                                               |
| 11  | no superseded copy        | the pre-P1-J 404 string appears nowhere                                         |
| 12  | no internal comment       | no `<!--` in any built document                                                 |
| 13  | no client JavaScript      | 0 script files, 0 executable `<script>`                                         |
| 14  | no web font               | 0 font files                                                                    |
| 15  | transfer budget           | every route ≤35 KB gzipped target, ≤60 KB budget                                |
| 16  | robots ↔ noindex agree    | one constant drives both; they cannot diverge                                   |
| 17  | sitemap contents          | exactly 5 URLs, no `/404`, `/docs`, `/research`                                 |
| 18  | deferred files absent     | `security.txt`, `humans.txt`, `feed.xml`, `rss.xml` not emitted                 |
| 19  | static assets             | 8 assets present, non-empty, `og-image.png` exactly 1200×630                    |
| 20  | no unapproved brand mark  | favicon carries no letterform; card embeds no raster and no `™`/`®`             |
| 21  | CSP hash matches          | the hash is recomputed from the served JSON-LD bytes and compared byte-for-byte |
| 22  | every engine launches     | each engine probed by name; **in CI a missing engine is a hard failure**        |
| 23  | browser matrix            | the full Playwright suite across every available engine                         |
| 24  | lighthouse                | local baseline, as a regression gate                                            |
| 25  | dependency audit          | clean at `high` and above                                                       |
| 26  | lockfile in step          | version agrees with `package.json`                                              |
| 27  | `.env.example` empty      | no variable carries a value                                                     |

Gate 22 is the one that keeps the three-engine requirement honest: it names any
engine that cannot start, prints the reason, and refuses to let CI pass without
all three.

## Transfer budget as built

| Route         | Gzipped |
| ------------- | ------- |
| `/404`        | 4.5 KB  |
| `/contact`    | 4.8 KB  |
| `/`           | 6.0 KB  |
| `/platform`   | 6.0 KB  |
| `/principles` | 5.3 KB  |
| `/privacy`    | 6.0 KB  |

Target is 35 KB, budget 60 KB (`08` §8). The largest route uses 17 % of the
target.

---

## What must happen before this can be published

1. **Run `nvda-checklist.md`** — closes A11Y-12, M-1, M-2 and M-3.
2. **Legal approval of the withheld entity details** — closes L-7 and returns
   the two `/contact` sections and the three `/privacy` sections.
3. **Founder ratifies the two provisional strings** — GAP-01, GAP-02 (L-8).
4. **A real device pass** — M-4, M-5, if the founder judges it needed.
5. **A second reader for M-10** — `02` §3 is non-exhaustive of phrasings, and
   the read was done by the implementing agent, not independently.

Deployment, DNS, hosting and analytics remain out of scope and untouched.

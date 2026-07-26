# Founder screen-reader checklist — NVDA on Windows

**Status:** NOT YET RUN. This is the outstanding manual step for P1-M.
**Why it is outstanding:** NVDA is not installed in the development environment
(`C:\Program Files (x86)\NVDA` absent), and no screen reader can be driven from
the automated harness. P1-M §2 requires that this be stated rather than claimed.

**What HAS been verified automatically, and what it is worth**

`tests/e2e/a11y-manual.spec.ts` asserts the **accessibility tree** on every
route in all three engines — the roles, accessible names, states and heading
levels that a screen reader consumes as its input. If the tree were wrong, NVDA
would certainly be wrong. But a correct tree does not guarantee a good spoken
experience: announcement order, verbosity, punctuation handling and how NVDA
treats the withheld privacy sections can only be heard. That gap is what this
checklist closes.

Nothing below is a formality. Two of the checks (P-4, P-7) exist because the
page contains deliberately incomplete content, and only a listener can confirm
it is not confusing.

---

## 0. Setup (about five minutes)

1. Install NVDA (free) from <https://www.nvaccess.org/download/>.
2. Build and serve the site from the repository root:

```bash
npm run build && npm run preview
```

The preview server prints a URL — expect `http://127.0.0.1:4321`. Use that
address for every step. Do **not** test against the deployed site: there isn't
one, and there must not be one during P1-M.

3. Start NVDA (`Ctrl+Alt+N`). Test in **Firefox** and **Chrome** — NVDA's
   behaviour differs between the two and both are in the supported matrix.
4. Turn on the speech viewer so you can read what was spoken:
   NVDA menu (`Insert+N`) → **Tools** → **Speech viewer**.

**Keys used below** (`Insert` is the NVDA key unless you set Caps Lock):

| Key             | Does                                         |
| --------------- | -------------------------------------------- |
| `Insert+↓`      | Read from here to the end                    |
| `H` / `Shift+H` | Next / previous heading                      |
| `1`…`6`         | Next heading at that level                   |
| `D`             | Next landmark                                |
| `K`             | Next link                                    |
| `F`             | Next form field                              |
| `Insert+F7`     | Elements list (headings / links / landmarks) |
| `Insert+Space`  | Toggle browse ↔ focus mode                   |
| `Tab`           | Next focusable control                       |

---

## 1. `/` — home

| #   | Step                          | Expected announcement                                                                                                                                                      | Pass | Notes |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----- |
| H-1 | Load the page                 | Title read as **"AI Workspace — Enterprise AI Operating Layer"**                                                                                                           | ☐    |       |
| H-2 | Press `Tab` once from the top | **"Skip to main content, link"** — and it becomes visible on screen                                                                                                        | ☐    |       |
| H-3 | Press `Enter` on it           | Focus lands in `main`; next `Tab` goes to a control inside the page body, not back to the navigation                                                                       | ☐    |       |
| H-4 | Press `D` repeatedly          | Exactly four landmarks, in this order: **banner → navigation "Main" → main → contentinfo**. No landmark is unnamed, none is announced twice                                | ☐    |       |
| H-5 | Press `H` repeatedly          | **h1** "The layer between your enterprise systems and your AI agents", then **h2** "How we are building it", then **h2** "Register interest". No level is skipped          | ☐    |       |
| H-6 | `Insert+F7` → Headings        | The same three, correctly nested                                                                                                                                           | ☐    |       |
| H-7 | Press `K` through every link  | Every link has a meaningful name. **Nothing is announced as "link" alone, as a bare URL, or with a trailing full stop** (this specific defect was found and fixed in P1-K) | ☐    |       |
| H-8 | `Insert+↓` from the top       | The whole page reads end to end with no stuck point, no repeated block, and no announcement of a `{{placeholder}}`                                                         | ☐    |       |

## 2. `/` — the interest form (the most important section)

The form is **visual only**. It has no action, no JavaScript and no submit
handler. What matters is that it does not _lie_ to a screen-reader user about
what it will do.

| #   | Step                               | Expected announcement                                                                            | Pass | Notes |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------ | ---- | ----- |
| F-1 | Press `F` to reach the first field | **"Work email, edit, required"** — the label, the role, and the required state                   | ☐    |       |
| F-2 | Stay on it                         | Any hint text below the field is read as its description, not skipped                            | ☐    |       |
| F-3 | `Tab` to the consent control       | Announced as a **checkbox**, **not checked**, with its full consent label read out               | ☐    |       |
| F-4 | Press `Space` on it                | State changes to **"checked"** and is spoken                                                     | ☐    |       |
| F-5 | Click the consent _label_ text     | The checkbox toggles (its target includes the label)                                             | ☐    |       |
| F-6 | `Tab` to the submit control        | Its name is read, and it is announced as **disabled**                                            | ☐    |       |
| F-7 | Try to activate it                 | Nothing happens. No navigation, no error, no silence-then-nothing that reads as a broken page    | ☐    |       |
| F-8 | Listen to the surrounding text     | It is clear the form is not yet accepting submissions **before** you reach the fields, not after | ☐    |       |

> **F-8 is a judgement call and yours to make.** If a screen-reader user could
> reach the email field believing it will send something, that is a defect —
> record it and it will be fixed. It cannot be settled from the DOM.

## 3. `/platform`

| #   | Step                                          | Expected announcement                                                                                                                   | Pass | Notes |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----- |
| P-1 | Load                                          | Title **"Platform — AI Workspace"**                                                                                                     | ☐    |       |
| P-2 | Press `H` through                             | **h1** "What an Enterprise AI Operating Layer is", then **h2** "The problem", "Three things it is designed to do", "What it is not"     | ☐    |       |
| P-3 | Listen to "Three things it is designed to do" | The phrase **"is designed to"** is audible and intact — it is the approved-direction marker and must not read as a completed capability | ☐    |       |
| P-4 | Listen to "What it is not"                    | The negations are unambiguous when heard rather than read. A listener must not come away with the opposite meaning                      | ☐    |       |
| P-5 | `Tab` to the wordmark in the header           | Announced as **"AI Workspace, link"**                                                                                                   | ☐    |       |
| P-6 | `D` through landmarks                         | banner → navigation "Main" → main → contentinfo                                                                                         | ☐    |       |

## 4. `/contact`

| #   | Step                        | Expected announcement                                                                                                                                                      | Pass | Notes |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ----- |
| C-1 | Load                        | Title **"Contact — AI Workspace"**                                                                                                                                         | ☐    |       |
| C-2 | Press `H` through           | **h1** "Contact", then **h2** "General enquiries", "Privacy and data requests", "Security", "Where we are"                                                                 | ☐    |       |
| C-3 | Listen to each section      | No section announces an empty body. Where an address or mailbox is withheld, the section still says something coherent — it must not read as a heading followed by silence | ☐    |       |
| C-4 | Press `K` through the links | The privacy link is announced as **"Read the privacy notice, link"**, not "read more" or a bare URL                                                                        | ☐    |       |
| C-5 | Nav announcement            | The **Contact** item in the main navigation is announced as **"current page"**                                                                                             | ☐    |       |

> **C-3 matters.** Several contact details are deliberately withheld until legal
> and mailbox approvals exist. Visually the layout absorbs this. Spoken, a
> heading with nothing after it sounds like a broken page.

## 5. `/privacy` — the withheld-content check

This page has the most placeholder-dependent content on the site. Legal entity
name, registered address and privacy mailbox are all withheld.

| #   | Step                             | Expected announcement                                                                                                                                                                                                                                                                                  | Pass | Notes |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | ----- |
| V-1 | Load                             | Title **"Privacy notice — AI Workspace"**                                                                                                                                                                                                                                                              | ☐    |       |
| V-2 | `Insert+F7` → Headings           | **h1** "Privacy notice" then twelve `h2`s: Who we are · What we collect · Cookies · Why we use it, and on what basis · How long we keep it · Who we share it with · Where your information is held · Your rights and how to use them · How we protect it · Children · Changes to this notice · Contact | ☐    |       |
| V-3 | `Insert+↓` — read the whole page | **No `{{` or `}}` is ever spoken. No "curly brace", no "LEGAL_ENTITY_NAME", no placeholder token in any form**                                                                                                                                                                                         | ☐    |       |
| V-4 | Listen to "Who we are"           | It does not name a legal entity that does not yet exist, and it does not read as an empty section                                                                                                                                                                                                      | ☐    |       |
| V-5 | Listen to "Contact"              | Same — no mailbox is announced, and the absence is not confusing                                                                                                                                                                                                                                       | ☐    |       |
| V-6 | Listen to "Cookies"              | The commitment not to use tracking cookies (C-13) is stated plainly and audibly                                                                                                                                                                                                                        | ☐    |       |
| V-7 | Press `K` to the back link       | Announced as a meaningful name, not "click here"                                                                                                                                                                                                                                                       | ☐    |       |

> **V-3 is the hard gate.** A spoken placeholder on a privacy notice is a
> governance failure, not a cosmetic one. It is already asserted automatically
> against the built HTML, but browsers and NVDA can expose text the DOM check
> does not reach (`::before` content, `aria-label`, `title`). Listening is the
> only way to be sure.

## 6. `/principles` and `/404`

| #   | Step                        | Expected announcement                                                                                                                                                          | Pass | Notes |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | ----- |
| R-1 | `/principles` → `H` through | **h1** "How we are building it", then six `h2`s ending "What this means for this site". **No level is skipped** — this hierarchy was corrected during P1-K review and ratified | ☐    |       |
| R-2 | `/404` → load               | Title **"Page not found — AI Workspace"**, **h1** "Page not found"                                                                                                             | ☐    |       |
| R-3 | `/404` → read the body      | "That page does not exist, or it has moved." A route back to the site is reachable with `K`                                                                                    | ☐    |       |

## 7. Cross-cutting

| #   | Step                                                                               | Expected                                                                                | Pass | Notes |
| --- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---- | ----- |
| X-1 | On each route, `Insert+Space` into focus mode and back                             | No control traps focus; browse mode always returns                                      | ☐    |       |
| X-2 | Windows High Contrast on (`Left Alt+Left Shift+Print Screen`), walk all six routes | All text remains visible; the focus indicator is still discernible; no element vanishes | ☐    |       |
| X-3 | Windows Magnifier at 400%, `/` and `/privacy`                                      | Reading order stays sensible; nothing is cut off                                        | ☐    |       |
| X-4 | Repeat sections 1–6 in the **other** browser                                       | Same results in Firefox and Chrome                                                      | ☐    |       |

---

## Recording the result

For each failure, note **route · check ID · what NVDA actually said · which
browser**. Verbatim speech-viewer output is far more useful than a description.

Return the completed table. Any failure becomes a P1-M defect and is fixed
within approved copy and architecture — or escalated if it cannot be.

Until this checklist comes back completed, A11Y-12, M-1 and M-2 remain
**NOT VERIFIED** in `manual-accessibility-report.md`, and the release candidate
carries that as a stated limitation rather than a pass.

# C-13 verification — evidence artifact

**Assignment:** `AWHQ-WEB-CC006` v1.0 · **Date:** 2026-08-04 · **Branch:**
`feature/cc006-c13-verification` (base commit `73e03f4`, main after CC-005
merge, PR #20)

**Commitment under test (C-13, committed public string, P0 `04` §5.4):**
"we do not use tracking cookies on this site." — classified _Verified — and
binding_. This artifact converts it from asserted to verified for the current
build, and `G-C13` in `verify:release` keeps it that way.

## Surfaces and routes

| Surface                               | Served from                              | Routes                                                                               |
| ------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Production build                      | `dist/` via `astro preview` (loopback)   | `/` · `/about` · `/contact` · `/platform` · `/principles` · `/privacy` · `/404.html` |
| Design-system gallery (DS-D1 surface) | `dist-ds/` via ephemeral loopback server | `/_ds.html`                                                                          |

## Assertions run (suite `tests/e2e/c13-verification.spec.ts`)

On every route, on load **and** after an interaction pass (navigation hover,
form fill, disclosures, mock form states, theme toggle), in light and dark
schemes, with a reduced-motion pass:

1. `document.cookie` is empty — always, on both surfaces.
2. `localStorage` is empty on the seven public routes — always; on the
   gallery it is empty **on first paint** and contains **at most the single
   key `theme`, only after the user operates the toggle** (DS-D1). The key
   persists across reload and remains the only key.
3. `sessionStorage`, `indexedDB.databases()` and `caches.keys()` are empty on
   both surfaces at all times.
4. Every network request logged; **zero third-party origins** observed.
5. **No `Set-Cookie` header** on any response from the local server.

## Results

- `G-C13` (chromium-light + chromium-dark): **20/20 passed**.
- Full browser matrix (`verify:release`): green — see the release report.
- **Seeded-failure proof:** a `document.cookie="seeded_tracker=1"` +
  `localStorage.setItem("seeded_key","1")` write injected into the built
  gallery artifact caused **2 test failures and Playwright exit code 1**,
  which `verify:release` propagates (its runner aborts on the first non-zero
  step — demonstrated live on earlier format failures). The seed was then
  removed by rebuilding; the suite returned to green.

## Cookie inventory

**Zero cookies observed on any surface, any route, any theme, any
interaction.** There is nothing to classify.

## SCOPE LIMITATION — STATE IT, DO NOT PAPER OVER IT

This verifies the **current artifact in a local environment**. It cannot
verify what a hosting platform injects at the edge or what a bot-protection
widget sets when one is integrated. Therefore the evidence artifact must
state: **re-verification is mandatory at first deployment to any host, and
again before any third-party widget ships** (HQ-12 demotion trigger D-3
applies if a cookie ever appears in production).

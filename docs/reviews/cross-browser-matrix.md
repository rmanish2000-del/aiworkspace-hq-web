# Cross-browser matrix — P1-M §3

**Method:** automated, Playwright, seven projects across three engines.
**Result:** all three engines pass. Chromium and WebKit locally on Windows;
Firefox on Linux in CI, where all three run together.

**CI evidence — run [30203208299](https://github.com/rmanish2000-del/aiworkspace-hq-web/actions/runs/30203208299), commit `22c210f`, `ubuntu-latest`:
1242 passed, 52 skipped, 0 failed** across all seven projects.

---

## Engines and projects

| Project           | Engine | Colour scheme | Viewport  | Suite                |
| ----------------- | ------ | ------------- | --------- | -------------------- |
| `chromium-light`  | Blink  | light         | Desktop   | Full                 |
| `chromium-dark`   | Blink  | dark          | Desktop   | Full                 |
| `chromium-mobile` | Blink  | default       | 320 × 640 | Full                 |
| `firefox`         | Gecko  | light         | Desktop   | Cross-browser subset |
| `firefox-dark`    | Gecko  | dark          | Desktop   | Cross-browser subset |
| `webkit`          | WebKit | light         | Desktop   | Cross-browser subset |
| `webkit-dark`     | WebKit | dark          | Desktop   | Cross-browser subset |

Chromium carries the **full** suite, including the checks that only need to pass
once — asset bytes, production files, print output. Firefox and WebKit carry the
**cross-browser subset**: `a11y`, `a11y-manual`, `structure`, `routes`,
`viewport-matrix` and `cross-browser`. Running asset-byte assertions three times
would treble CI for no signal.

## Results

| Engine    | Where                           | Result                                |
| --------- | ------------------------------- | ------------------------------------- |
| Chromium  | Local, Windows 11, 3 projects   | 648 passed, 0 skipped, **0 failed**   |
| WebKit    | Local, Windows 11, 2 projects   | 264 passed, 52 skipped, **0 failed**  |
| Firefox   | **CI only**, `ubuntu-latest`    | Passes — will not launch on Windows   |
| All three | CI, `ubuntu-latest`, 7 projects | **1242 passed, 52 skipped, 0 failed** |

### What Firefox caught that nothing else did

Firefox ran for the first time in this assignment, and CI on Linux produced two
findings no Windows run could have:

| Finding                               | Detail                                                                                                                                                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A11Y-09-3** — real site defect      | Text-link target size was fixed against Windows font metrics (21px line box). Linux renders the same text at 18–19px, so the fix landed at 22–23px and was still under the 24px minimum. Failed in **all three** engines on Linux. |
| **H-13** — harness defect, Gecko only | A11Y-06 counted any `scrollHeight > clientHeight` as clipping. With `overflow: visible` nothing is lost; Gecko reported the padded inline link's paragraph as overflowing where Blink and WebKit did not.                          |

### Firefox

Playwright's Firefox build fails to start on this machine with a Win32
side-by-side activation error on the `mozglue` private assembly, surfaced as
`browserType.launch: spawn UNKNOWN`. Fully diagnosed in `known-limitations.md`
L-11 — the DLL is present, architectures match, the VC++ redistributables are
installed, and a clean 120 MB reinstall reproduces it exactly.

CI on `ubuntu-latest` now installs all three engines
(`npx playwright install --with-deps chromium firefox webkit`) and runs this same
matrix, so **Gecko evidence is real, produced on Linux rather than Windows.**
`npm run verify:release` probes each engine before running and, in CI, treats a
missing engine as a hard failure — the three-engine requirement cannot lapse
quietly.

### WebKit's 52 skips

Not silent, not weakened — each carries its reason in the skip message, and each
has replacement coverage. See `known-limitations.md` L-12.

| Skipped                                 | Why                                                                                                                                                                                                         |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab-order assertions (A11Y-02, A11Y-03) | Safari's "Press Tab to highlight each item on a webpage" is off by default and no page can change it. WebKit tabs only between form controls, so asserting tab order there would test a browser preference. |
| `forced-colors` (A11Y-11)               | Playwright does not emulate `forced-colors: active` in WebKit. The option is accepted and does nothing, so the assertions would measure ordinary rendering and report it as high-contrast evidence.         |

**Replacement coverage that does run in WebKit:** every interactive element is
focused programmatically on every route and must actually receive focus — the
failure that would genuinely strand a keyboard user. The skip-link tests focus
the link directly in WebKit and still assert that activating it moves focus into
`#main`.

## What is checked per engine, and why it belongs there

Each of these genuinely differs between Blink, Gecko and WebKit, and this site
depends on all of them.

| Check                            | Why it is engine-sensitive                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Console / page / request errors  | A missing asset or parse error surfaces differently per engine                                                                                          |
| Dark-mode token resolution       | `prefers-color-scheme` plumbing and `color-scheme` support differ; the computed `rgb()` values are pinned rather than the media query trusted           |
| Light-mode token resolution      | same                                                                                                                                                    |
| Print stylesheet                 | `print-color-adjust` and forced backgrounds are applied differently by each engine; black-on-white and the hidden interest form are asserted per engine |
| Skip link as a real control      | focus-on-fragment and `:focus-visible` are where engines most often diverge for skip links                                                              |
| Asset references resolve         | icon, apple-touch-icon and manifest hrefs are fetched and must return 200                                                                               |
| JSON-LD present and parseable    | inline `ld+json` handling                                                                                                                               |
| Renders with JavaScript disabled | proves the document has no script dependency for `script-src 'self'` to break                                                                           |
| 404 copy and `noindex`           | the corrected P1-J §10 string, per engine                                                                                                               |
| Full accessibility tree          | roles, names, landmarks and `aria-current` are read from each engine's own tree                                                                         |
| Viewport matrix                  | 8 widths × 2 schemes × 6 routes                                                                                                                         |

## Exact expected values pinned

These are asserted as literal computed values, so a token change that alters
rendering cannot pass unnoticed:

| Context    | Property          | Expected             |
| ---------- | ----------------- | -------------------- |
| Dark mode  | `body` background | `rgb(11, 13, 14)`    |
| Dark mode  | `body` colour     | `rgb(242, 244, 245)` |
| Light mode | `body` background | `rgb(255, 255, 255)` |
| Light mode | `body` colour     | `rgb(17, 19, 21)`    |
| Print      | `body` background | `rgb(255, 255, 255)` |
| Print      | `body` colour     | `rgb(0, 0, 0)`       |

## What this does not cover

- **Real Safari and real Firefox on real machines.** Playwright ships the
  engines, not the browsers. Chrome's and Safari's own UI, extensions and
  user preferences are outside this.
- **Firefox on Windows specifically.** Gecko is covered on Linux via CI;
  Windows font rendering and Gecko's Windows focus handling are not covered
  anywhere. See `known-limitations.md` L-11.
- **Older engine versions.** One version of each, current at the time of the
  run.

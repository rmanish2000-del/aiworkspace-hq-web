# Known limitations — P1-M release candidate

Everything this release candidate does **not** prove. Each entry states the
limitation, why it exists, what was done instead, and what would close it.

Nothing here is a defect. Defects were fixed and are listed in
`release-candidate-report.md`. These are boundaries of the evidence.

---

## L-1 · No real screen reader has been run — **the largest gap**

**What is not proven.** A11Y-12, M-1 and M-2. No assistive technology has read
this site aloud.

**Why.** NVDA is not installed in the development environment
(`C:\Program Files (x86)\NVDA` absent) and no screen reader can be driven from
the automated harness. VoiceOver needs macOS, which is not available.

**What was done instead.** `tests/e2e/a11y-manual.spec.ts` asserts the
**accessibility tree** — roles, accessible names, states, `aria-current`,
landmark uniqueness and heading nesting — on all six routes in all three
engines, using each engine's own tree via `ariaSnapshot()`. A wrong tree would
guarantee a wrong screen-reader experience, so this rules out a whole class of
failure. It does not rule out announcement order, verbosity, or how the
deliberately withheld `/privacy` and `/contact` sections _sound_.

**Do not read the automated pass as a screen-reader pass.** It is not one.

**To close.** `docs/reviews/nvda-checklist.md` — 38 checks across the six
routes in Firefox and Chrome, roughly 45 minutes. Founder-run.

---

## L-2 · No real mobile device has been tested

**What is not proven.** M-4 (iPhone Safari) and M-5 (Android Chrome) on real
hardware.

**Why.** No physical device and no device-cloud service is available, and P1-M
forbids introducing vendor services.

**What was done instead.** The WebKit and Chromium engines are exercised at
device viewports (320×568 through 1920×1080, both orientations, both colour
schemes) — the same engines those browsers ship. Input font size is asserted
≥16px on every width so iOS will not auto-zoom on focus.

**What a real device would still differ on.** Touch latency and precision, the
software-keyboard viewport resize, safe-area insets on notched displays,
Android's font-size accessibility setting, and iOS Reader Mode.

**To close.** Open all six routes on one iPhone and one Android handset and walk
the viewport-matrix checks by hand.

---

## L-3 · Windows High Contrast is emulated, not real

**What is not proven.** M-3 at the operating-system level.

**Why.** The forced-colours mode cannot be toggled from the test harness.

**What was done instead.** `forced-colors: active` emulation is asserted on
every route: text stays visible, the focus indicator survives, and the
`aria-current` navigation state is carried by an underline rather than font
weight alone (weight is unreliable in forced colours).

**What differs.** Real High Contrast substitutes system colours at the OS level
and can affect elements the emulation leaves alone.

**To close.** Check X-2 in the NVDA checklist covers it.

---

## L-4 · No production headers, CSP or cache policy has been served

**What is not proven.** That the `08` §9.2 security headers, the CSP, and the
cache rules behave correctly in front of a real host.

**Why.** P1-M explicitly forbids deployment, DNS and hosting accounts. There is
no origin to serve headers from.

**What was done instead.** `src/lib/production.ts` defines all eight headers and
six cache rules as host-agnostic data with unit tests. The CSP's `sha256` hash
is recomputed from the exact bytes of the JSON-LD block in the built
`index.html` and compared byte-for-byte on every release run, so the hash cannot
silently drift from what is served. Separately, every route is loaded with
JavaScript disabled in all three engines, proving the document has no script
dependency for `script-src 'self'` to break.

**To close.** Deploy behind a host and re-run `scripts/check-headers.mjs`
against the live origin. Out of scope until deployment is authorised.

---

## L-5 · Lighthouse figures are a local baseline, not production evidence

**What is not proven.** Real-world Core Web Vitals.

**Why.** Lighthouse CI runs against `staticDistDir` on developer hardware. There
is no network, no CDN, no real client population and no field data.

**What was done instead.** Scores are recorded in
`docs/reviews/lighthouse-local-baseline.md`, labelled **Local Baseline**, and
run as a regression gate — they catch a regression, they do not certify
performance.

**To close.** Field data after deployment.

---

## L-6 · Branch protection is unavailable on the current GitHub plan

**What is not proven.** That `main` is mechanically protected against a direct
push by the platform.

**Why.** A GitHub plan limitation, recorded by the founder in the P1-L review as
a platform limitation that must not block development.

**What is in place instead.** A `.githooks/pre-push` hook refuses any push to
`main`; work happens on short-lived feature branches; CI must be green; history
stays linear; no force-pushes; one active assignment at a time; the founder
controls every merge.

**What the hook does not cover.** It is local. A push from a machine without the
hook configured, or with `--no-verify`, would not be stopped.

**To close.** A GitHub plan that includes branch protection or rulesets.

---

## L-7 · Legal placeholders are withheld, so `/privacy` is not publishable

**What is not proven.** That the privacy notice is legally complete or correct.

**Why.** Legal entity name, registered address and the privacy mailbox do not
yet exist. P1-M forbids completing them.

**What is in place.** Eleven approved strings are held verbatim in
`WITHHELD_UNTIL_UNBLOCKED` in `src/content/copy.ts` — stored exactly as
approved, never edited, and never rendered. The release run asserts that no
`{{placeholder}}` and no `[LEGAL]` marker reaches any built page.

**Consequence.** `/privacy` must not be published in its current state. The site
is `noindex` and `robots.txt` disallows all crawling; both are driven by the
single `IS_INDEXABLE` constant so they cannot disagree.

**To close.** Legal approval of the entity details, then a copy assignment — not
an implementation one.

---

## L-8 · Two copy strings are provisional, not approved

**What is not proven.** That the skip-link text and the 404 page title are
approved copy.

**Why.** GAP-01 and GAP-02: the specifications do not define them, and inventing
approved copy is out of scope for implementation.

**What is in place.** Both are quarantined in `PROVISIONAL` in
`src/content/copy.ts`, and a unit test freezes the count at exactly 2 so a third
cannot be added quietly.

**To close.** Founder ratification of the two strings, or replacements.

---

## L-9 · Two moderate npm advisories are accepted knowingly

**What is not proven.** A zero-advisory dependency tree.

**Why.** Both come from `uuid` reached through `@lhci/cli`, a development-only
dependency. No fix is available upstream that does not require abandoning
Lighthouse CI.

**What is in place.** `npm run audit:deps` gates at `--audit-level=high`, so the
tree is clean at high and critical. Nothing in the two advisories ships: the
built output contains zero JavaScript.

**To close.** An upstream `@lhci/cli` release.

---

## L-11 · Firefox cannot run on the Windows development machine

**What is not proven locally.** The Gecko half of the cross-browser matrix.

**Why.** Playwright's Firefox build will not start on this machine. The failure
is a Win32 side-by-side activation error, diagnosed rather than assumed:

```
Activation context generation failed for
  ...\ms-playwright\firefox-1538\firefox\firefox.exe
Dependent Assembly mozglue, language="*", type="win32", version="1.0.0.0"
could not be found.
```

Surfaced to Playwright as `browserType.launch: spawn UNKNOWN`. Ruled out:
`mozglue.dll` is present (658 KB) in the same directory; `firefox.exe` and
`mozglue.dll` are both x64 on an x64 OS; the Visual C++ 2015–2022
redistributables are installed (x86 and x64); Defender has quarantined nothing;
Playwright's own `PrintDeps.exe` resolves every other dependency. A complete
delete and fresh 120 MB reinstall reproduces it exactly.

**What was done instead.** CI on `ubuntu-latest` now installs all three engines
(`npx playwright install --with-deps chromium firefox webkit`) and runs the same
matrix, so Firefox evidence is real — it is produced on Linux rather than
Windows. Locally, `npm run verify:release` probes each engine, names any that
cannot launch in its summary, and runs the matrix on the rest. **In CI a missing
engine is a hard failure**, so the three-engine requirement cannot quietly
lapse.

**What is therefore not covered anywhere.** Firefox **on Windows**
specifically — Windows font rendering and Gecko's Windows focus handling. Gecko
itself is covered on Linux, and covered properly: its first CI run caught a real
target-size defect (A11Y-09-3) that every Windows run had passed, plus a harness
defect that only Gecko exposed (H-13).

**To close.** Resolve the SxS activation on this machine, or run the matrix on a
second Windows machine.

---

## L-12 · WebKit skips 52 keyboard-order assertions, by design

**What is not proven in WebKit.** Tab ORDER, and `forced-colors`.

**Why.** Two documented engine facts, not site defects:

1. Safari's "Press Tab to highlight each item on a webpage" preference is off by
   default, so WebKit tabs only between form controls and skips every link. No
   page can change that setting. Asserting tab order in WebKit would be testing
   a browser preference.
2. Playwright does not emulate `forced-colors: active` in WebKit. The option is
   accepted and does nothing, so the assertions would measure ordinary rendering
   and report it as high-contrast evidence.

**What was done instead.** Both are `test.skip` with the reason in the skip
message, so they appear in the report as skipped rather than passing. Coverage
is not lost: `A11Y-02 … every interactive element can take focus, in every
engine` focuses every control programmatically in all three engines and proves
none is inert, disabled or unreachable — which is the failure that would
actually strand a keyboard user. Tab order itself is asserted in Blink and
Gecko, where it is meaningful. The skip-link tests focus the link directly in
WebKit and still assert that activating it moves focus into `#main`.

---

## L-10 · The clean-environment run reproduces on one machine, one OS

**What is not proven.** Reproducibility across operating systems.

**Why.** Only Windows 11 with Node 22 is available here.

**What was done instead.** `node_modules`, `dist` and `.astro` were deleted and
the whole pipeline re-run from `npm ci` (see `clean-build-report.md`). `.nvmrc`
pins the Node version, `engines` enforces the range, `.gitattributes` normalises
line endings to LF, and CI runs the same pipeline on Ubuntu — so the Linux path
is covered by CI even though it is not covered locally.

**To close.** Nothing outstanding. Recorded for completeness.

---

## What is genuinely not covered by anything above

- **Real user testing.** No one outside the project has used this site.
- **Content accuracy.** Tests prove strings match the approved copy modules. They
  cannot prove the approved copy is true.
- **Legal review.** No lawyer has read `/privacy` or the binding commitments.
- **Load and availability.** Nothing is deployed, so nothing has been load tested.

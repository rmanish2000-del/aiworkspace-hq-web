# AIWHQ-CC-004 — SHARED DESIGN SYSTEM SPECIFICATION

**Document ID:** `AWHQ-WEB-CC004`
**Version:** 1.0 · **Date:** 3 August 2026 · **Executor:** Claude Chat (design) → Claude Fable 5 / Claude Code (build) · **Level:** L2
**Supplies:** **Slot `DS` — the Shared Design System**, recorded `Missing` in `AWHQ-TRUST-HQ8-00` §6.1 and requested three times before this document.
**Brief of record:** Founder standing mandate, 3 August 2026 — *world-class UI/UX · responsive and interactive across all devices and screen sizes · unique, beautiful colors · light and dark themes · gradients · intelligent animations.*
**Status:** **DESIGN ONLY.** ⛔ No route implemented. No copy authored. Every color pair below is **computed, not assumed** — 38 pairs verified this session, 2 candidate failures caught and corrected before entering this spec.

---

# 0 POSITION IN THE CANON

## 0.1 What this document supplies and what it amends

| | |
| --- | --- |
| **Fills** | The `DS` slot — the last of the design-side missing inputs on the wall |
| **Adopts unchanged** | P0 `07` §7 accessibility floor in full: skip link · one `h1` · landmarks · focus ring ≥3:1 · keyboard operability · reflow at 400% · **touch targets ≥44×44px** · `forced-colors` support · **color never the sole carrier of meaning** |
| **⚠ Amends** | P0 `07` §2 (single-accent palette) and §8 (*"essentially no motion"*) — **for the seven-route site.** The founder's mandate is the amending authority; the amendment is recorded here rather than made silently |
| **⛔ Does not amend** | P0 `07` as it governs the **already-built holding page**. Restyle of the built page is a separate, explicitly authorized change — not a side effect of this spec |
| **Binds to** | TDR-13 zero web fonts · P0 `08` §8 performance budgets · C-13 (*"we do not use tracking cookies on this site"*) · P1-J §5 *zero cookies, zero client storage* · `AWHQ-TRUST-HQ8-00` §6.1 tier-encoding requirement |

## 0.2 The two constraints that make "world-class" mean something here

**HQ-8 §6.1 sets the design system's one non-negotiable semantic duty:** *the tier vocabulary must be visually encoded — `Verified` and `Under design` cannot look identical on a page. Tier is semantic, not decorative.* §6 delivers this.

**And it names the defect that must not recur:** P1-C found an input border at **1.29:1 against a 3:1 requirement**. *"The design system must carry a contrast gate, or that defect recurs."* §9 delivers the gate; every token in §2 already passed it.

---

# 1 DESIGN DIRECTION

## 1.1 The thesis

**This site's subject is evidence.** Its content model is a claim ledger; its differentiator is a page of dated absences; its trust strategy is *verification before assertion*. **A world-class design here is one where the verification machinery is the visual identity** — not a coat of paint over it.

So the system's signature is:

> ### **The gradient is the argument.**
>
> The brand gradient runs **Iris → Verdigris**: the color of *direction* resolving into the color of *evidence*. Every claim on this site is somewhere on that line — `Approved direction` renders in Iris, `Verified` renders in Verdigris — and the hero gradient is that spectrum drawn once, at full size. **Gradients are mandated by the brief; this makes them mean something.** A visitor who never reads a word of theory still absorbs the site's one idea: *things here move from intended to proven, and the page tells you which is which.*

## 1.2 What this is deliberately not

The current defaults of AI-adjacent design — cream paper with a serif display and terracotta accent · near-black with one acid-green neon · violet-to-blue "AI gradient" — are all declined. **Verdigris (oxidised-copper green) as the primary is the distinctive choice:** it is the color of material that has been *exposed and lasted*, which is this brand's exact claim, and no major AI platform owns it. The warm **Saffron** third hue carries dates and re-verification stamps — the system's "time" color — and reads as an Indian-founded company's own note without costume.

---

# 2 COLOR SYSTEM

**Every value below passed computed WCAG checks this session (§9 gate, run in advance).** Text pairs ≥4.5:1 · large-text and UI-component pairs ≥3:1 (WCAG 1.4.3 + **1.4.11** — the P1-C defect class).

## 2.1 Neutrals — "Ink & Paper," green-cast

| Token | Light | Dark | Role | Verified |
| --- | --- | --- | --- | --- |
| `--bg` | `#F7FAF8` | `#0A1512` | Page | — |
| `--bg-subtle` | `#ECF2EF` | `#12201B` | Panels, cards, form wells | — |
| `--fg` | `#10201B` | `#ECF2EF` | Body, headings | **16.06 / 16.40 :1** |
| `--fg-muted` | `#48594F` | `#95A8A0` | Hints, stamps, footer | **7.09 / 7.43 :1** — passes on both bg levels |
| `--border` | `#D6E0DB` | `#1E2E28` | Decorative rules **only** — never component boundaries *(P0 `07` distinction kept)* |
| `--border-input` | `#6E7D77` | `#5E7268` | **All UI-component boundaries** | **4.11 & 3.81 / 3.62 & 3.27 :1** — ≥3:1 on *both* bg levels, *both* themes. ⚠ The dark value was corrected from a 2.82:1 first candidate — **the gate caught it before the spec shipped, which is the gate working** |
| `--border-strong` | `#586760` | `#7E938A` | Hover boundaries | **5.67 / 5.69 :1** |

## 2.2 The three hues

| Token | Light | Dark | Meaning | Verified as text on `--bg` |
| --- | --- | --- | --- | --- |
| `--verdigris` | `#0B6B57` | `#43D6A9` | **Evidence. Verified. The primary.** Links, primary action, focus ring, `Verified` tier | **6.14 / 10.13 :1** |
| `--iris` | `#3D45C4` | `#9BA5FF` | **Direction. Design intent.** `Approved direction` tier, secondary emphasis | **7.02 / 8.17 :1** |
| `--saffron` | `#8A5800` | `#F0BC5E` | **Time.** Date stamps, re-verification cadence, `gated / withheld` states | **5.75 / 10.68 :1** |
| `--danger` | `#B3261E` | `#FF8A80` | Errors only | **6.22 / 8.15 :1** |
| `--on-hue` | `#FFFFFF` | `#0A1512` | Text on solid hue fills | **≥6.45 / ≥8.17 :1** on every hue |

**Focus ring:** `--verdigris`, 2px, 2px offset, plus 1px `--bg` inner ring (P0 `07` §5 pattern kept). Verified **6.14 / 10.13:1** against both themes' backgrounds.

## 2.3 Gradients — defined with worst-stop verification, or they don't exist

**Rule GR-1: a gradient is a token with two tested stops, not a CSS value someone types.** Text over a gradient is tested against the **worst stop**; if the worst stop fails, the combination is prohibited — no averaging, no "it looks fine."

| Token | Stops (light / dark share stops) | Use | Worst-stop verification |
| --- | --- | --- | --- |
| `--g-thesis` | `--iris` → `--verdigris` deep forms `#3D45C4 → #0B6B57`, 135° | Hero wash, section transitions, wordmark underline, primary-button hover sheen | **White text ≥6.45:1 at both stops** — usable as a text-bearing fill |
| `--g-evidence` | `#07473A → #0D7C64` | `Verified` emphasis surfaces, trust-page accents | **White ≥5.14:1 at both stops.** ⚠ Bright stop corrected from `#0E8A6F` (4.30:1 fail) — second catch of the pre-flight gate |
| `--g-veil` | Either gradient at **≤8% opacity** over `--bg` | Full-width ambient washes behind normal text | Text contrast re-verified against the **composited** result in CI, not against raw `--bg` |
| **Prohibited** | Gradient **text fills** (`background-clip: text`) for any content text | Decorative display only, and only with a solid same-hue fallback that passes on its own | — |

## 2.4 Tier ramp — the semantic core (see §6)

`Verified` → Verdigris · `Approved direction` → Iris · `Reported` → neutral slate · `Under design` → slate, dashed · `Gated / withheld` → Saffron. **`Prohibited` and `Blocked` have no public tokens — they never render publicly** (`HQ-8/02` TP-4).

---

# 3 TYPOGRAPHY

**TDR-13 is signed: zero web fonts.** World-class typography here is built from weight, scale, spacing and *voice separation* — the same discipline Linear and Stripe's product surfaces use — and it removes a render-blocking request, a layout-shift class, and a privacy-notice origin in one decision already made.

| Token | Stack | Voice |
| --- | --- | --- |
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` *(P0 `07` stack kept)* | **Prose voice** — everything human-written |
| `--font-mono` | `ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono", Consolas, monospace` | **⚠ Ledger voice — the typographic signature.** Every claim ID, tier label, date stamp, evidence reference and register entry renders in mono with `font-variant-numeric: tabular-nums`. **Two voices on one page: the site *speaks* in sans and *attests* in mono.** A reader learns in one viewport that mono = machinery of proof |

**Fluid scale** (`clamp()`, 1.25 ratio at desktop, viewport-interpolated — no breakpoint jumps):

| Token | Range | Weight · tracking |
| --- | --- | --- |
| `--text-display` | `clamp(2.5rem, 1.6rem + 4vw, 4.5rem)` | 680 · `-0.02em` · `text-wrap: balance` |
| `--text-h1` | `clamp(2rem, 1.4rem + 2.6vw, 3rem)` | 650 · `-0.015em` |
| `--text-h2` | `clamp(1.5rem, 1.2rem + 1.3vw, 2rem)` | 620 |
| `--text-h3` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` | 600 |
| `--text-body` | `1rem` (16px floor — never below) | 400 · `line-height: 1.6` · measure ≤ `70ch` |
| `--text-small` | `0.875rem` | 450 |
| `--text-stamp` | `0.8125rem` mono | 500 · `0.02em` · uppercase for tier labels only |

---

# 4 SPACE, SHAPE, ELEVATION, LAYOUT

| Family | Tokens |
| --- | --- |
| **Space** | 4px base: `--s-1…--s-12` = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 192. Section rhythm `--s-9` desktop / `--s-7` mobile |
| **Radius** | `--r-s` 6px inputs/badges · `--r-m` 10px cards · `--r-l` 16px panels · `--r-full` pills. **No 24px+ "blob" radii** — this is an evidence site, not a consumer app |
| **Elevation** | Light: two-layer soft shadows (`0 1px 2px rgb(16 32 27 / .06), 0 4px 16px rgb(16 32 27 / .07)`). **Dark: elevation by lightening surface + 1px border, never by shadow** — shadows die on dark grounds |
| **Layout** | Container `72rem`, gutters `--s-5`/`--s-4`. 12-col grid ≥900px, 4-col below. **Fluid-first: breakpoints are where layout *changes*, not where it *works*** — 360 / 640 / 900 / 1200 are reference points; `clamp()` and `minmax()` carry everything between |
| **Touch** | **≥44×44px every interactive target, all viewports** — inherited P0 floor, and the recorded A11Y-09 decision. Hover reveals always have a non-hover equivalent — touch devices are first-class, not degraded |

---

# 5 MOTION SYSTEM — "INTELLIGENT" DEFINED, THEN TOKENISED

## 5.1 The definition

> **Motion is intelligent when it carries information a static page would need extra words for.** Everything else is decoration, and decoration is cut.

Three jobs motion is *for* on this site: **(1) state** — a form moving through its six states, a disclosure opening; **(2) provenance** — evidence arriving *from* its source when a claim expands; **(3) orientation** — one orchestrated hero entrance so the page's hierarchy assembles in reading order. **Zero jobs for:** looping ambience, parallax, scroll-jacking, cursor effects, auto-playing anything.

## 5.2 Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--dur-instant` | 80ms | Hover color, underline thickness |
| `--dur-fast` | 140ms | Buttons, inputs, toggles |
| `--dur-base` | 220ms | Card hover lift, disclosure open, badge transitions |
| `--dur-slow` | 360ms | Section reveals, theme cross-fade |
| `--dur-hero` | 600ms, **once per load** | Hero entrance orchestration |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-enter` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Things appearing |
| `--ease-exit` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Things leaving — exits faster than entrances, always |

## 5.3 The vocabulary

| Pattern | Spec |
| --- | --- |
| **Hero entrance** | Headline → sub → tier legend → CTA, 60ms stagger, `opacity 0→1` + `translateY 12px→0`, `--dur-hero` total. Runs once; **the `--g-thesis` gradient position eases 8% over the same window** — the argument literally resolving. Never re-triggers |
| **Scroll reveal** | `IntersectionObserver`, threshold 0.2, once per element, `opacity` + `translateY 12px`, `--dur-slow`. **≤1KB of JS, inside the 10KB budget.** No library — GSAP/Framer are prohibited by P0 `08` ARCH-06/07 arithmetic, not by taste |
| **Evidence expand** | Claim card opens `--dur-base`; the source line **draws in from the claim it supports** — provenance as motion |
| **Tier badge** | On first reveal, `Verified` badges fill Verdigris over `--dur-base`. `Under design` badges **never animate** — motionlessness is part of the encoding |
| **Form states** | The six mock states (MF-1…6) transition at `--dur-fast`; error shake is **prohibited** — errors appear with icon + text, still |
| **Theme switch** | 220ms `background-color`/`color` cross-fade on the root; imagery swaps instantly |
| **Interactive touches** | Buttons: `translateY(-1px)` + shadow deepen on hover, return on press. Links: underline thickens `--dur-instant`. Cards: border → `--border-strong` + 2px lift |

## 5.4 ⛔ Reduced motion — a first-class theme, not a fallback

Under `prefers-reduced-motion: reduce`: **all transform animations removed** · reveals become plain `opacity ≤120ms` or nothing · hero renders assembled · gradient position static · `scroll-behavior: smooth` never applied · spinner suppressed (P0 `07` kept). **CI asserts the reduced-motion build contains zero `transform` transitions** (§9 G-M).

---

# 6 TIER ENCODING — THE HQ-8 §6.1 REQUIREMENT, DISCHARGED

**Every tier is distinguishable by ≥3 independent channels — hue, fill/border treatment, glyph — plus text, so no single channel (and no color vision type) carries the meaning alone.**

| Tier | Hue | Treatment | Glyph | Motion | Mono label |
| --- | --- | --- | --- | --- | --- |
| **Verified** | Verdigris | **Solid fill**, `--on-hue` text | ✓ check | Fills on first reveal | `VERIFIED · 2026-08-03` |
| **Approved direction** | Iris | **2px outline**, iris text, transparent fill | → arrow | Static | `APPROVED DIRECTION` |
| **Reported** | Slate (`--fg-muted`) | Tint fill (`--bg-subtle`) | ○ open circle | Static | `REPORTED` |
| **Under design** | Slate | **Dashed** 1.5px outline | ◌ dotted circle | **Never animates** | `UNDER DESIGN` |
| **Gated / withheld** | Saffron | Tint fill, saffron text | ◆ diamond | Static | `GATED` |

**Every badge carries its date in mono** — `T-3`'s *dated negative claims* rule made visible. The re-verification cadence renders as a saffron stamp: `RE-VERIFIED QUARTERLY · LAST 2026-08-03`.

---

# 7 COMPONENT INVENTORY — THE SEVEN BUILDABLE ROUTES + SHELLS

| # | Component | Notes |
| --- | --- | --- |
| 1 | **Header** | Wordmark (inline SVG, `currentColor`) · 5 primary links · theme control (§8) · no dropdowns (HQ-9 N-rules) |
| 2 | **Footer** | Entity line · `/privacy` · contact · disclosure · **no stage names (RS-1), no programme names (G-4)** |
| 3 | **Hero** | Display + `--g-thesis` + tier legend + single CTA |
| 4 | **Tier badge** | §6. The atom of the system |
| 5 | **Claim card** | Statement (sans) + badge + source line (mono) + evidence expand |
| 6 | **Gap item** | `/what-we-havent-built`: dated absence, saffron stamp, re-verification line |
| 7 | **Question–position pair** | `/enterprise`: question (h3) + position + badge — **questions framing, never readiness** (F-10 held in the component itself) |
| 8 | **Technology entry** | Name · purpose · reason · lock-in position — **never a bare logo** (TP-2); six entries (Appendix A) |
| 9 | **Principle card** | The **five** operating principles (FIX-04 held) |
| 10 | **Form set** | Input, label, hint, error (icon+text), consent check, button with six states MF-1…6 |
| 11 | **Buttons** | Primary (verdigris solid) · secondary (outline) · quiet. 44px min |
| 12 | **Disclosure** | Evidence expand; `<details>`-based, JS-enhanced |
| 13 | **Table** | Register rendering; mono numerics; row hover |
| 14 | **Callout** | Info (iris) · caution (saffron) · never marketing |
| 15 | **Date stamp** | Mono + saffron; the T-3 carrier |
| 16 | **Skip link · focus ring · empty-state shell** | Floor components; shells get the honest empty state, not lorem |

---

# 8 THEMING ARCHITECTURE — AND ONE CATCH ROUTED TO YOU

**Mechanism:** every token is a CSS custom property; dark values swap on `[data-theme]` at the root; default follows `prefers-color-scheme`. Both themes first-class — every §2 pair verified in both.

> ### ⚠ **DS-D1 — the manual theme toggle collides with an existing rule, and the mandate now requires one.**
>
> P1-J §5 inherits P0's floor **verbatim: "zero cookies, zero client storage."** A toggle that *remembers* the choice needs one `localStorage` key — which is client storage. A toggle that forgets on every page load is worse than none.
>
> **The clean reading:** C-13's binding string is *"we do not use tracking cookies on this site."* A theme key is not a cookie and tracks nothing — **C-13 is untouched.** The conflict is only with the *zero client storage* implementation line, which was written for a page that had no controls at all.
>
> **Recommendation:** amend the line to *"zero cookies; no client storage except a single first-party `theme` preference key, readable by no one but the browser."* One sentence in the ledger, and the mandate and the commitment coexist honestly. **Founder call — flagged, not executed.** Until decided, the toggle ships session-scoped (in-memory) and the default follows the OS.

---

# 9 CI GATES — THE PART THAT MAKES THIS A SYSTEM, NOT A MOOD BOARD

| Gate | Asserts | Failure = build fails |
| --- | --- | --- |
| **G-C1 Contrast** | Every declared **text/bg pair ≥4.5:1**, every **UI-boundary and large-text pair ≥3:1**, computed from the token file — **both themes, both bg levels** | ✅ The P1-C 1.29:1 class, made unshippable. *This spec's own values already ran the gate: 38 pairs, 2 caught, corrected, 0 remaining* |
| **G-C2 Gradient worst-stop** | Text-bearing gradients pass at their **worst stop**; `--g-veil` re-tested **composited** | ✅ Caught `#0E8A6F` at 4.30:1 pre-flight |
| **G-M Reduced motion** | The `prefers-reduced-motion` build contains **zero transform transitions** and no smooth scroll | ✅ |
| **G-P Budget** | P0 `08` §8 unchanged: Lighthouse ≥95 · **≤60KB total** (target 35) · **≤10KB JS** · ≤6 requests — **including the motion JS and both themes** | ✅ Gradients cost ~0 bytes; reveals ≤1KB; no animation library exists to blow it |
| **G-F Fonts** | Zero `@font-face`, zero font origins | ✅ TDR-13 |
| **G-T Tier tokens** | Every tier badge instance resolves to a §6 token set — no ad-hoc tier styling | ✅ HQ-8 §6.1 enforced structurally |

**Plus the human check that no CI catches:** G-7 internal-architecture review and the **entity-name inference path** (§5.3 of `AWHQ-IA-CC002`) stay manual, per IR-6.

---

# 10 FOUNDER DECISIONS & GOVERNANCE

| # | Decision | Options | Default until decided |
| --- | --- | --- | --- |
| **DS-D1** | Theme-persistence amendment (§8) | Amend the storage line *(recommended)* · OS-only, no toggle · toggle without memory | Session-scoped toggle |
| **DS-D2** | Accept the P0 `07` §2/§8 amendment scope (§0.1) — new system governs the seven routes; holding page restyle is a separate authorization | Accept · restyle holding page too · reject | Holding page unchanged |

| # | Governance | Status |
| --- | --- | --- |
| **C-Q1** | **Every color pair computed this session — 38 verified, 2 candidate failures corrected before entering the spec.** Nothing assumed | ✅ |
| **C-Q2** | Mandate honored in full: responsive/interactive all devices · unique color system · light+dark · gradients · intelligent animations — **each delivered as tokens with gates, not adjectives** | ✅ |
| **C-Q3** | All standing constraints held: TDR-13 · P0 `08` budgets · C-13 · 44px targets · reduced motion · tier encoding · G-4 (no programme name anywhere in this spec's public-facing tokens or components) | ✅ |
| **C-Q4** | P0 `07` amendments **declared** (§0.1), not silent | ✅ |
| **C-Q5** | No route implemented · no copy authored · no claim approved · nothing published | ✅ |

---

## Stopping point

**The Shared Design System is specified: 3 hues + neutrals across 2 verified themes · 2 meaning-bearing gradients with worst-stop proofs · a two-voice type system on zero web fonts · a tokenised motion vocabulary with reduced-motion as a first-class build · 5-tier semantic encoding · 16 components · 6 CI gates. The thrice-requested missing input is closed, pending your two decisions.**

**Not done:** no implementation · no route built · no holding-page restyle · no copy · no theme-storage amendment executed · no further assignment generated.

**End of `AWHQ-WEB-CC004` v1.0.**

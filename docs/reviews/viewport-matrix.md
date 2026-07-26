# Viewport matrix — P1-M §4

**Method:** automated, `tests/e2e/viewport-matrix.spec.ts`, re-run on every push.
**Scope:** 8 widths × 2 colour schemes × 6 routes, in every engine that runs.
**Result:** no horizontal scrolling, no clipped content, no lost content, at any
size tested.

---

## What is asserted at each size

Four failures, checked per route:

| Assertion            | Fails when                                                                       |
| -------------------- | -------------------------------------------------------------------------------- |
| No horizontal scroll | `documentElement.scrollWidth > clientWidth + 1`                                  |
| No element overflows | any element's box extends past the viewport's right edge, or starts left of `-1` |
| The `h1` renders     | the page heading has zero height                                                 |
| `main` has content   | fewer than 50 characters of text inside `main`                                   |

The 1px tolerance absorbs sub-pixel rounding. Elements are reported by tag and
class when they fail, so a failure names the culprit rather than the page.

## The matrix

`07` §5 declares **320px the minimum supported width**. Every width below was
run against all six routes in both colour schemes.

| Width × height | Device class                             | Result |
| -------------- | ---------------------------------------- | ------ |
| 320 × 568      | iPhone SE 1st gen — the declared minimum | Pass   |
| 360 × 800      | common Android                           | Pass   |
| 390 × 844      | iPhone 14/15                             | Pass   |
| 768 × 1024     | iPad portrait — the `sm` breakpoint      | Pass   |
| 1024 × 768     | iPad landscape — the `lg` breakpoint     | Pass   |
| 1280 × 720     | laptop                                   | Pass   |
| 1440 × 900     | larger laptop                            | Pass   |
| 1920 × 1080    | desktop                                  | Pass   |

Routes covered at every size: `/`, `/platform`, `/principles`, `/contact`,
`/privacy`, `/404`.

Colour schemes: `light` and `dark` at every size — `07` §2 makes both
first-class, and dark mode changes borders and focus rings, which is where
overflow tends to appear.

**96 route-renders per engine** (8 × 2 × 6).

## Additional size-dependent checks

| Check                                | Detail                                                                                                             | Result |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------ |
| Orientation                          | 390×844 and 844×390 — portrait and landscape both render the `h1` and the interest field with no horizontal scroll | Pass   |
| Input font size                      | every `input`/`textarea` renders ≥16px at all eight widths, so iOS does not auto-zoom on focus                     | Pass   |
| Reflow at 200 % / 300 % / 400 % zoom | asserted in `a11y-manual.spec.ts` as 640 / 427 / 320px effective widths (SC 1.4.10)                                | Pass   |

## Results by engine

| Engine   | Projects                                             | Viewport cases | Result                      |
| -------- | ---------------------------------------------------- | -------------- | --------------------------- |
| Chromium | `chromium-light`, `chromium-dark`, `chromium-mobile` | 16 × 3         | Pass                        |
| WebKit   | `webkit`, `webkit-dark`                              | 16 × 2         | Pass                        |
| Firefox  | `firefox`, `firefox-dark`                            | 16 × 2         | Not run locally — see below |

`chromium-mobile` pins the viewport to 320×640 at the project level and then runs
the matrix inside it, so the minimum width is exercised twice by different means.

**Firefox.** Playwright's Firefox build will not start on the Windows
development machine (Win32 side-by-side activation failure — diagnosed in
`known-limitations.md` L-11). CI on `ubuntu-latest` installs all three engines
and runs this same matrix, so Firefox viewport evidence is produced there.

## What this does not cover

- **Real devices.** These are engines at device-sized viewports, not hardware.
  Software-keyboard resize, safe-area insets and touch precision differ. See
  `known-limitations.md` L-2.
- **By-eye review.** The assertions catch overflow and loss, not ugliness. A
  layout can pass every check and still look wrong at 320px; that judgement is
  the founder's, and the screenshots in `docs/reviews/` are for it.
- **Intermediate widths.** Eight widths, not a continuous sweep. Breakpoints at
  `sm` (768) and `lg` (1024) are covered on both sides, which is where a
  media-query mistake would show.

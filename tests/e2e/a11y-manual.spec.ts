import { expect, test, type Page } from '@playwright/test';

import {
  copy,
  principles,
  principlesPage,
  platform,
  contact,
  privacy,
  notFound,
  hero,
  interest,
  nav,
  header,
  PROVISIONAL,
} from '../../src/content/copy';

/**
 * A11Y-02 … A11Y-12 and M-1 … M-10, automated as far as they honestly can be.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ WHAT THIS FILE IS, AND WHAT IT IS NOT                                    │
 * │                                                                           │
 * │ P0 `08` §6 lists A11Y-02 to A11Y-12 as MANUAL checks, and P0 `11` §8      │
 * │ lists M-1 to M-10 the same way. Most of them are manual only because      │
 * │ nobody automated them — keyboard order, focus visibility, reflow, touch   │
 * │ targets and forced-colours are all mechanically checkable, and a machine  │
 * │ checks them on every route, in every engine, on every push.               │
 * │                                                                           │
 * │ Three are NOT automatable here and are not claimed:                       │
 * │                                                                           │
 * │   A11Y-12 / M-1 / M-2   a real screen reader. NVDA is not installed in    │
 * │                         this environment and VoiceOver needs macOS. What  │
 * │                         IS checked below is the accessibility TREE — the  │
 * │                         roles, names and states a screen reader consumes. │
 * │                         That is strong evidence and not a substitute.     │
 * │                         Founder checklist: docs/reviews/nvda-checklist.md │
 * │                                                                           │
 * │   M-4 / M-5             real iPhone Safari and real Android Chrome. The   │
 * │                         WebKit and Chromium engines at device viewports   │
 * │                         are close, but a real device differs in touch     │
 * │                         handling, zoom-on-focus and safe areas.           │
 * │                                                                           │
 * │   M-3                   real Windows High Contrast. `forced-colors:       │
 * │                         active` emulation is checked below; the real mode │
 * │                         also substitutes system colours at the OS level.  │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

const ROUTES = ['/', '/platform', '/principles', '/about', '/contact', '/privacy', '/404'] as const;

/**
 * WebKit tabs only between FORM CONTROLS.
 *
 * Safari's "Press Tab to highlight each item on a webpage" preference is off by
 * default, and no page can change it. So in WebKit, Tab skips every link and
 * lands on the first input — which means keyboard ORDER cannot be asserted
 * there, and a failure would be reporting a browser preference rather than
 * anything about this site.
 *
 * The tab-order tests below therefore run in Blink and Gecko. Coverage is not
 * dropped for WebKit: `A11Y-02 … every interactive element can take focus`
 * runs in every engine and proves nothing is inert, disabled or unreachable.
 */
const TAB_REACHES_LINKS =
  'WebKit does not tab to links by default (Safari preference, not a page defect)';

/** Every interactive element, in DOM order, with what a user would perceive. */
async function focusables(page: Page) {
  return page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]',
      ),
    ]
      .filter((el) => el.getAttribute('tabindex') !== '-1')
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        text: (el.textContent ?? '').trim().slice(0, 60),
        tabindex: el.getAttribute('tabindex'),
      })),
  );
}

/** Relative luminance per WCAG, from an `rgb()`/`rgba()` string. */
function luminance(colour: string): number {
  const [r, g, b] = (colour.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number) as [
    number,
    number,
    number,
  ];
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/* ========================================================================== */
/* A11Y-02 — full keyboard operability, no traps                              */
/* ========================================================================== */

for (const route of ROUTES) {
  test(`A11Y-02 ${route}: every interactive element is reachable, each exactly once`, async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === 'webkit', TAB_REACHES_LINKS);
    await page.goto(route);

    // Stamp each focusable with its DOM index. Class names repeat (three nav
    // links share one class), so identity has to come from the element itself
    // or the check false-positives on a trap that is not there.
    const total = await page.evaluate(() => {
      const els = [
        ...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select'),
      ].filter((el) => el.getAttribute('tabindex') !== '-1');
      els.forEach((el, i) => el.setAttribute('data-focus-index', String(i)));
      return els.length;
    });

    expect(total, `${route} has no focusable elements`).toBeGreaterThan(0);

    const visited: number[] = [];
    for (let i = 0; i < total; i += 1) {
      await page.keyboard.press('Tab');
      const index = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        const attr = el?.getAttribute('data-focus-index');
        return attr === null || attr === undefined ? -1 : Number(attr);
      });
      visited.push(index);
    }

    // Every focusable reached, in DOM order, none repeated.
    expect(visited, `${route}: focus order is not DOM order`).toEqual(
      Array.from({ length: total }, (_, i) => i),
    );
  });

  test(`A11Y-02 ${route}: focus moves on every press and finally leaves the page`, async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === 'webkit', TAB_REACHES_LINKS);
    // The real trap test: focus that stops changing, or never escapes.
    await page.goto(route);

    const total = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select'),
        ].filter((el) => el.getAttribute('tabindex') !== '-1').length,
    );

    let previous = '';
    let stuck = 0;
    for (let i = 0; i < total + 2; i += 1) {
      await page.keyboard.press('Tab');
      const current = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return '<body>';
        return `${el.tagName}#${el.id}.${el.className}@${
          Math.round(el.getBoundingClientRect().top) + Math.round(el.getBoundingClientRect().left)
        }`;
      });
      if (current === previous) stuck += 1;
      previous = current;
    }

    // Tabbing past the last control leaves the document, so at most the final
    // presses repeat <body>. Anything more is a trap.
    expect(stuck, `${route}: focus stopped moving — keyboard trap`).toBeLessThanOrEqual(2);
  });

  test(`A11Y-02 ${route}: Shift+Tab reverses without trapping`, async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', TAB_REACHES_LINKS);
    await page.goto(route);

    const total = await page.evaluate(() => {
      const els = [
        ...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select'),
      ].filter((el) => el.getAttribute('tabindex') !== '-1');
      els.forEach((el, i) => el.setAttribute('data-focus-index', String(i)));
      return els.length;
    });

    for (let i = 0; i < total; i += 1) await page.keyboard.press('Tab');

    const backwards: number[] = [];
    for (let i = 0; i < total - 1; i += 1) {
      await page.keyboard.press('Shift+Tab');
      backwards.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          const attr = el?.getAttribute('data-focus-index');
          return attr === null || attr === undefined ? -1 : Number(attr);
        }),
      );
    }

    // Strictly descending from the second-to-last index down to zero.
    expect(backwards, `${route}: reverse focus order is wrong`).toEqual(
      Array.from({ length: total - 1 }, (_, i) => total - 2 - i),
    );
  });
}

for (const route of ROUTES) {
  test(`A11Y-02 ${route}: every interactive element can take focus, in every engine`, async ({
    page,
  }) => {
    /**
     * The engine-independent half of A11Y-02. Tab ORDER is a browser
     * preference in WebKit (see above), but FOCUSABILITY is not — an element
     * that is inert, disabled, `display:none` or covered by an overlay cannot
     * take focus in any engine. That is what would actually strand a keyboard
     * user, and it is checked everywhere.
     */
    await page.goto(route);

    const unfocusable = await page.evaluate(() => {
      const failures: string[] = [];
      const els = [
        ...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select'),
      ].filter((el) => el.getAttribute('tabindex') !== '-1');

      for (const el of els) {
        el.focus();
        if (document.activeElement !== el) {
          failures.push(`${el.tagName}.${el.className}`.slice(0, 44));
        }
      }
      return failures;
    });

    expect(unfocusable, `${route}: element(s) that cannot take focus`).toEqual([]);
  });
}

/* ========================================================================== */
/* A11Y-03 — visible focus indicator, and its contrast                        */
/* ========================================================================== */

for (const route of ROUTES) {
  test(`A11Y-03 ${route}: every focus stop paints an indicator of >=2px`, async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === 'webkit', TAB_REACHES_LINKS);
    await page.goto(route);
    const count = (await focusables(page)).length;

    const weak: string[] = [];
    for (let i = 0; i < count; i += 1) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return null;
        const s = getComputedStyle(el);
        return {
          id: el.id || el.className || el.tagName,
          outlineWidth: Number.parseFloat(s.outlineWidth) || 0,
          outlineStyle: s.outlineStyle,
          boxShadow: s.boxShadow,
        };
      });
      if (!info) continue;
      const hasRing =
        (info.outlineWidth >= 2 && info.outlineStyle !== 'none') || info.boxShadow !== 'none';
      if (!hasRing) weak.push(`${info.id} (outline ${info.outlineWidth}px ${info.outlineStyle})`);
    }

    expect(weak, `${route}: focus stops without a visible indicator`).toEqual([]);
  });
}

test('A11Y-03 the focus ring meets 3:1 against what actually sits next to it', async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', TAB_REACHES_LINKS);
  /**
   * SC 1.4.11, measured on the rendered page in both schemes.
   *
   * "Adjacent" depends on `outline-offset`. With a non-zero offset the ring is
   * separated from the control by a gap of PAGE background, so that is the
   * comparison that matters. Only when the offset is 0 does the ring sit
   * directly against the control's own fill.
   *
   * `07` §6.5 already anticipates this: the primary button adds a 1px inner
   * ring in `--bg` so the indicator survives against the accent fill too.
   */
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');

    const total = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select'),
        ].filter((el) => el.getAttribute('tabindex') !== '-1').length,
    );

    for (let i = 0; i < total; i += 1) {
      await page.keyboard.press('Tab');

      const sample = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const s = getComputedStyle(el);
        return {
          label: `${el.tagName}.${el.className}`.slice(0, 40),
          ring: s.outlineColor,
          offset: Number.parseFloat(s.outlineOffset) || 0,
          element: s.backgroundColor,
          page: getComputedStyle(document.body).backgroundColor,
        };
      });

      expect(
        contrastRatio(sample.ring, sample.page),
        `${scheme} ${sample.label}: ring vs page background`,
      ).toBeGreaterThanOrEqual(3);

      if (sample.offset === 0 && sample.element !== 'rgba(0, 0, 0, 0)') {
        expect(
          contrastRatio(sample.ring, sample.element),
          `${scheme} ${sample.label}: ring sits directly on the control`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  }
});

/* ========================================================================== */
/* A11Y-03b — focus is not obscured (SC 2.4.11)                               */
/* ========================================================================== */

for (const route of ROUTES) {
  test(`A11Y-03b ${route}: no focused element is hidden or covered`, async ({ page }) => {
    await page.goto(route);
    const count = (await focusables(page)).length;

    const obscured: string[] = [];
    for (let i = 0; i < count; i += 1) {
      await page.keyboard.press('Tab');
      const problem = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return `${el.id || el.className}: zero-size`;

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return null;

        const top = document.elementFromPoint(cx, cy);
        if (top && top !== el && !el.contains(top) && !top.contains(el)) {
          return `${el.id || el.className}: covered by ${top.tagName}`;
        }
        return null;
      });
      if (problem) obscured.push(problem);
    }

    expect(obscured, route).toEqual([]);
  });
}

/* ========================================================================== */
/* A11Y-04 — text contrast, measured on the rendered page                     */
/* ========================================================================== */

for (const scheme of ['light', 'dark'] as const) {
  test(`A11Y-04 every text node meets 4.5:1 in ${scheme} mode`, async ({ page }) => {
    const failures: string[] = [];

    for (const route of ROUTES) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(route);

      const samples = await page.evaluate(() => {
        function effectiveBackground(el: Element): string {
          let node: Element | null = el;
          while (node) {
            const bg = getComputedStyle(node).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
            node = node.parentElement;
          }
          return 'rgb(255, 255, 255)';
        }

        return [
          ...document.querySelectorAll<HTMLElement>('p, h1, h2, h3, a, li, label, dt, dd, strong'),
        ]
          .filter((el) => (el.textContent ?? '').trim().length > 0)
          .filter((el) => {
            const s = getComputedStyle(el);
            return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0;
          })
          .map((el) => {
            const s = getComputedStyle(el);
            return {
              label: `${el.tagName}.${el.className}`.slice(0, 50),
              colour: s.color,
              background: effectiveBackground(el),
              size: Number.parseFloat(s.fontSize),
              weight: Number(s.fontWeight),
            };
          });
      });

      for (const sample of samples) {
        // SC 1.4.3: large text (>=18.66px bold, or >=24px) needs 3:1.
        const isLarge = sample.size >= 24 || (sample.size >= 18.66 && sample.weight >= 700);
        const required = isLarge ? 3 : 4.5;
        const ratio = contrastRatio(sample.colour, sample.background);
        if (ratio < required) {
          failures.push(`${route} ${sample.label}: ${ratio.toFixed(2)}:1 (needs ${required})`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
}

/* ========================================================================== */
/* A11Y-04b — non-text contrast: form control boundaries (SC 1.4.11)          */
/* ========================================================================== */

for (const scheme of ['light', 'dark'] as const) {
  test(`A11Y-04b form control boundaries meet 3:1 in ${scheme} mode`, async ({ page }) => {
    /**
     * P0 `11` §9 names four combinations as the ones that matter, and `07` §2
     * gives target ratios computed from the token values. Those are targets on
     * paper. This measures what the browser actually painted:
     *
     *   --border-input against --bg,        light and dark
     *   --border-input against --bg-subtle, light and dark
     *
     * A control whose boundary falls below 3:1 is invisible as a control — the
     * user cannot tell where the field is, which is the point of the criterion.
     */
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');

    const samples = await page.evaluate(() => {
      /** Walk up until an element paints an actual background. */
      const behind = (el: HTMLElement): string => {
        let node: HTMLElement | null = el.parentElement;
        while (node) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
          node = node.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };

      return [...document.querySelectorAll<HTMLElement>('input, textarea, select')]
        .filter((el) => {
          /**
           * SC 1.4.11 exempts components whose appearance is determined by the
           * user agent. The consent checkbox is a native control: it sets no
           * border of its own and the browser paints it, tinted by
           * `accent-color`. Its contrast is the browser's to get right, and
           * overriding it would mean building a custom checkbox.
           *
           * Everything else — the text inputs and the textarea — carries a
           * site-authored border and is held to 3:1.
           */
          const type = (el as HTMLInputElement).type;
          return type !== 'checkbox' && type !== 'radio';
        })
        .map((el) => {
          const s = getComputedStyle(el);
          return {
            label: `${el.tagName}#${el.id}`,
            border: s.borderTopColor,
            width: Number.parseFloat(s.borderTopWidth) || 0,
            own: s.backgroundColor,
            surrounding: behind(el),
          };
        });
    });

    expect(samples.length, 'no form controls found on /').toBeGreaterThan(0);

    const failures: string[] = [];
    for (const sample of samples) {
      if (sample.width === 0) {
        failures.push(`${sample.label}: no border to see`);
        continue;
      }
      // Against what is outside the control...
      const outside = contrastRatio(sample.border, sample.surrounding);
      if (outside < 3) failures.push(`${sample.label}: border vs page ${outside.toFixed(2)}:1`);

      // ...and against the control's own fill, which the border also abuts.
      if (sample.own !== 'rgba(0, 0, 0, 0)') {
        const inside = contrastRatio(sample.border, sample.own);
        if (inside < 3) failures.push(`${sample.label}: border vs fill ${inside.toFixed(2)}:1`);
      }
    }

    expect(failures, `${scheme}: control boundaries below 3:1`).toEqual([]);
  });
}

/* ========================================================================== */
/* A11Y-05 / M-7 — reflow at 200%, 300% and 400%                              */
/* ========================================================================== */

// SC 1.4.10 is specified at 400% of a 1280px viewport, i.e. 320 CSS px. The
// intermediate steps are checked because a layout can survive the endpoints and
// break between them.
const ZOOM_WIDTHS = [
  { zoom: '200%', width: 640, height: 512 },
  { zoom: '300%', width: 427, height: 341 },
  { zoom: '400%', width: 320, height: 256 },
] as const;

for (const { zoom, width, height } of ZOOM_WIDTHS) {
  test(`A11Y-05 ${zoom} zoom causes no horizontal scroll or clipping`, async ({ page }) => {
    await page.setViewportSize({ width, height });

    for (const route of ROUTES) {
      await page.goto(route);
      const result = await page.evaluate(() => ({
        overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        widest: Math.max(
          ...[...document.querySelectorAll<HTMLElement>('body *')].map((el) => el.scrollWidth),
        ),
        client: document.documentElement.clientWidth,
      }));

      expect(result.overflows, `${route} at ${zoom} scrolls horizontally`).toBe(false);
      expect(
        result.widest,
        `${route} at ${zoom} has an element wider than the viewport`,
      ).toBeLessThanOrEqual(result.client + 1);
    }
  });
}

/* ========================================================================== */
/* A11Y-06 / M-6 — text-spacing overrides (SC 1.4.12)                          */
/* ========================================================================== */

test('A11Y-06 the WCAG text-spacing overrides clip nothing on any route', async ({ page }) => {
  // The exact values from SC 1.4.12, applied as a user stylesheet would.
  const OVERRIDES = `* { line-height: 1.5 !important;
       letter-spacing: 0.12em !important;
       word-spacing: 0.16em !important; }
     p { margin-block-end: 2em !important; }`;

  await page.setViewportSize({ width: 320, height: 800 });

  for (const route of ROUTES) {
    await page.goto(route);
    await page.addStyleTag({ content: OVERRIDES });

    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('p, h1, h2, h3, a, li, label, dt, dd')]
        .filter((el) => el.clientHeight > 0)
        .filter((el) => {
          /**
           * SC 1.4.12 is about content being LOST, not about a box being
           * overflowed. An element whose overflow is `visible` — the default —
           * paints outside its box and loses nothing, so comparing scroll size
           * against client size there flags a non-problem.
           *
           * P1-M defect H-13: this check did exactly that. Giving `.link` 4px
           * of vertical padding (A11Y-09-3) made the padded inline box taller
           * than its paragraph's line box, and Firefox reported the paragraph
           * as overflowing. Nothing was cut off — the text rendered fine — but
           * `/contact` failed the check in Gecko and passed in Blink and
           * WebKit, which is the signature of measuring the wrong thing.
           *
           * Content is only lost when the box actually clips it.
           */
          const style = getComputedStyle(el);
          const clips = (value: string) => value !== 'visible';

          return (
            (clips(style.overflowY) && el.scrollHeight > el.clientHeight + 1) ||
            (clips(style.overflowX) && el.scrollWidth > el.clientWidth + 1)
          );
        })
        .map((el) => `${el.tagName}.${el.className}`.slice(0, 50)),
    );

    expect(clipped, `${route} clips under text-spacing overrides`).toEqual([]);

    /**
     * The clip check above is necessary but not sufficient: with nothing on
     * this site setting `overflow: hidden`, it would pass vacuously. The
     * failure mode that actually bites at 320px is text growing wider than the
     * viewport once letter- and word-spacing are forced up — content is then
     * unreachable rather than merely overflowing a box.
     */
    const escaped = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      return {
        documentScrolls: document.documentElement.scrollWidth > limit + 1,
        offscreen: [...document.querySelectorAll<HTMLElement>('p, h1, h2, h3, li, label')]
          .filter((el) => el.getBoundingClientRect().right > limit + 1)
          .map((el) => `${el.tagName}.${el.className}`.slice(0, 50)),
      };
    });

    expect(escaped.documentScrolls, `${route} scrolls sideways under text-spacing`).toBe(false);
    expect(escaped.offscreen, `${route} pushes text past the viewport`).toEqual([]);
  }
});

/* ========================================================================== */
/* A11Y-07 — labels, instructions and their associations                      */
/* ========================================================================== */

test('A11Y-07 every control has a visible label and a resolvable description', async ({ page }) => {
  await page.goto('/');

  const problems = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('input, textarea, select')].flatMap((el) => {
      const found: string[] = [];
      const id = el.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;

      if (!label) found.push(`${id || el.tagName}: no <label for>`);
      if (label && !(label.textContent ?? '').trim()) found.push(`${id}: empty label`);
      if (el.hasAttribute('placeholder')) found.push(`${id}: uses a placeholder`);
      if (el.hasAttribute('title')) found.push(`${id}: uses title to convey information`);

      const describedBy = el.getAttribute('aria-describedby');
      if (describedBy) {
        for (const ref of describedBy.split(/\s+/)) {
          if (!document.getElementById(ref))
            found.push(`${id}: aria-describedby -> #${ref} missing`);
        }
      }
      return found;
    }),
  );

  expect(problems).toEqual([]);
});

/* ========================================================================== */
/* A11Y-08 — the status region exists from first render                       */
/* ========================================================================== */

test('A11Y-08 a polite status region is present before any update', async ({ page }) => {
  // `07` §7: regions injected at the moment of the update are unreliably
  // announced, so it must be in the DOM from first render.
  await page.goto('/');
  const region = page.locator('[role="status"]');

  await expect(region).toHaveCount(1);
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toBeEmpty();

  // And it must not be display:none — a hidden live region is not announced.
  const display = await region.evaluate((el) => getComputedStyle(el).display);
  expect(display).not.toBe('none');
});

/* ========================================================================== */
/* A11Y-09 — touch targets                                                    */
/* ========================================================================== */

for (const route of ROUTES) {
  test(`A11Y-09 ${route}: targets meet 24x24, and standalone controls meet 44px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    const targets = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, [role="button"]',
        ),
      ]
        .filter((el) => {
          const s = getComputedStyle(el);
          return s.display !== 'none' && s.visibility !== 'hidden';
        })
        .map((el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);

          /**
           * SC 2.5.8 inline exception: "the target is in a sentence, or its
           * size is otherwise constrained by the line-height of non-target
           * text." A text link flowing inside a paragraph is exactly that, and
           * padding it to 44px would break the line rhythm it sits in.
           */
          const parentText = (el.parentElement?.textContent ?? '').trim();
          const ownText = (el.textContent ?? '').trim();
          const inline = s.display.startsWith('inline') && parentText.length > ownText.length;

          // Anything still laid out as an inline box is flowing in text and
          // cannot be grown vertically without colliding with its neighbours.
          const textFlow = s.display === 'inline';

          /**
           * A labelled checkbox's real target is the box PLUS its label —
           * clicking the label toggles it — so the union of the two is what a
           * user actually has to hit, not the 24px box on its own.
           */
          const isTickBox =
            el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio');
          const label =
            !isTickBox || el.id === ''
              ? null
              : document.querySelector<HTMLElement>(`label[for="${el.id}"]`);
          const union = label
            ? (() => {
                const l = label.getBoundingClientRect();
                return {
                  w: Math.max(r.right, l.right) - Math.min(r.left, l.left),
                  h: Math.max(r.bottom, l.bottom) - Math.min(r.top, l.top),
                };
              })()
            : null;

          return {
            label: `${el.tagName}.${el.className}`.slice(0, 44),
            w: Math.round(union?.w ?? r.width),
            h: Math.round(union?.h ?? r.height),
            inline,
            textFlow,
            // The skip link is off-screen until focused; measured when visible.
            skip: el.classList.contains('skip-link'),
          };
        }),
    );

    const undersized = targets
      .filter((t) => !t.skip && !t.inline && (t.w < 24 || t.h < 24))
      .map((t) => `${t.label} ${t.w}x${t.h}`);
    expect(undersized, `${route}: below the SC 2.5.8 24x24 minimum`).toEqual([]);

    /**
     * `07` §9's 44px applies to the design system's CONTROLS — buttons, nav
     * items, the wordmark link — which all render as flex boxes and can grow
     * freely. It cannot apply to a text link sitting in a line of prose:
     * a 44px inline box would overlap the lines above and below it. Those are
     * held to the 24px WCAG minimum asserted above.
     */
    const belowImplemented = targets
      .filter((t) => !t.skip && !t.textFlow && t.h < 44)
      .map((t) => `${t.label} ${t.w}x${t.h}`);
    expect(belowImplemented, `${route}: control below the 44px 07 §9 implements`).toEqual([]);
  });
}

/* ========================================================================== */
/* A11Y-10 — reduced motion                                                   */
/* ========================================================================== */

test('A11Y-10 reduced motion collapses every transition and disables smooth scroll', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const route of ROUTES) {
    await page.goto(route);

    const scroll = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(scroll, route).toBe('auto');

    // `07` §8 collapses durations to 0.01ms rather than 0, so transitionend
    // still fires. Anything longer means a token was missed.
    const longest = await page.evaluate(() =>
      Math.max(
        0,
        ...[...document.querySelectorAll<HTMLElement>('body *')].flatMap((el) =>
          getComputedStyle(el)
            .transitionDuration.split(',')
            .map((d) => Number.parseFloat(d) * (d.includes('ms') ? 1 : 1000)),
        ),
      ),
    );
    expect(longest, `${route}: a transition survives reduced-motion`).toBeLessThanOrEqual(1);
  }
});

/* ========================================================================== */
/* A11Y-11 / M-3 — forced colours                                              */
/* ========================================================================== */

test('A11Y-11 the page stays usable and bounded under forced-colors', async ({
  browser,
  browserName,
}) => {
  // Playwright emulates `forced-colors: active` in Chromium and Firefox only.
  // In WebKit the option is accepted and does nothing, so the assertions below
  // would be measuring ordinary rendering and calling it high-contrast evidence.
  test.skip(browserName === 'webkit', 'Playwright does not emulate forced-colors in WebKit');
  // Emulation, not real Windows High Contrast — see the header note.
  const context = await browser.newContext({ forcedColors: 'active' });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(route);

    // Content is still there and still laid out.
    await expect(page.locator('h1'), route).toBeVisible();
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflows, `${route} overflows under forced-colors`).toBe(false);

    // Focus is still indicated: forced-colors strips author outlines unless a
    // system colour is used, which `07` §2 requires.
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { width: Number.parseFloat(s.outlineWidth) || 0, style: s.outlineStyle };
    });
    expect(ring.width, `${route}: no focus ring under forced-colors`).toBeGreaterThanOrEqual(1);
    expect(ring.style).not.toBe('none');
  }

  await context.close();
});

/* ========================================================================== */
/* M-8 — the page is usable with CSS disabled                                 */
/* ========================================================================== */

test('M-8 with CSS blocked, content order stays sensible and nothing is lost', async ({
  browser,
}) => {
  // `07` §1: "the page should look correct with CSS partially loaded and remain
  // readable with CSS entirely absent. Semantic HTML order is the fallback."
  const context = await browser.newContext();
  await context.route('**/*.css', (r) => r.abort());
  const page = await context.newPage();

  await page.goto('/');
  // Astro inlines the critical CSS, so also strip every <style> element.
  await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.remove()));

  // Reading order: skip link, wordmark, nav, h1, then the sections.
  const order = await page.evaluate(() =>
    [...document.querySelectorAll('a.skip-link, p.wordmark, nav a, h1, h2')].map((el) =>
      (el.textContent ?? '').trim(),
    ),
  );

  expect(order[0]).toBe(PROVISIONAL.skipLinkText);
  expect(order[1]).toBe(header.wordmark);
  expect(order).toContain(hero.headline);
  expect(order).toContain(principles.heading);
  expect(order).toContain(interest.heading);

  // The form is still operable without styling.
  await expect(page.locator('#work-email')).toBeVisible();
  await expect(page.locator('label[for="work-email"]')).toBeVisible();

  await context.close();
});

/* ========================================================================== */
/* M-9 — every rendered string resolves from the copy module                  */
/* ========================================================================== */

test('M-9 every visible string on every route comes from the copy module', async ({ page }) => {
  /**
   * This is the mechanical half of M-9. It proves rendered output matches
   * `copy.ts` exactly — stronger than a human read, because it is exhaustive
   * and runs on every push.
   *
   * It does NOT discharge the other half: that `copy.ts` matches P0 `04`
   * character for character. `04` is not in this repository (P1-A §3.5 keeps
   * specifications out), so that comparison stays a human read.
   */
  const approved = new Set<string>();

  const collect = (value: unknown): void => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) approved.add(trimmed);
      return;
    }
    if (Array.isArray(value)) return value.forEach(collect);
    if (value && typeof value === 'object') return Object.values(value).forEach(collect);
  };

  collect(copy);
  collect(PROVISIONAL);
  collect(platform);
  collect(principlesPage);
  collect(contact);
  collect(privacy);
  collect(nav);
  collect(notFound);

  const unapproved: string[] = [];

  for (const route of ROUTES) {
    await page.goto(route);

    const rendered: string[] = await page.evaluate(() => {
      const out: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = (node.textContent ?? '').trim();
        if (!text) continue;
        const parent = node.parentElement;
        if (!parent) continue;
        if (parent.closest('script, style')) continue;
        out.push(text);
      }
      return out;
    });

    for (const text of rendered) {
      // A text node may be a fragment of a longer approved string (the contact
      // lead is split around an inline link), so substring containment counts.
      const isApproved = [...approved].some(
        (entry) => entry === text || entry.includes(text) || text.includes(entry),
      );
      // The privacy page renders a lone em dash for the withheld date.
      if (!isApproved && text !== '—' && text !== ':') {
        unapproved.push(`${route}: ${JSON.stringify(text.slice(0, 80))}`);
      }
    }
  }

  expect(unapproved).toEqual([]);
});

/* ========================================================================== */
/* Accessibility tree — the evidence a screen reader consumes                  */
/* ========================================================================== */

for (const route of ROUTES) {
  test(`AT-tree ${route}: title, landmarks and names are correctly exposed`, async ({ page }) => {
    // NOT a screen-reader pass — see the header note. This asserts the roles and
    // accessible names a screen reader would read out, taken from the engine's
    // own accessibility tree via `ariaSnapshot()`.
    await page.goto(route);

    const title = await page.title();
    expect(title.length, `${route}: empty title`).toBeGreaterThan(0);
    expect(title, `${route}: title does not name the product`).toContain('AI Workspace');

    const snapshot = await page.locator('body').ariaSnapshot();
    expect(snapshot.length, `${route}: empty accessibility tree`).toBeGreaterThan(0);

    const count = (role: string) =>
      (snapshot.match(new RegExp(`^\\s*- ${role}[ :"]`, 'gm')) ?? []).length;

    expect(count('banner'), `${route}: expected one banner`).toBe(1);
    expect(count('main'), `${route}: expected one main`).toBe(1);
    expect(count('contentinfo'), `${route}: expected one contentinfo`).toBe(1);

    // Every navigation landmark carries a name, and the names are distinct.
    const navNames = [...snapshot.matchAll(/- navigation "([^"]*)"/g)].map((m) => m[1] ?? '');
    expect(navNames.length, `${route}: no named navigation`).toBeGreaterThanOrEqual(1);
    for (const name of navNames)
      expect(name.trim().length, `${route}: unnamed nav`).toBeGreaterThan(0);
    expect(new Set(navNames).size, `${route}: duplicate navigation names`).toBe(navNames.length);

    // No link exposed without an accessible name.
    expect(snapshot, `${route}: a link has no accessible name`).not.toMatch(/- link:?\s*$/m);
    expect(snapshot, `${route}: a link is named empty`).not.toContain('- link ""');
  });
}

test('AT-tree the active nav item is exposed as the current page', async ({ page }) => {
  for (const path of ['/platform', '/principles', '/contact']) {
    await page.goto(path);
    const current = page.locator('nav[aria-label="Main"] a[aria-current="page"]');
    await expect(current, path).toHaveCount(1);
    await expect(current, path).toHaveAttribute('href', path);
  }
});

test('AT-tree the withheld privacy sections announce nothing confusing', async ({ page }) => {
  // Sections whose bodies are withheld must still read as headings with no
  // content — never as an empty control, and never as a blank landmark.
  await page.goto('/privacy');

  const problems = await page.evaluate(() => {
    const found: string[] = [];
    for (const h of document.querySelectorAll('article.prose > h2')) {
      if (!(h.textContent ?? '').trim()) found.push('empty h2');
      if (h.hasAttribute('tabindex')) found.push(`${h.textContent}: focusable heading`);
      if (h.getAttribute('role')) found.push(`${h.textContent}: heading has a role override`);
    }
    // No empty interactive element anywhere on the page.
    for (const el of document.querySelectorAll('a, button, input')) {
      const name =
        (el.textContent ?? '').trim() ||
        el.getAttribute('aria-label') ||
        (el as HTMLInputElement).labels?.[0]?.textContent ||
        '';
      if (!name.trim()) found.push(`${el.tagName}: interactive element with no name`);
    }
    return found;
  });

  expect(problems).toEqual([]);
});

for (const route of ROUTES) {
  test(`AT-tree ${route}: no heading is followed by an empty section`, async ({ page }) => {
    /**
     * P1-M defect CONTACT-1, frozen as a regression.
     *
     * `/contact` shipped two `h2`s — "General enquiries" and "Where we are" —
     * whose entire bodies were withheld placeholders. On screen that is a gap;
     * to a screen reader it is a heading announced into silence, which reads as
     * a broken page.
     *
     * Withholding content is expected here and will keep happening as legal
     * items resolve. Withholding it and leaving the heading behind is the bug,
     * so the shape is asserted on every route rather than just the one.
     */
    await page.goto(route);

    const empty = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('main h2, main h3')]
        .filter((heading) => {
          // Everything up to the next heading of the same or higher rank.
          const rank = Number(heading.tagName[1]);
          let text = '';
          let node = heading.nextElementSibling;
          while (node) {
            const tag = node.tagName;
            if (/^H[1-6]$/.test(tag) && Number(tag[1]) <= rank) break;
            text += node.textContent ?? '';
            node = node.nextElementSibling;
          }
          return text.trim() === '';
        })
        .map((heading) => (heading.textContent ?? '').trim()),
    );

    if (route === '/privacy') {
      /**
       * `/privacy` is the one deliberate exception, and it is frozen rather
       * than excused.
       *
       * P1-J §9 REQUIRES all twelve `h2`s in P0 order — a heading with a
       * withheld body tells the reader the section exists and tells a reviewer
       * exactly what is missing. The page also must not be published in this
       * state (`06` §7), so no reader is exposed to it.
       *
       * That reasoning does not extend to `/contact`, which IS intended for
       * publication; see CONTACT-1. Listing the three by name means a fourth
       * section quietly emptying out fails this test.
       */
      expect(empty.sort(), '/privacy: the set of withheld sections changed').toEqual([
        'Where your information is held',
        'Who we are',
      ]);

      /**
       * Section 12 "Contact" is not in that list only because the page's back
       * link happens to be the next sibling, so it is not literally empty. Its
       * own body — {{PRIVACY_EMAIL}} — is withheld like the other two.
       *
       * Recorded rather than fixed: moving the back link out of the article
       * would be the semantically correct change, but it alters the structure
       * of an approved page for no reader benefit while the page cannot be
       * published anyway. See known-limitations.md L-7.
       */
      const contactBody = await page.locator('h2#privacy-section-12 + *').first().textContent();
      expect(contactBody?.trim(), 'privacy §12 gained a real body — update L-7').toBe(
        privacy.backLinkText,
      );
      return;
    }

    expect(empty, `${route}: heading(s) with no content beneath them`).toEqual([]);
  });
}

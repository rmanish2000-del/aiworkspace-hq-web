/**
 * ds-evidence.mjs — produces the CC-005 evidence pack from the built gallery.
 *
 *   npm run ds:build && node scripts/ds-evidence.mjs
 *
 * Serves dist-ds/ on a loopback port, then:
 *   - screenshots the gallery light/dark at 375px and 1280px;
 *   - runs a keyboard-only pass (focus visibility on every interactive
 *     element) and measures every interactive target against the 44px floor;
 *   - asserts the reduced-motion build runs zero transform animations;
 * and writes the log to docs/reviews/cc005-evidence/evidence-log.txt.
 * Lighthouse runs separately (see the PR evidence section).
 */
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const OUT = 'docs/reviews/cc005-evidence';
mkdirSync(OUT, { recursive: true });
const log = [];
const note = (line) => {
  log.push(line);
  console.log(line);
};

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
const server = createServer((request, response) => {
  const path = request.url.split('?')[0];
  try {
    const body = readFileSync(join('dist-ds', path.replace(/^\//, '')));
    response.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'text/plain' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(4610, '127.0.0.1', resolve));
const URL_DS = 'http://127.0.0.1:4610/_ds.html';

const browser = await chromium.launch();

/* --- Screenshot pairs ------------------------------------------------------ */
for (const scheme of ['light', 'dark']) {
  for (const width of [375, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: scheme,
    });
    const page = await context.newPage();
    await page.goto(URL_DS, { waitUntil: 'networkidle' });
    // Full-page capture: force every section rendered and revealed, so the
    // evidence shows the components rather than lazy-layout blanks. Motion is
    // evidenced separately.
    await page.evaluate(() => {
      for (const sectionEl of document.querySelectorAll('.ds-section')) {
        sectionEl.style.contentVisibility = 'visible';
      }
      for (const el of document.querySelectorAll('.ds-reveal')) el.classList.add('is-in');
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/gallery-${width}-${scheme}.png`, fullPage: true });
    note(`screenshot: gallery-${width}-${scheme}.png`);
    await context.close();
  }
}

/* --- Keyboard-only pass + 44px targets ------------------------------------- */
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(URL_DS, { waitUntil: 'networkidle' });

  const targets = await page.evaluate(() => {
    const interactive = [
      ...document.querySelectorAll('a, button, input, summary, [tabindex]:not([tabindex="-1"])'),
    ];
    return interactive.map((el) => {
      const box = el.getBoundingClientRect();
      return {
        label: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${
          el.className.toString().split(' ')[0]
        }`,
        w: Math.round(box.width),
        h: Math.round(box.height),
        hidden: box.width === 0 && box.height === 0,
      };
    });
  });
  const visible = targets.filter((t) => !t.hidden);
  const small = visible.filter((t) => t.h < 44 && t.w < 44 && !t.label.startsWith('a.'));
  note(`targets: ${visible.length} interactive elements measured`);
  for (const t of small) note(`  UNDER 44px: ${t.label} ${t.w}x${t.h}`);
  if (small.length === 0) note('  all non-inline targets >= 44px in at least one dimension');

  let focusFailures = 0;
  for (let i = 0; i < visible.length + 2; i += 1) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        label: `${el.tagName.toLowerCase()}.${el.className.toString().split(' ')[0]}`,
        outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0,
      };
    });
    if (state && !state.outline) {
      focusFailures += 1;
      note(`  NO VISIBLE FOCUS: ${state.label}`);
    }
  }
  note(
    focusFailures === 0
      ? 'keyboard pass: every focused element painted a visible ring'
      : `keyboard pass: ${focusFailures} element(s) without a visible ring`,
  );
  await context.close();
}

/* --- Reduced-motion pass ---------------------------------------------------- */
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(URL_DS, { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => {
    const transformAnimations = document.getAnimations().filter((a) => {
      const frames = a.effect && a.effect.getKeyframes ? a.effect.getKeyframes() : [];
      return frames.some((f) => 'transform' in f && f.transform !== 'none');
    });
    return {
      motionArmed: document.documentElement.dataset.motion === 'on',
      transformAnimations: transformAnimations.length,
      revealHidden: [...document.querySelectorAll('.ds-reveal')].filter(
        (el) => getComputedStyle(el).opacity !== '1',
      ).length,
    };
  });
  note(
    `reduced motion: observer armed=${result.motionArmed} · transform animations running=${result.transformAnimations} · hidden reveal elements=${result.revealHidden}`,
  );
  if (result.motionArmed || result.transformAnimations > 0 || result.revealHidden > 0) {
    note('  REDUCED-MOTION FAILURE');
    process.exitCode = 1;
  } else {
    note('  page renders assembled with zero transform animation');
  }
  await context.close();
}

await browser.close();
server.close();
writeFileSync(`${OUT}/evidence-log.txt`, `${log.join('\n')}\n`);
console.log(`\nevidence written to ${OUT}/`);

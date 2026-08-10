/**
 * ds-gates.mjs — the six CC-004 §9 design-system gates, plus the CC-005
 * DS-D2 holding-page baseline and the gallery-exclusion assertion.
 *
 *   npm run ds:gates          (also wired into verify:release)
 *
 * Reproduces the 38-pair contrast table CC-004 §2 pre-verified: every value is
 * COMPUTED here from src/design-system/tokens.css — nothing is assumed, and a
 * failure anywhere exits non-zero.
 *
 * Requires dist/ to exist (run `npm run build` first); builds the gallery to
 * dist-ds/ itself.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const failures = [];
let checks = 0;

function section(title) {
  console.log(`\n━━ ${title}`);
}

function assert(ok, label) {
  checks += 1;
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failures.push(label);
}

/* -------------------------------------------------------------------------- */
/* Color math — WCAG 2.x relative luminance and contrast                      */
/* -------------------------------------------------------------------------- */

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const lin = (channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(hexA, hexB) {
  const [hi, lo] = [luminance(hexToRgb(hexA)), luminance(hexToRgb(hexB))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** `--g-veil` — a stop at `alpha` composited over the background. */
function composite(stopHex, bgHex, alpha) {
  const stop = hexToRgb(stopHex);
  const bg = hexToRgb(bgHex);
  const mixed = stop.map((channel, i) => Math.round(alpha * channel + (1 - alpha) * bg[i]));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

/* -------------------------------------------------------------------------- */
/* Token file parsing                                                         */
/* -------------------------------------------------------------------------- */

const TOKENS_PATH = 'src/design-system/tokens.css';
const tokensCss = readFileSync(TOKENS_PATH, 'utf8');

function blockAfter(source, marker) {
  const at = source.indexOf(marker);
  if (at === -1) throw new Error(`token block not found: ${marker}`);
  const open = source.indexOf('{', at);
  let depth = 1;
  for (let i = open + 1; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error(`unbalanced block: ${marker}`);
}

function props(block) {
  const map = {};
  for (const match of block
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    map[match[1]] = match[2].replace(/\s+/g, ' ').trim();
  }
  return map;
}

const light = props(blockAfter(tokensCss, ':root {'));
const darkExplicit = props(blockAfter(tokensCss, ":root[data-theme='dark']"));
const darkMedia = props(blockAfter(tokensCss, ":root:not([data-theme='light'])"));

/* -------------------------------------------------------------------------- */
/* Theme-block agreement — the duplicated dark block must not drift           */
/* -------------------------------------------------------------------------- */

section('Theme blocks');
{
  const keys = new Set([...Object.keys(darkExplicit), ...Object.keys(darkMedia)]);
  const drifted = [...keys].filter((key) => darkExplicit[key] !== darkMedia[key]);
  assert(
    drifted.length === 0,
    `the two dark declarations are identical (${keys.size} tokens)${
      drifted.length ? ` — drift in: ${drifted.join(', ')}` : ''
    }`,
  );
}
const dark = darkExplicit;

/* -------------------------------------------------------------------------- */
/* G-C1 — the declared pair table, both themes, both bg levels                */
/* -------------------------------------------------------------------------- */

section('G-C1 · contrast — computed from the token file, nothing assumed');
const table = [];

function pair(name, fgHex, bgHex, min) {
  const ratio = contrast(fgHex, bgHex);
  table.push({ name, fgHex, bgHex, ratio, min });
  assert(ratio >= min, `${name}  ${ratio.toFixed(2)}:1  (needs ${min}:1)`);
}

for (const [theme, t] of [
  ['light', light],
  ['dark', dark],
]) {
  // Text pairs — >=4.5:1 (WCAG 1.4.3).
  pair(`${theme} · fg on bg`, t.fg, t.bg, 4.5);
  pair(`${theme} · fg on bg-subtle`, t.fg, t['bg-subtle'], 4.5);
  pair(`${theme} · fg-muted on bg`, t['fg-muted'], t.bg, 4.5);
  pair(`${theme} · fg-muted on bg-subtle`, t['fg-muted'], t['bg-subtle'], 4.5);
  pair(`${theme} · verdigris on bg`, t.verdigris, t.bg, 4.5);
  pair(`${theme} · iris on bg`, t.iris, t.bg, 4.5);
  pair(`${theme} · saffron on bg`, t.saffron, t.bg, 4.5);
  pair(`${theme} · danger on bg`, t.danger, t.bg, 4.5);
  pair(`${theme} · on-hue on verdigris`, t['on-hue'], t.verdigris, 4.5);
  pair(`${theme} · on-hue on iris`, t['on-hue'], t.iris, 4.5);
  pair(`${theme} · on-hue on saffron`, t['on-hue'], t.saffron, 4.5);
  pair(`${theme} · on-hue on danger`, t['on-hue'], t.danger, 4.5);

  // UI boundaries — >=3:1 (WCAG 1.4.11, the P1-C defect class).
  pair(`${theme} · border-input vs bg`, t['border-input'], t.bg, 3);
  pair(`${theme} · border-input vs bg-subtle`, t['border-input'], t['bg-subtle'], 3);
  pair(`${theme} · border-strong vs bg`, t['border-strong'], t.bg, 3);

  // Focus ring — verdigris against the page (CC-004 §2.2).
  pair(`${theme} · focus ring vs bg`, t.verdigris, t.bg, 3);
}

/* -------------------------------------------------------------------------- */
/* G-C2 — gradient worst-stop, and the veil composited                        */
/* -------------------------------------------------------------------------- */

section('G-C2 · gradient worst-stop (no averaging)');

function gradientStops(tokenName) {
  const value = light[tokenName] ?? '';
  const stops = value.match(/#[0-9a-f]{6}/gi);
  if (!stops || stops.length < 2) throw new Error(`${tokenName}: could not parse two stops`);
  return stops;
}

// Text on these gradients is --on-gradient, which stays light in BOTH themes
// because the stops are shared (CC-004 §2.3 verifies white at every stop).
// Tested per theme: the CC-004 table's 4 stop rows plus their dark-theme
// counterparts.
for (const [theme, t] of [
  ['light', light],
  ['dark', dark],
]) {
  for (const token of ['g-thesis', 'g-evidence']) {
    for (const stop of gradientStops(token)) {
      pair(`${theme} · --${token} stop ${stop} vs on-gradient text`, t['on-gradient'], stop, 4.5);
    }
  }
}

// --g-veil: each thesis stop at 8% over the page bg, then body text on it.
const veilAlpha = 0.08;
for (const [theme, t] of [
  ['light', light],
  ['dark', dark],
]) {
  const worst = gradientStops('g-thesis')
    .map((stop) => composite(stop, t.bg, veilAlpha))
    .map((composited) => ({ composited, ratio: contrast(t.fg, composited) }))
    .sort((a, b) => a.ratio - b.ratio)[0];
  pair(`${theme} · fg on --g-veil composited (${worst.composited})`, t.fg, worst.composited, 4.5);
}

console.log(`\n  pair table: ${table.length} pairs computed, ${failures.length} failing`);

/* -------------------------------------------------------------------------- */
/* Build the gallery, then the built-output gates                             */
/* -------------------------------------------------------------------------- */

section('Gallery build (dist-ds/)');
// Invoke the repository-pinned binary directly. `npx` may attempt a registry
// lookup even when the dependency is installed, making an offline release gate
// depend on network availability.
execSync('node_modules/.bin/astro build --config scripts/ds-gallery.config.mjs', {
  stdio: 'pipe',
});
const galleryPath = join('dist-ds', '_ds.html');
assert(existsSync(galleryPath), 'dist-ds/_ds.html built');
const gallery = readFileSync(galleryPath, 'utf8');

/* --- G-M — reduced-motion build has zero transform transitions ------------ */

section('G-M · reduced motion');
{
  const css = [...gallery.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');

  /** Split CSS into segments inside/outside no-preference media blocks. */
  function outsideNoPreference(source) {
    let out = '';
    let i = 0;
    while (i < source.length) {
      const at = source.indexOf('@media', i);
      if (at === -1) {
        out += source.slice(i);
        break;
      }
      out += source.slice(i, at);
      const open = source.indexOf('{', at);
      const header = source.slice(at, open);
      let depth = 1;
      let j = open + 1;
      while (j < source.length && depth > 0) {
        if (source[j] === '{') depth += 1;
        if (source[j] === '}') depth -= 1;
        j += 1;
      }
      const body = source.slice(open + 1, j - 1);
      if (/prefers-reduced-motion:\s*no-preference/.test(header)) {
        // Skipped: this block never applies under reduce.
      } else {
        out += ` ${body} `;
      }
      i = j;
    }
    return out;
  }

  const reducedBuild = outsideNoPreference(css);

  const transformTransitions = [
    ...reducedBuild.matchAll(/transition[^;{}]*transform[^;{}]*[;}]/g),
    // Every DS keyframe lives inside no-preference, so any animation that
    // survives reduce is a failure — except the explicit kill `none`.
    ...reducedBuild.matchAll(/animation[^;{}]*[;}]/g),
  ].filter((m) => !/:\s*none/.test(m[0]));

  assert(
    transformTransitions.length === 0,
    `zero transform transitions / animations outside no-preference blocks${
      transformTransitions.length ? ` — found ${transformTransitions.length}` : ''
    }`,
  );
  assert(
    !/html\s*{[^}]*scroll-behavior:\s*smooth/.test(reducedBuild),
    'no smooth scroll outside no-preference',
  );
}

/* --- G-P — CC-004 §9 budgets on the built gallery -------------------------- */

section('G-P · budgets (P0 08 §8 arithmetic, motion JS included)');
{
  const gz = gzipSync(readFileSync(galleryPath)).length;
  assert(gz <= 60 * 1024, `gallery page ${(gz / 1024).toFixed(1)} KB gzipped <= 60 KB`);

  const inlineJs = [
    ...gallery.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g),
  ]
    .map((m) => m[1])
    .join('');
  const externalJs = readdirSync('dist-ds', { recursive: true })
    .filter((f) => String(f).endsWith('.js'))
    .map((f) => readFileSync(join('dist-ds', String(f))))
    .reduce((sum, buf) => sum + buf.length, 0);
  const jsBytes = Buffer.byteLength(inlineJs) + externalJs;
  assert(jsBytes <= 10 * 1024, `JavaScript ${(jsBytes / 1024).toFixed(2)} KB <= 10 KB`);

  const requests =
    1 + [...gallery.matchAll(/<(?:script[^>]+src|link[^>]+href|img[^>]+src)="[^"]+"/g)].length;
  assert(requests <= 6, `${requests} request(s) on first load <= 6`);
}

/* --- G-F — zero web fonts --------------------------------------------------- */

section('G-F · fonts');
{
  assert(!/@font-face/i.test(gallery), 'no @font-face in the gallery');
  assert(!/fonts\.(?:googleapis|gstatic)\.com/i.test(gallery), 'no font origin in the gallery');
  const fontFiles = readdirSync('dist-ds', { recursive: true }).filter((f) =>
    /\.(woff2?|ttf|otf)$/.test(String(f)),
  );
  assert(fontFiles.length === 0, 'no font file in dist-ds/');
}

/* --- G-T — every tier badge resolves to §6 tokens --------------------------- */

section('G-T · tier encoding');
{
  const badge = readFileSync('src/design-system/components/TierBadge.astro', 'utf8');
  for (const tier of ['verified', 'approved', 'reported', 'under-design', 'gated']) {
    assert(badge.includes(`ds-tier--${tier}`), `tier "${tier}" is defined`);
  }
  assert(/ds-tier--verified\s*{[^}]*var\(--verdigris\)/.test(badge), 'verified -> --verdigris');
  assert(/ds-tier--approved\s*{[^}]*var\(--iris\)/.test(badge), 'approved -> --iris');
  assert(/ds-tier--gated\s*{[^}]*var\(--saffron\)/.test(badge), 'gated -> --saffron');
  assert(/ds-tier--under-design\s*{[^}]*dashed/.test(badge), 'under-design -> dashed outline');

  // No ad-hoc tier styling anywhere: outside tokens.css, the design system
  // carries no color literal at all.
  const offenders = readdirSync('src/design-system', { recursive: true })
    .map(String)
    .filter((f) => /\.(astro|css)$/.test(f) && !f.endsWith('tokens.css'))
    .filter((f) => /#[0-9a-f]{3,8}\b/i.test(readFileSync(join('src/design-system', f), 'utf8')));
  assert(
    offenders.length === 0,
    `no color literal outside tokens.css${offenders.length ? ` — ${offenders.join(', ')}` : ''}`,
  );
}

/* --- CC-005 §OUT-OF-SCOPE — no prohibited term in the rendered gallery ------ */

section('G-4 (gallery) · prohibited terms in the rendered page');
{
  // The mechanical floor from tests/unit/copy.test.ts, applied to what the
  // gallery actually renders. The unit test remains the source of the list.
  const terms = [
    'AI Workspace HQ',
    'ProjectOS',
    'TradeOS',
    'EduOS',
    'UrjaOps',
    'Legal Engineering',
    'control plane',
    'execution contract',
    'operating system',
    'AI OS',
    'autonomous',
    'secure by default',
    'compliant',
    'certified',
    'audited',
    'SOC 2',
    'generally available',
    'in production',
    'production-ready',
    'launched',
    'live',
    'customers',
    'clients',
    'users',
    'trusted by',
    'seamless',
    'effortless',
    'revolutionary',
    'world-class',
    'no-code',
    'pricing',
    'roadmap',
  ];
  const text = gallery
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const hits = terms.filter((term) =>
    new RegExp(
      `(?<![\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`,
      'iu',
    ).test(text),
  );
  assert(
    hits.length === 0,
    `rendered gallery carries no prohibited term${hits.length ? ` — ${hits.join(', ')}` : ''}`,
  );
}

/* --- DS-D2 — the holding page is byte-identical ----------------------------- */

section('DS-D2 · holding page unchanged (dist/ vs recorded baseline)');
{
  const baselinePath = 'scripts/ds-baseline/holding-page.json';
  assert(existsSync('dist'), 'dist/ exists (run npm run build first)');
  const { hashes } = JSON.parse(readFileSync(baselinePath, 'utf8'));
  for (const [file, expected] of Object.entries(hashes)) {
    const actual = createHash('sha256')
      .update(readFileSync(join('dist', file)))
      .digest('hex');
    assert(actual === expected, `dist/${file} matches the recorded baseline`);
  }
}

/* --- CC-005 scope 5 — no gallery artifact in the production build ------------ */

section('Gallery exclusion');
{
  const leaked = readdirSync('dist', { recursive: true }).filter((f) => String(f).includes('_ds'));
  assert(leaked.length === 0, 'dist/ contains no _ds artifact');
  const js = readdirSync('dist', { recursive: true }).filter((f) => String(f).endsWith('.js'));
  assert(js.length === 0, 'dist/ still ships zero JavaScript files');
}

/* -------------------------------------------------------------------------- */

console.log(
  `\n${failures.length === 0 ? 'ALL DESIGN-SYSTEM GATES PASS' : 'GATE FAILURES'} — ${checks} checks, ${failures.length} failed\n`,
);
if (failures.length > 0) process.exit(1);

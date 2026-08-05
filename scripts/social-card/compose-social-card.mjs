/**
 * compose-social-card.mjs — one terminal capture in, two exports out.
 *
 *   node scripts/social-card/compose-social-card.mjs \
 *     --capture assets/deny-capture.png \
 *     --clause-source-px 44
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ RUN LOCALLY; THE OUTPUT IS COMMITTED.                                     │
 * │                                                                           │
 * │ Same rule as generate-assets.mjs, for the same reason: rasterisation      │
 * │ depends on the machine, so committing the PNG makes the asset reviewable  │
 * │ in a diff and keeps CI free of a browser-and-font dependency.             │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * No design tool in the loop. Playwright (already a devDependency, used by the
 * e2e suite) rasterises `card.html` at 2× device scale; sharp (already present
 * as a build-time dependency of the framework) downsamples to the exported
 * size. Neither is a new dependency and neither runs in CI.
 *
 * What this script refuses to do, each because the spec says so:
 *
 *  - It defines no colour. The three roles come from `social-card.config.json`,
 *    and the preferred form names a token in `src/design-system/tokens.css`,
 *    which the script parses. A raw hex is accepted but warns loudly, because
 *    a colour that lives only in a config is a colour outside the design system.
 *
 *  - It never touches the capture's pixels beyond scaling it down to its
 *    placement box. No tint, no filter, no recolour. §1.6: "as captured".
 *
 *  - It fails, rather than warns, when the capture is smaller than 2× its
 *    placement box. §1.7 item 3 disqualifies an upscaled take, so an upscaled
 *    take is an error, not a note in the log.
 *
 * The clause-type check. §1.4 sets a 32 px floor on the clause text at 1200 px
 * wide, and §1.7 item 5 says to test it rather than estimate it. The clause
 * text lives inside the capture, so its size cannot be read back out of a PNG
 * without OCR. Pass `--clause-source-px` — the font size you set in the
 * terminal before capturing — and the script reports what it becomes after
 * placement, and fails below the floor. Without the flag it reports the
 * placement scale and says plainly that the floor was not checked.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import process from 'node:process';
import sharp from 'sharp';
import { chromium } from '@playwright/test';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const TEMPLATE = resolve(HERE, 'card.html');
const CONFIG = resolve(HERE, 'social-card.config.json');
const TOKEN_FILES = [
  // The file the pages actually load (src/styles/global.css imports it).
  resolve(REPO, 'src', 'styles', 'tokens.css'),
  // The newer design-system layer. Searched second: it is where --verdigris and
  // --saffron live, and they are not in the file above.
  resolve(REPO, 'src', 'design-system', 'tokens.css'),
];

/** Every number below is read from the spec. None is rounded. */
const SPEC = {
  card: {
    // §1.4
    name: 'og-1200x630',
    out: 'public/warrant-mcp/og-1200x630.png',
    width: 1200,
    height: 630,
    margin: 72,
    contentWidth: 1056,
    contentHeight: 486,
    placeWidth: 1056,
    frameRadius: 8,
    frameBorder: 1,
    ruleHeight: 3,
    ruleLength: 96,
    caption: 'warrant-mcp — the rule that refused it, named.',
    // §1.4 clause-text floor, stated at 1200 px wide.
    clauseFloor: 32,
  },
  square: {
    // §1.5 — "Not a crop of the card. A separate export from the same capture."
    name: 'square-1080',
    out: 'public/warrant-mcp/square-1080.png',
    width: 1080,
    height: 1080,
    margin: 64,
    contentWidth: 952,
    contentHeight: 952,
    placeWidth: 952,
    frameRadius: 8,
    frameBorder: 1,
    ruleHeight: 3,
    ruleLength: 96,
    caption: null, // §1.5: "Omit."
    // §1.5: "Same absolute minimums as above, i.e. clause text >= 32 px at 1080 wide."
    clauseFloor: 32,
  },
};

/** §1.4: exported at 2× and downsampled. */
const SCALE = 2;

const fail = (message) => {
  process.stderr.write(`\ncompose-social-card: ${message}\n\n`);
  process.exit(1);
};

function parseArgs(argv) {
  const args = { capture: null, clauseSourcePx: null, only: null, allowUpscale: false };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === '--capture') {
      args.capture = value;
      i += 1;
    } else if (flag === '--clause-source-px') {
      args.clauseSourcePx = Number(value);
      i += 1;
    } else if (flag === '--only') {
      args.only = value;
      i += 1;
    } else if (flag === '--allow-upscale') {
      args.allowUpscale = true;
    } else {
      fail(
        `unknown argument "${flag}".\n` +
          '  --capture <path>            the terminal PNG (required)\n' +
          '  --clause-source-px <n>      clause-text size set in the terminal before capture\n' +
          '  --only card|square          render one export instead of both\n' +
          '  --allow-upscale             place a capture smaller than 2x anyway',
      );
    }
  }
  return args;
}

/**
 * Resolve a colour role. A token name is looked up in the site's own token
 * file, so the card cannot drift from the site; a raw hex is allowed but says
 * so, loudly, every run.
 */
async function resolveColours() {
  if (!existsSync(CONFIG)) {
    fail(
      `no colour config at ${CONFIG}.\n` +
        'Copy social-card.config.example.json to social-card.config.json and fill in the\n' +
        'three roles from §1.6 — deep green (matte), brass (rule + hairline), paper white\n' +
        '(caption). Naming a token from src/styles/tokens.css or src/design-system/tokens.css beats a hex.\n' +
        'Nothing is rendered without them: the spec forbids inventing a colour here.',
    );
  }
  const config = JSON.parse(await readFile(CONFIG, 'utf8'));

  /*
   * There are two token files in this repo and they do not agree. The pages
   * load `src/styles/tokens.css` (via global.css); `src/design-system/tokens.css`
   * is the newer layer, and it is the only one that has --verdigris and
   * --saffron. Both are searched, in that order, and the file a token came from
   * is printed — a card built from a token the pages do not load would sit next
   * to a site that never shows that colour.
   */
  const sources = [];
  for (const file of TOKEN_FILES) {
    if (existsSync(file)) sources.push({ file, css: await readFile(file, 'utf8') });
  }
  if (sources.length === 0) fail('no token file found; expected src/styles/tokens.css.');

  const roles = ['matte', 'brass', 'paper'];
  const resolved = {};
  for (const role of roles) {
    const value = config[role];
    if (typeof value !== 'string' || value.trim() === '') {
      fail(`social-card.config.json is missing the "${role}" colour role.`);
    }
    if (value.startsWith('--')) {
      // Take the FIRST definition, which is the :root/light block. A dark-mode
      // override would give a card that contradicts the one it sits beside.
      let found = null;
      for (const source of sources) {
        const match = new RegExp(`${value}\\s*:\\s*([^;]+);`).exec(source.css);
        if (match) {
          found = { value: match[1].trim(), file: source.file };
          break;
        }
      }
      if (!found) {
        fail(
          `"${role}" names token ${value}, which is defined in none of:\n` +
            sources.map((s) => `  ${s.file}`).join('\n') +
            '\nAdd it to a token file first — a colour the site does not have is a new colour.',
        );
      }
      resolved[role] = found.value;
      resolved[`${role}__source`] = found.file;
    } else {
      resolved[role] = value.trim();
      process.stderr.write(
        `  ! "${role}" is a literal (${resolved[role]}) rather than a token from tokens.css.\n` +
          '    It will render, but it lives outside the design system and can drift from it.\n`',
      );
    }
  }
  resolved.floorException = config.floorException ?? null;
  return resolved;
}

async function render(browser, variant, captureDataUrl, captureWidth, colours) {
  const s = SPEC[variant];

  /*
   * §1.7 item 3 — an upscaled capture is a disqualified take, not a warning, so
   * this refuses by default and the default is the spec's position.
   *
   * `--allow-upscale` exists because a founder may knowingly decide that a soft
   * card which exists beats a perfect one that does not. It is an override, not
   * a relaxation: it never becomes the default, it says out loud what it is
   * placing and by what factor, and the clause-type report below still measures
   * the result against the 32 px floor and still exits non-zero under it. The
   * take stays disqualified; this only lets you look at it.
   */
  const required = s.placeWidth * SCALE;
  if (captureWidth < required) {
    const why =
      `the capture is ${captureWidth} px wide; ${s.name} places it at ${s.placeWidth} px, so it ` +
      `needs at least ${required} px (2x). Upscaling softens every glyph, and §1.7 item 3 ` +
      'disqualifies exactly that. Re-capture at a higher resolution — set the terminal font ' +
      'size larger before capturing, do not scale afterwards.';
    if (!args.allowUpscale) fail(`${why}\n\nPass --allow-upscale to place it anyway.`);
    process.stderr.write(
      `\n  ! UPSCALED — ${s.name} places the capture ${(required / captureWidth).toFixed(2)}x beyond its own\n` +
        `    resolution. Disqualified under §1.7 item 3. ${why}\n\n`,
    );
  }

  const page = await browser.newPage({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: SCALE,
  });

  await page.goto(pathToFileURL(TEMPLATE).href);

  await page.evaluate(
    ({ spec, colours: c, dataUrl }) => {
      const root = document.documentElement;
      const set = (name, value) => root.style.setProperty(name, value);
      set('--canvas-w', `${spec.width}px`);
      set('--canvas-h', `${spec.height}px`);
      set('--margin', `${spec.margin}px`);
      set('--place-w', `${spec.placeWidth}px`);
      set('--frame-radius', `${spec.frameRadius}px`);
      set('--frame-border', `${spec.frameBorder}px`);
      set('--rule-h', `${spec.ruleHeight}px`);
      set('--rule-len', `${spec.ruleLength}px`);
      set('--rule-gap', `${Math.round(spec.margin / 3)}px`);
      set('--caption-gap', `${Math.round(spec.margin / 3)}px`);
      set('--caption-size', '22px');
      set(
        '--caption-font',
        'ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono", Consolas, monospace',
      );
      set('--matte', c.matte);
      set('--brass', c.brass);
      set('--paper', c.paper);
      // §1.4: "None, or a single soft shadow at <= 12% opacity."
      set('--frame-shadow', '0 2px 10px rgb(0 0 0 / 10%)');

      const img = document.getElementById('capture');
      img.src = dataUrl;

      const caption = document.getElementById('caption');
      if (spec.caption) caption.textContent = spec.caption;
      else caption.hidden = true;
    },
    { spec: s, colours, dataUrl: captureDataUrl },
  );

  await page.locator('#capture').waitFor({ state: 'visible' });

  // Measure before shooting: the spec's own disqualifier is content crossing
  // the safe margin, so the numbers get read off the live layout, not assumed.
  const measured = await page.evaluate((margin) => {
    const box = document.querySelector('.content').getBoundingClientRect();
    const frame = document.querySelector('.frame').getBoundingClientRect();
    const caption = document.getElementById('caption');
    const capHidden = caption.hidden;
    const capBox = capHidden ? null : caption.getBoundingClientRect();
    return {
      frameWidth: frame.width,
      frameHeight: frame.height,
      contentTop: box.top + margin,
      contentBottom: box.bottom - margin,
      frameTop: frame.top,
      frameBottom: frame.bottom,
      captionWidth: capBox ? capBox.width : null,
      captionRight: capBox ? capBox.right : null,
      safeRight: box.right - margin,
    };
  }, s.margin);

  if (
    measured.frameTop < measured.contentTop - 0.5 ||
    measured.frameBottom > measured.contentBottom + 0.5
  ) {
    fail(
      `${s.name}: the terminal block overflows the ${s.margin} px safe margin ` +
        `(top ${measured.frameTop.toFixed(1)}, bottom ${measured.frameBottom.toFixed(1)}, ` +
        `safe ${measured.contentTop.toFixed(1)}–${measured.contentBottom.toFixed(1)}).\n` +
        'The capture is too tall for its box. Re-capture with fewer blank lines, or a\n' +
        'narrower terminal so the same content is shorter. §1.7 item 2.',
    );
  }
  if (measured.captionRight !== null && measured.captionRight > measured.safeRight + 0.5) {
    fail(
      `${s.name}: the caption crosses the safe margin. §1.4 allows dropping it — do that first.`,
    );
  }

  const shot = await page.screenshot({ type: 'png' });
  await page.close();

  const out = resolve(REPO, s.out);
  await mkdir(dirname(out), { recursive: true });
  await sharp(shot)
    .resize(s.width, s.height, { fit: 'fill', kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(out);

  return { spec: s, measured, out, capturedAt: `${s.width * SCALE}×${s.height * SCALE}` };
}

const args = parseArgs(process.argv.slice(2));
if (!args.capture) {
  fail('--capture <path> is required. It is the one terminal PNG the card is built from.');
}
const capturePath = resolve(REPO, args.capture);
if (!existsSync(capturePath)) {
  fail(`no capture at ${capturePath}. §1.1: the terminal is captured, never recreated.`);
}

const captureBuffer = await readFile(capturePath);
const meta = await sharp(captureBuffer).metadata();
if (!meta.width || !meta.height) fail(`could not read image dimensions from ${capturePath}.`);

const colours = await resolveColours();
const captureDataUrl = `data:image/png;base64,${captureBuffer.toString('base64')}`;

process.stdout.write(
  `\n  capture   ${args.capture}  ${meta.width}×${meta.height}\n` +
    `  matte     ${colours.matte}\n  brass     ${colours.brass}\n  paper     ${colours.paper}\n\n`,
);

const browser = await chromium.launch();
const variants = args.only ? [args.only] : ['card', 'square'];
const results = [];
try {
  for (const variant of variants) {
    if (!SPEC[variant]) fail(`--only expects "card" or "square", not "${variant}".`);
    results.push(await render(browser, variant, captureDataUrl, meta.width, colours));
  }
} finally {
  await browser.close();
}

/*
 * The report. The clause-type line is the point of it: §1.7 item 5 says to
 * test the floor rather than estimate it, and this is the number that lets a
 * human do that without opening the PNG in something that measures pixels.
 */
let floorBreached = false;
for (const { spec, measured, out, capturedAt } of results) {
  const scale = spec.placeWidth / meta.width;
  process.stdout.write(`  ${spec.name}\n`);
  process.stdout.write(`    written            ${out}\n`);
  process.stdout.write(
    `    rendered at        ${capturedAt} → downsampled to ${spec.width}×${spec.height}\n`,
  );
  process.stdout.write(
    `    placement scale    ${scale.toFixed(4)}×  (capture ${meta.width} px → ${spec.placeWidth} px)\n`,
  );
  process.stdout.write(
    `    terminal block     ${measured.frameWidth.toFixed(0)}×${measured.frameHeight.toFixed(0)} px inside a ${spec.contentWidth}×${spec.contentHeight} content box\n`,
  );

  if (Number.isFinite(args.clauseSourcePx) && args.clauseSourcePx > 0) {
    const rendered = args.clauseSourcePx * scale;
    const verdict = rendered >= spec.clauseFloor ? 'OK' : 'BELOW FLOOR';
    process.stdout.write(
      `    clause text        ${rendered.toFixed(1)} px rendered ` +
        `(source ${args.clauseSourcePx} px × ${scale.toFixed(4)}) — floor ${spec.clauseFloor} px — ${verdict}\n`,
    );
    if (rendered < spec.clauseFloor) floorBreached = true;
  } else {
    process.stdout.write(
      `    clause text        NOT CHECKED — pass --clause-source-px <n> (the size you set in\n` +
        `                       the terminal before capturing) and this prints the rendered size\n` +
        `                       against the ${spec.clauseFloor} px floor.\n`,
    );
  }
  process.stdout.write('\n');
}

/*
 * A recorded, capture-specific acceptance of the §1.4 floor. It never silences
 * the measurement — the shortfall is printed above on every run — it only stops
 * the non-zero exit, and only for the exact capture the config names.
 */
const accepted = colours.floorException;
const acceptedHere =
  accepted &&
  accepted.captureWidth === meta.width &&
  accepted.captureHeight === meta.height &&
  accepted.acceptedClausePx === args.clauseSourcePx;

if (floorBreached && acceptedHere) {
  process.stdout.write(
    '  FLOOR SHORTFALL ACCEPTED — founder decision of record, recorded in\n' +
      '  social-card.config.json against this capture only. A different capture\n' +
      '  invalidates it and the refusal returns.\n\n',
  );
} else if (floorBreached) {
  fail(
    'the clause text renders below the 32 px floor. §1.4: anything below the floor is\n' +
      'unreadable where the card is actually seen, and an unreadable line is worse than\n' +
      'an absent one. §1.5 says what to do — re-capture at a narrower terminal width so\n' +
      'the line breaks at a word, rather than shrinking the type.',
  );
}

process.stdout.write(
  '  Reminder — this script cannot check §1.3. No absolute path, username, machine name,\n' +
    '  token, 16-digit run, scrollback or identity-carrying window chrome may be in frame.\n' +
    '  That is a human reading the capture at 200%, and it is the one gate with no code.\n\n',
);

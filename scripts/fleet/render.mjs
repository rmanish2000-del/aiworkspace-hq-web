/**
 * Renders a fleet view to one self-contained HTML document
 * (FOUNDER-DASHBOARD-HTML, 2026-08-21).
 *
 * Phone first. The founder reads this on a phone, and the two questions he
 * reads it to answer — "is anything blocked?" and "is anything waiting on me?"
 * — are answered above everything else, before the seat list, in words.
 *
 * COLOUR IS REDUNDANT, EVERYWHERE. Every status carries three non-colour
 * channels as well: the status WORD, a glyph, and a border shape (solid /
 * doubled / dashed / dotted). Printed in greyscale, or read by a screen reader,
 * or seen by someone who cannot distinguish red from green, the surface says
 * exactly the same thing. The glyphs are `aria-hidden` because the word beside
 * them already carries the meaning — announcing "black circle" would be noise.
 *
 * NOTHING IS INVENTED. A field the source does not carry renders as an explicit
 * "not in source" marker, never as an empty cell and never as a plausible
 * guess. A status word the parser does not recognise is shown verbatim and
 * labelled unrecognised.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..');

/** The site's real tokens — including its dark-mode block, which comes free. */
function siteTokens() {
  return readFileSync(join(REPO, 'src', 'styles', 'tokens.css'), 'utf8');
}

export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** The one way this page is allowed to say "the source did not say". */
function missing(what) {
  return `<span class="missing">not in source${what ? ` (${esc(what)})` : ''}</span>`;
}

const SEVERITY = {
  blocked: { glyph: '▲', word: 'BLOCKED' },
  working: { glyph: '●', word: 'WORKING' },
  idle: { glyph: '○', word: 'IDLE' },
  unclassified: { glyph: '◆', word: 'UNRECOGNISED STATUS' },
};

function chip(severity, statusText) {
  const mark = SEVERITY[severity] ?? SEVERITY.unclassified;
  const verbatim =
    statusText && statusText.toUpperCase() !== mark.word
      ? ` <span class="chip__verbatim">${esc(statusText)}</span>`
      : '';
  return (
    `<p class="chip chip--${severity}">` +
    `<span class="chip__glyph" aria-hidden="true">${mark.glyph}</span>` +
    `<span class="chip__word">${mark.word}</span>${verbatim}</p>`
  );
}

function seatCard(seat, columns) {
  const rows = columns
    .map((column, index) => {
      if (index === 0) return '';
      if (column.toLowerCase() === 'status') return '';
      const value = seat.cells[index];
      return (
        `<div class="pair"><dt>${esc(column)}</dt>` +
        `<dd>${value === null || value === undefined ? missing('') : esc(value)}</dd></div>`
      );
    })
    .join('');

  return (
    `<li class="seat seat--${seat.severity}">` +
    `<h3 class="seat__name">${esc(seat.seat)}</h3>` +
    chip(seat.severity, seat.status) +
    `<dl class="seat__fields">${rows}</dl></li>`
  );
}

function bannerFounderAction(text) {
  if (!text) {
    return (
      `<section class="banner banner--quiet" aria-labelledby="fa">` +
      `<h2 id="fa"><span aria-hidden="true">⚑</span> Founder action</h2>` +
      `<p>${missing('the source carries no "Founder action" line')}</p></section>`
    );
  }
  return (
    `<section class="banner banner--action" aria-labelledby="fa">` +
    `<h2 id="fa"><span aria-hidden="true">⚑</span> FOUNDER ACTION REQUIRED</h2>` +
    `<p class="banner__body">${esc(text)}</p></section>`
  );
}

function bannerBlocked(seats) {
  const blocked = seats.filter((seat) => seat.severity === 'blocked');
  if (blocked.length === 0) {
    return (
      `<section class="banner banner--clear" aria-labelledby="bl">` +
      `<h2 id="bl"><span aria-hidden="true">✓</span> No seat reports BLOCKED</h2>` +
      `<p class="banner__body">Every status line in this snapshot classified as ` +
      `working, idle or unrecognised.</p></section>`
    );
  }
  const list = blocked
    .map(
      (seat) =>
        `<li><strong>${esc(seat.seat)}</strong> — ${seat.status ? esc(seat.status) : missing('')}</li>`,
    )
    .join('');
  return (
    `<section class="banner banner--blocked" aria-labelledby="bl">` +
    `<h2 id="bl"><span aria-hidden="true">▲</span> BLOCKED — ${blocked.length} seat${
      blocked.length === 1 ? '' : 's'
    }</h2><ul class="banner__list">${list}</ul></section>`
  );
}

function totalsBlock(dashboard) {
  const raw = dashboard.fields.find((entry) =>
    entry.label.toLowerCase().startsWith('portfolio total'),
  );
  if (!raw) {
    return `<section class="panel" aria-labelledby="to"><h2 id="to">Portfolio totals</h2><p>${missing(
      '',
    )}</p></section>`;
  }
  if (!dashboard.totals) {
    // Parsed shape did not hold — show the line as written rather than a
    // half-read row of numbers.
    return (
      `<section class="panel" aria-labelledby="to"><h2 id="to">Portfolio totals</h2>` +
      `<p class="verbatim">${esc(raw.value.replace(/\*\*/g, ''))}</p>` +
      `<p class="note">Shown verbatim: this line is not in the expected ` +
      `"label <strong>n</strong>" shape.</p></section>`
    );
  }
  const items = dashboard.totals
    .map(
      (total) =>
        `<div class="total"><dt>${esc(total.label)}</dt><dd>${esc(total.value)}</dd></div>`,
    )
    .join('');
  return (
    `<section class="panel" aria-labelledby="to"><h2 id="to">Portfolio totals</h2>` +
    `<dl class="totals">${items}</dl></section>`
  );
}

function textPanel(id, heading, value) {
  return (
    `<section class="panel" aria-labelledby="${id}"><h2 id="${id}">${esc(heading)}</h2>` +
    `<p>${value ? esc(value) : missing('')}</p></section>`
  );
}

function evidenceBlock(dashboard) {
  const raw = dashboard.fields.find((entry) => entry.label.toLowerCase().startsWith('evidence'));
  if (!raw) {
    return `<section class="panel" aria-labelledby="ev"><h2 id="ev">Evidence grades</h2><p>${missing(
      '',
    )}</p></section>`;
  }
  if (!dashboard.evidence) {
    return (
      `<section class="panel" aria-labelledby="ev"><h2 id="ev">Evidence grades</h2>` +
      `<p class="verbatim">${esc(raw.value)}</p></section>`
    );
  }
  const items = dashboard.evidence
    .map(
      (grade) =>
        `<div class="pair"><dt>${esc(grade.label)}</dt><dd>${
          grade.value ? esc(grade.value) : missing('')
        }</dd></div>`,
    )
    .join('');
  return (
    `<section class="panel" aria-labelledby="ev"><h2 id="ev">Evidence grades</h2>` +
    `<dl class="evidence">${items}</dl></section>`
  );
}

function shell(bodyHtml, { stale = false } = {}) {
  return `<!doctype html>
<html lang="en" data-stale="${stale ? 'yes' : 'no'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<title>Fleet — internal${stale ? ' — STALE' : ''}</title>
<style>${siteTokens()}${PAGE_CSS}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<main id="main">
${bodyHtml}
</main>
</body>
</html>
`;
}

function sourceLine(view) {
  const stated = view.dashboard.statedTimestamp;
  const claim = stated.raw
    ? `<strong>${esc(stated.raw)}</strong>`
    : missing('no timestamp line in the document');
  const basis =
    view.age.basis === 'stated'
      ? 'measured from the timestamp the source states'
      : `measured from the file's last-modified time, because the stated timestamp could not be read (${esc(
          stated.reason ?? 'no reason recorded',
        )})`;
  // The path belongs in the footer, not here: on a phone it is three lines of
  // monospace between the founder and the two facts he opened this to read.
  return (
    `<p class="source">Source says: ${claim}<br>` +
    `<strong>${esc(view.age.label)}</strong> — ${basis}.</p>`
  );
}

function staleBand(view) {
  if (!view.stale) {
    return (
      `<p class="band band--fresh"><span aria-hidden="true">●</span> ` +
      `FRESH — ${esc(view.age.label)}, under the one-hour limit.</p>`
    );
  }
  return (
    `<p class="band band--stale" role="status"><span aria-hidden="true">▲</span> ` +
    `STALE — this snapshot is ${esc(view.age.label)}. It is NOT live. ` +
    `Treat every line below as the last known state, not the current one.</p>`
  );
}

function failure(kind, heading, detail, extra = '') {
  return shell(
    `<p class="band band--stale" role="status"><span aria-hidden="true">▲</span> ` +
      `NO USABLE SNAPSHOT — nothing below is fleet status.</p>` +
      `<h1>Fleet</h1>` +
      `<section class="banner banner--blocked" aria-labelledby="fail">` +
      `<h2 id="fail"><span aria-hidden="true">▲</span> ${esc(heading)}</h2>` +
      `<p class="banner__body">${esc(detail)}</p>${extra}` +
      `<p class="note">This page renders one Drive document and holds no state of ` +
      `its own. Until that document can be read, it has nothing to show — and it ` +
      `says so rather than showing a blank page.</p></section>` +
      footer(kind, null),
    { stale: true },
  );
}

function footer(note, path = null) {
  return (
    `<footer class="foot"><p><a class="refresh" href="/">Re-read the source</a></p>` +
    `<p>Read at ${esc(new Date().toISOString())} · re-read on every request · ` +
    `renderer only, no second status system · state: ${esc(note)}</p>` +
    (path ? `<p class="path">${esc(path)}</p>` : '') +
    `</footer>`
  );
}

/**
 * @param {ReturnType<import('./source.mjs').buildView>} view
 * @returns {string} a complete HTML document
 */
export function renderFleetPage(view) {
  if (view.state === 'unreachable') {
    return failure('unreachable', 'The source folder could not be reached', view.detail);
  }
  if (view.state === 'missing') {
    return failure('missing', 'The source document is not there', view.detail);
  }
  if (view.state === 'malformed') {
    return failure(
      'malformed',
      'The source document could not be parsed',
      view.reason,
      `<p class="note">First 400 characters, as read:</p><pre class="excerpt">${esc(
        view.excerpt,
      )}</pre>`,
    );
  }

  const dashboard = view.dashboard;
  const get = (prefix) => {
    const found = dashboard.fields.find((entry) => entry.label.toLowerCase().startsWith(prefix));
    return found ? found.value.replace(/\*\*/g, '') : null;
  };

  const body =
    staleBand(view) +
    `<h1>${esc(dashboard.title ?? 'Fleet')}</h1>` +
    sourceLine(view) +
    bannerFounderAction(get('founder action')) +
    bannerBlocked(dashboard.seats) +
    totalsBlock(dashboard) +
    textPanel('nm', 'Next milestone', get('next milestone')) +
    `<section class="panel" aria-labelledby="se"><h2 id="se">Seats (${dashboard.seats.length})</h2>` +
    `<ul class="seats">${dashboard.seats
      .map((seat) => seatCard(seat, dashboard.columns))
      .join('')}</ul></section>` +
    textPanel('mo', 'Momentum since last run', get('momentum')) +
    evidenceBlock(dashboard) +
    footer(view.stale ? 'stale' : 'fresh', view.path);

  return shell(body, { stale: view.stale });
}

/**
 * Phone-first CSS over the site's own tokens.
 *
 * Base size is 1rem — the founder should never pinch to read a status. The
 * layout is one column until the viewport can honestly hold two, which is also
 * what makes landscape work without a separate rule.
 */
const PAGE_CSS = `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font-sans);
 font-size:1rem;line-height:var(--leading-body);-webkit-text-size-adjust:100%}
main{max-width:60rem;margin:0 auto;padding:var(--space-4) var(--space-4) var(--space-9)}
h1{font-size:var(--type-h2);line-height:var(--leading-h2);margin:var(--space-4) 0 var(--space-2)}
h2{font-size:var(--type-h3);line-height:var(--leading-h3);margin:0 0 var(--space-3)}
h3{font-size:1rem;margin:0 0 var(--space-2)}
p{margin:0 0 var(--space-3)}
.skip{position:absolute;left:-9999px}
.skip:focus{left:var(--space-3);top:var(--space-3);position:fixed;background:var(--bg);
 color:var(--fg);padding:var(--space-3);border:2px solid var(--fg);z-index:99}
.band{margin:0 0 var(--space-4);padding:var(--space-3) var(--space-4);font-weight:var(--weight-semibold);
 border-radius:var(--radius-sm)}
.band--stale{background:var(--danger);color:var(--accent-fg);border:3px double var(--fg);
 text-transform:uppercase;letter-spacing:.02em}
.band--fresh{background:var(--bg-subtle);color:var(--fg);border:1px solid var(--border)}
.source{color:var(--fg-muted);font-size:var(--type-small);line-height:1.5}
.path{word-break:break-all;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.banner{margin:0 0 var(--space-5);padding:var(--space-4);border-radius:var(--radius-sm)}
.banner--action{border:4px solid var(--danger);background:var(--band-wash)}
.banner--action h2{font-size:var(--type-h3);letter-spacing:.02em}
.banner--blocked{border:3px double var(--danger);background:var(--band-wash)}
.banner--clear,.banner--quiet{border:1px solid var(--border);background:var(--bg-subtle)}
.banner__body{margin:0;font-size:1.0625rem}
.banner__list{margin:0;padding-left:1.25em}
.banner__list li{margin-bottom:var(--space-2)}
.panel{margin:0 0 var(--space-6)}
.totals{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:var(--space-3);margin:0}
.total{border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-3)}
.total dt{font-size:var(--type-small);color:var(--fg-muted)}
.total dd{margin:0;font-size:var(--type-h3);font-weight:var(--weight-semibold)}
.seats{list-style:none;margin:0;padding:0;display:grid;gap:var(--space-4)}
.seat{border:1px solid var(--border);border-left-width:.5rem;border-left-style:solid;
 border-radius:var(--radius-sm);padding:var(--space-4)}
.seat--blocked{border-color:var(--danger);border-style:double;border-left-style:solid;border-width:3px;border-left-width:.75rem}
.seat--working{border-left-color:var(--success);border-left-style:solid}
.seat--idle{border-left-color:var(--fg-muted);border-left-style:dashed}
.seat--unclassified{border-left-color:var(--action);border-left-style:dotted}
.seat__name{font-weight:var(--weight-semibold);letter-spacing:.01em}
.chip{display:flex;flex-wrap:wrap;align-items:baseline;gap:.4em;margin:0 0 var(--space-3);
 font-size:var(--type-small);font-weight:var(--weight-semibold)}
.chip__word{letter-spacing:.04em}
.chip__verbatim{font-weight:var(--weight-regular);color:var(--fg-muted)}
.chip--blocked .chip__glyph{color:var(--danger)}
.chip--working .chip__glyph{color:var(--success)}
.chip--idle .chip__glyph{color:var(--fg-muted)}
.chip--unclassified .chip__glyph{color:var(--action)}
.seat__fields,.evidence{margin:0;display:grid;gap:var(--space-3)}
.pair dt{font-size:var(--type-small);color:var(--fg-muted);text-transform:uppercase;letter-spacing:.06em}
.pair dd{margin:0}
.missing{color:var(--fg-muted);font-style:italic;border-bottom:1px dotted currentColor}
.verbatim{white-space:pre-wrap}
.note{font-size:var(--type-small);color:var(--fg-muted)}
.excerpt{white-space:pre-wrap;word-break:break-word;font-size:var(--type-small);
 background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-3)}
.foot{margin-top:var(--space-8);padding-top:var(--space-4);border-top:1px solid var(--border);
 font-size:var(--type-small);color:var(--fg-muted)}
.refresh{display:inline-block;min-height:44px;line-height:44px;padding:0 var(--space-4);
 border:1px solid var(--border-strong);border-radius:var(--radius-sm);color:var(--fg);font-size:1rem}
a:focus-visible,.refresh:focus-visible{outline:var(--focus-ring-width) solid var(--action);
 outline-offset:var(--focus-ring-offset)}
@media (min-width:48rem){
 main{padding:var(--space-6) var(--space-6) var(--space-10)}
 h1{font-size:var(--type-h1);line-height:var(--leading-h1)}
 .seats{grid-template-columns:repeat(2,minmax(0,1fr))}
 .seat--blocked{grid-column:1/-1}
}
@media print{.band--stale{border:3px solid #000}}
`;

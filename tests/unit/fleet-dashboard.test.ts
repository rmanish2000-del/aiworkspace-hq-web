/**
 * FOUNDER-DASHBOARD-HTML (2026-08-21) — the fleet dashboard renderer.
 *
 * The dashboard's whole value is that it does not lie about fleet state, so
 * these tests are mostly about the ways a status page CAN lie: showing a stale
 * snapshot as current, showing an empty cell where the source said nothing,
 * folding an unknown status into a familiar one, or rendering a blank page when
 * the source cannot be read.
 *
 * Every fixture here is written for the test. Nothing asserts against the real
 * Drive document — that file changes every few minutes, and a test pinned to it
 * would be a clock, not a gate.
 */
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  ageOf,
  classifyStatus,
  describeAge,
  isStale,
  parseFleetDashboard,
  parseStatedTimestamp,
  STALE_AFTER_MS,
} from '../../scripts/fleet/parse.mjs';
import { renderFleetPage } from '../../scripts/fleet/render.mjs';
import { buildView, readFleetSource, SOURCE_TITLE } from '../../scripts/fleet/source.mjs';

/* -------------------------------------------------------------------------- */
/* Fixtures                                                                   */
/* -------------------------------------------------------------------------- */

const FIXTURE = `# Founder Fleet Dashboard

**21 अगस्त 2026 · 09:28 IST · LAW-VERSION 9**

| Seat | Current assignment | Status | Latest verified progress | Waiting for |
|---|---|---|---|---|
| ALPHA | Orchestration | Working | Pass verified | Next evidence |
| BRAVO | Clock audit | Signed—unclaimed | Sole active assignment | Engine and claim |
| CHARLIE | Bridge lane | Blocked | Bridge absent | Bridge recovery |
| DELTA | Retention policy | Sideways | Something new | |

**Momentum since last run:** Two claims recorded.

**Portfolio totals:** Working **1** · Blocked **1** · Unclaimed **2**

**Next milestone:** the applier dry-run proof.

**Founder action:** Restore budget on one supported wake engine.

**Evidence note:** VERIFIED—Drive folder state. REPORTED—engine diagnosis. ASSUMED—none.
`;

/**
 * A second snapshot in a DIFFERENT vocabulary — other seats, other column
 * headings, other status words, no evidence note. Between the two real
 * snapshots read while building this feature, all of that changed within half
 * an hour, so the parser is asserted against change rather than against one
 * shape.
 */
const OTHER_VOCABULARY = `# Fleet

**21 August 2026 · 11:00 IST**

| Desk | Job | Status | Blocking |
|---|---|---|---|
| Ops | Rotate keys | In progress | — |
| Legal | Filing | Idle | Counsel |

**Founder action:** Sign the filing.
`;

function withSource(text: string | null, title: string = SOURCE_TITLE): string {
  const dir = mkdtempSync(join(tmpdir(), 'fleet-'));
  if (text !== null) writeFileSync(join(dir, title), text, 'utf8');
  return dir;
}

const AT = (iso: string) => new Date(iso);
/** 09:28 IST on 2026-08-21 is 03:58 UTC. */
const STATED_UTC = '2026-08-21T03:58:00.000Z';

/* -------------------------------------------------------------------------- */
/* Parsing — read the document, never improve on it                           */
/* -------------------------------------------------------------------------- */

describe('fleet.parse', () => {
  it('reads seats, columns and fields out of the document rather than a fixed list', () => {
    const parsed = parseFleetDashboard(FIXTURE);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.dashboard.columns).toEqual([
      'Seat',
      'Current assignment',
      'Status',
      'Latest verified progress',
      'Waiting for',
    ]);
    expect(parsed.dashboard.seats.map((seat) => seat.seat)).toEqual([
      'ALPHA',
      'BRAVO',
      'CHARLIE',
      'DELTA',
    ]);
    expect(parsed.dashboard.title).toBe('Founder Fleet Dashboard');
  });

  it('parses a snapshot with entirely different seats, columns and status words', () => {
    const parsed = parseFleetDashboard(OTHER_VOCABULARY);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.dashboard.columns).toEqual(['Desk', 'Job', 'Status', 'Blocking']);
    expect(parsed.dashboard.seats.map((seat) => seat.seat)).toEqual(['Ops', 'Legal']);
    expect(parsed.dashboard.seats.map((seat) => seat.severity)).toEqual(['working', 'idle']);
    // No evidence note in this snapshot: absent, not invented.
    expect(parsed.dashboard.evidence).toBeNull();
  });

  it('records an empty cell as absent rather than as an empty string', () => {
    const parsed = parseFleetDashboard(FIXTURE);
    if (!parsed.ok) throw new Error('fixture must parse');
    const delta = parsed.dashboard.seats.find((seat) => seat.seat === 'DELTA');
    expect(delta?.cells[4]).toBeNull();
  });

  it('splits the totals line into the labels the source used', () => {
    const parsed = parseFleetDashboard(FIXTURE);
    if (!parsed.ok) throw new Error('fixture must parse');
    expect(parsed.dashboard.totals).toEqual([
      { label: 'Working', value: '1' },
      { label: 'Blocked', value: '1' },
      { label: 'Unclaimed', value: '2' },
    ]);
  });

  it('splits the evidence note into the grades the source used', () => {
    const parsed = parseFleetDashboard(FIXTURE);
    if (!parsed.ok) throw new Error('fixture must parse');
    expect(parsed.dashboard.evidence?.map((grade) => grade.label)).toEqual([
      'VERIFIED',
      'REPORTED',
      'ASSUMED',
    ]);
  });

  it.each([
    ['no table', '# Fleet\n\nJust prose, no table at all.\n'],
    ['header but no rows', '# Fleet\n\n| Seat | Status |\n|---|---|\n\nnothing\n'],
    ['empty file', '   \n'],
  ])('refuses to parse a malformed source: %s', (_label, text) => {
    const parsed = parseFleetDashboard(text);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.reason.length).toBeGreaterThan(10);
  });
});

/* -------------------------------------------------------------------------- */
/* Status semantics — IDLE is not softened, BLOCKED wins                      */
/* -------------------------------------------------------------------------- */

describe('fleet.status', () => {
  it.each([
    ['Blocked', 'blocked'],
    ['Blocked—invalid tag', 'blocked'],
    ['Working', 'working'],
    ['Working—partial', 'working'],
    ['Working—claimed', 'working'],
    ['In progress', 'working'],
    ['Unclaimed', 'idle'],
    ['Signed—unclaimed', 'idle'],
    ['Issued—awaiting signer', 'idle'],
    ['Manual-only', 'idle'],
    ['None', 'idle'],
    ['Idle', 'idle'],
  ])('classifies %s as %s', (status, severity) => {
    expect(classifyStatus(status)).toBe(severity);
  });

  it('never folds an unknown status into a familiar one', () => {
    expect(classifyStatus('Sideways')).toBe('unclassified');
    expect(classifyStatus('Marinating')).toBe('unclassified');
    expect(classifyStatus(null)).toBe('unclassified');
  });

  it('keeps a signature separate from a claim — "signed" alone is not working', () => {
    // The distinction the founder reads this page for: an assignment that has
    // been signed but not claimed is nobody's work yet.
    expect(classifyStatus('Signed—unclaimed')).not.toBe('working');
  });
});

/* -------------------------------------------------------------------------- */
/* Time — the source's claim, our observation, and the one-hour line          */
/* -------------------------------------------------------------------------- */

describe('fleet.time', () => {
  it('reads an IST timestamp written with a Hindi month name', () => {
    expect(parseStatedTimestamp(FIXTURE).iso).toBe(STATED_UTC);
  });

  it('reads the same timestamp written in English', () => {
    expect(parseStatedTimestamp('**21 August 2026 · 09:28 IST**').iso).toBe(STATED_UTC);
  });

  it.each([
    ['unknown month', '**21 Smarch 2026 · 09:28 IST**', 'unrecognised month name'],
    ['no time', '**21 August 2026 · IST**', 'HH:MM IST'],
    ['no timestamp line at all', '# Fleet\n\nnothing here\n', 'no line containing a time'],
  ])('says why it could not read a timestamp: %s', (_label, text, fragment) => {
    const stated = parseStatedTimestamp(text);
    expect(stated.iso).toBeNull();
    expect(stated.reason).toContain(fragment);
  });

  it('is fresh one minute under the hour and stale exactly on it', () => {
    const iso = STATED_UTC;
    const justUnder = new Date(new Date(iso).getTime() + STALE_AFTER_MS - 60_000);
    const exactly = new Date(new Date(iso).getTime() + STALE_AFTER_MS);
    expect(isStale(ageOf(iso, 'stated', justUnder))).toBe(false);
    expect(isStale(ageOf(iso, 'stated', exactly))).toBe(true);
  });

  it('treats a future timestamp as stale rather than as very fresh', () => {
    const future = new Date(new Date(STATED_UTC).getTime() - 10 * 60_000);
    const age = ageOf(STATED_UTC, 'stated', future);
    expect(isStale(age)).toBe(true);
    expect(age.label).toContain('future');
  });

  it('describes an age in words a phone screen can hold', () => {
    expect(describeAge(30_000)).toBe('under a minute old');
    expect(describeAge(60_000)).toBe('1 minute old');
    expect(describeAge(45 * 60_000)).toBe('45 minutes old');
    expect(describeAge(3 * 3_600_000)).toBe('3 hours old');
    expect(describeAge(3 * 3_600_000 + 12 * 60_000)).toBe('3h 12m old');
    expect(describeAge(50 * 3_600_000)).toBe('2 days 2h old');
  });
});

/* -------------------------------------------------------------------------- */
/* Source resolution — folder + title, and the three ways it can fail         */
/* -------------------------------------------------------------------------- */

describe('fleet.source', () => {
  it('resolves the document by folder and title', () => {
    const source = readFleetSource(withSource(FIXTURE));
    expect(source.kind).toBe('read');
    if (source.kind !== 'read') return;
    expect(source.text).toContain('Founder Fleet Dashboard');
  });

  it('reports MISSING and names what the folder does hold', () => {
    const dir = withSource(FIXTURE, 'FOUNDER-FLEET-DASHBOARD-OLD.md');
    const source = readFleetSource(dir);
    expect(source.kind).toBe('missing');
    if (source.kind !== 'missing') return;
    expect(source.detail).toContain('FOUNDER-FLEET-DASHBOARD-OLD.md');
  });

  it('reports UNREACHABLE when the folder itself cannot be listed', () => {
    const source = readFleetSource(join(tmpdir(), 'fleet-no-such-folder-98217'));
    expect(source.kind).toBe('unreachable');
  });

  it('never throws, whatever it is pointed at', () => {
    expect(() => readFleetSource('')).not.toThrow();
    expect(() => readFleetSource(tmpdir(), '')).not.toThrow();
  });

  it('falls back to the file mtime when the stated timestamp is unreadable', () => {
    const dir = withSource(FIXTURE.replace('अगस्त', 'Smarch'));
    const view = buildView(readFleetSource(dir), new Date());
    expect(view.state).toBe('ok');
    if (view.state !== 'ok') return;
    expect(view.age.basis).toBe('file-mtime');
  });
});

/* -------------------------------------------------------------------------- */
/* Rendering — the four source states, and colour as a redundant channel      */
/* -------------------------------------------------------------------------- */

const viewFrom = (text: string, now: Date) => buildView(readFleetSource(withSource(text)), now);
const fresh = () => viewFrom(FIXTURE, AT('2026-08-21T04:10:00.000Z'));
const stale = () => viewFrom(FIXTURE, AT('2026-08-21T09:58:00.000Z'));

describe('fleet.render', () => {
  it('renders a fresh snapshot without claiming more than it knows', () => {
    const html = renderFleetPage(fresh());
    expect(html).toContain('FRESH');
    expect(html).not.toContain('STALE —');
    expect(html).toContain('data-stale="no"');
    expect(html).toContain('12 minutes old');
  });

  it('says STALE across the whole surface once the snapshot is an hour old', () => {
    const html = renderFleetPage(stale());
    expect(html).toContain('data-stale="yes"');
    expect(html).toContain('STALE');
    expect(html).toContain('It is NOT live');
    expect(html).toContain('<title>Fleet — internal — STALE</title>');
    // The band is announced, not merely coloured.
    expect(html).toContain('role="status"');
  });

  it('puts the founder action where it cannot be missed', () => {
    const html = renderFleetPage(fresh());
    expect(html).toContain('FOUNDER ACTION REQUIRED');
    expect(html).toContain('Restore budget on one supported wake engine.');
    // Above the seat list, which is the only ordering claim that matters.
    expect(html.indexOf('FOUNDER ACTION REQUIRED')).toBeLessThan(html.indexOf('Seats ('));
  });

  it('names every blocked seat in its own banner', () => {
    const html = renderFleetPage(fresh());
    expect(html).toContain('BLOCKED — 1 seat');
    expect(html).toContain('<strong>CHARLIE</strong>');
  });

  it('says so plainly when no seat is blocked, rather than showing nothing', () => {
    const html = renderFleetPage(viewFrom(OTHER_VOCABULARY, AT('2026-08-21T05:31:00.000Z')));
    expect(html).toContain('No seat reports BLOCKED');
  });

  it('carries every status in text and shape, not colour alone', () => {
    const html = renderFleetPage(fresh());
    for (const word of ['BLOCKED', 'WORKING', 'IDLE', 'UNRECOGNISED STATUS']) {
      expect(html).toContain(word);
    }
    for (const cls of [
      'seat--blocked',
      'seat--working',
      'seat--idle',
      'seat--unclassified',
      'chip__glyph',
    ]) {
      expect(html).toContain(cls);
    }
    // Each severity has its own border STYLE, so greyscale still separates them.
    for (const rule of [
      '.seat--working{border-left-color:var(--success);border-left-style:solid}',
      '.seat--idle{border-left-color:var(--fg-muted);border-left-style:dashed}',
      '.seat--unclassified{border-left-color:var(--action);border-left-style:dotted}',
    ]) {
      expect(html).toContain(rule);
    }
  });

  it('shows an unrecognised status verbatim beside the label', () => {
    const html = renderFleetPage(fresh());
    expect(html).toContain('UNRECOGNISED STATUS');
    expect(html).toContain('Sideways');
  });

  it('marks a missing cell as missing instead of leaving it blank', () => {
    const html = renderFleetPage(fresh());
    expect(html).toContain('not in source');
  });

  it('says so when the source carries no founder-action line', () => {
    const html = renderFleetPage(
      viewFrom(FIXTURE.replace(/\*\*Founder action:\*\*.*\n/, ''), AT('2026-08-21T04:10:00.000Z')),
    );
    expect(html).toContain('no &quot;Founder action&quot; line');
    expect(html).not.toContain('FOUNDER ACTION REQUIRED');
  });

  it.each([
    ['unreachable', join(tmpdir(), 'fleet-no-such-folder-98217'), 'could not be reached'],
    ['missing', withSource(null), 'is not there'],
  ])('renders a readable failure page for a %s source', (_label, dir, fragment) => {
    const html = renderFleetPage(buildView(readFleetSource(dir), new Date()));
    expect(html).toContain('NO USABLE SNAPSHOT');
    expect(html).toContain(fragment);
    // Never a blank page: the failure page is a full document with a heading.
    expect(html).toContain('<h1>Fleet</h1>');
    expect(html.length).toBeGreaterThan(1000);
  });

  it('renders a readable failure page for a malformed source, with what it read', () => {
    const html = renderFleetPage(
      buildView(readFleetSource(withSource('# Fleet\n\nno table here\n')), new Date()),
    );
    expect(html).toContain('could not be parsed');
    expect(html).toContain('no markdown table was found');
    expect(html).toContain('no table here');
  });

  it('escapes the source instead of trusting it', () => {
    const hostile = FIXTURE.replace('ALPHA', '<script>alert(1)</script>');
    const html = renderFleetPage(viewFrom(hostile, AT('2026-08-21T04:10:00.000Z')));
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('is phone-first and marked never-index', () => {
    const html = renderFleetPage(fresh());
    expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1"');
    expect(html).toContain('noindex, nofollow, noarchive, nosnippet, noimageindex');
    // One column by default; two only once the viewport can hold them.
    expect(html).toContain('@media (min-width:48rem)');
    // Base type is never below 16px, so nothing needs pinching.
    expect(html).toContain('font-size:1rem');
  });

  it('uses the site design tokens rather than a second palette', () => {
    const html = renderFleetPage(fresh());
    const tokens = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');
    expect(html).toContain(tokens.slice(0, 200));
    // Dark mode comes from the site's own tokens, not from a bespoke rule.
    expect(html).toContain('prefers-color-scheme: dark');
  });
});

/* -------------------------------------------------------------------------- */
/* Publication boundary — this must never reach the deployed site             */
/* -------------------------------------------------------------------------- */

describe('fleet.boundary', () => {
  it('adds no route to the published surface', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
      );
    const pages = walk(join(process.cwd(), 'src', 'pages'));
    expect(pages.filter((file) => /fleet|internal|dashboard/i.test(file))).toEqual([]);
  });

  it('is not importable from the published surface', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
      );
    const offenders = walk(join(process.cwd(), 'src')).filter((file) =>
      /scripts\/fleet|fleet-dashboard/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });

  it('binds to loopback only, and says why in the file that does it', () => {
    const server = readFileSync(join(process.cwd(), 'scripts/fleet-dashboard.mjs'), 'utf8');
    expect(server).toContain("const HOST = '127.0.0.1'");
    expect(server).not.toContain('0.0.0.0');
    expect(existsSync(join(process.cwd(), 'scripts/fleet-dashboard.mjs'))).toBe(true);
  });
});

/**
 * Parser for the founder fleet dashboard (FOUNDER-DASHBOARD-HTML, 2026-08-21).
 *
 * The canonical status document is written elsewhere, by another seat, into
 * Google Drive. This module is a RENDERER's parser and nothing else: it turns
 * that markdown into a structure, and it is forbidden to improve on it.
 *
 * Three rules follow from "never infer or invent":
 *
 *   1. Nothing is hard-coded from the current snapshot. Seat names, column
 *      headings, status wording, the totals labels and the evidence grades all
 *      come OUT of the document. Between the two snapshots read while building
 *      this (08:58 and 09:28 IST on 2026-08-21) a seat disappeared, another was
 *      renamed, and four new status words appeared — a parser that knew the
 *      vocabulary would have silently lied about all of it.
 *   2. An absent cell parses to `null`, which the page renders as visibly
 *      missing. An empty string and "not stated" are not the same thing.
 *   3. A status word this module does not recognise is `unclassified`, shown
 *      verbatim and flagged as unrecognised — never quietly folded into the
 *      nearest known bucket.
 */

/**
 * The shape this module produces. Declared once, so the tests and the renderer
 * are checked against the same contract rather than against `object`.
 *
 * @typedef {{ label: string, value: string }} LabelledField
 * @typedef {{ raw: string | null, iso: string | null, reason: string | null }} StatedTimestamp
 * @typedef {'blocked' | 'working' | 'idle' | 'unclassified'} Severity
 * @typedef {{ cells: (string | null)[], seat: string, status: string | null, severity: Severity }} SeatRow
 * @typedef {{
 *   title: string | null,
 *   statedTimestamp: StatedTimestamp,
 *   columns: string[],
 *   seats: SeatRow[],
 *   fields: LabelledField[],
 *   totals: LabelledField[] | null,
 *   evidence: LabelledField[] | null,
 * }} Dashboard
 * @typedef {{ basis: 'stated' | 'file-mtime', iso: string, ms: number, label: string }} Age
 */

/** One hour, per the assignment: at this age the whole surface says STALE. */
export const STALE_AFTER_MS = 60 * 60 * 1000;

/** India Standard Time, the only zone the source document uses. */
const IST_OFFSET_MINUTES = 5 * 60 + 30;

/**
 * Month names in both languages the fleet writes in. The source header reads
 * "21 अगस्त 2026 · 09:28 IST"; an English pass would produce "21 August 2026".
 * A name outside this table is a parse FAILURE, not a guess — see
 * `parseStatedTimestamp`.
 */
const MONTHS = {
  january: 1,
  jan: 1,
  जनवरी: 1,
  february: 2,
  feb: 2,
  फरवरी: 2,
  फ़रवरी: 2,
  march: 3,
  mar: 3,
  मार्च: 3,
  april: 4,
  apr: 4,
  अप्रैल: 4,
  may: 5,
  मई: 5,
  june: 6,
  jun: 6,
  जून: 6,
  july: 7,
  jul: 7,
  जुलाई: 7,
  august: 8,
  aug: 8,
  अगस्त: 8,
  september: 9,
  sep: 9,
  sept: 9,
  सितंबर: 9,
  सितम्बर: 9,
  october: 10,
  oct: 10,
  अक्टूबर: 10,
  अक्तूबर: 10,
  november: 11,
  nov: 11,
  नवंबर: 11,
  नवम्बर: 11,
  december: 12,
  dec: 12,
  दिसंबर: 12,
  दिसम्बर: 12,
};

/**
 * Classify a status word into one of four severities.
 *
 * Order matters: "Blocked—invalid tag" and "Working—partial" both carry their
 * headline word first, and BLOCKED must win over anything it is combined with.
 * "Signed—unclaimed" is idle, not working: a signature is not a claim.
 *
 * @param {string | null} status
 * @returns {Severity}
 */
export function classifyStatus(status) {
  if (!status) return 'unclassified';
  const text = status.toLowerCase();
  if (text.includes('block')) return 'blocked';
  if (/unclaimed|\bidle\b|awaiting|\bnone\b|manual-only/.test(text)) return 'idle';
  if (/working|claimed|in progress/.test(text)) return 'working';
  return 'unclassified';
}

/** Trim a table cell; an empty cell is absence, and absence is `null`. */
function cell(raw) {
  const value = raw.trim().replace(/^`|`$/g, '').trim();
  return value === '' || value === '-' || value === '—' ? null : value;
}

/** Strip the markdown emphasis the source uses for its own labels. */
function plain(text) {
  return text.replace(/\*\*/g, '').replace(/`/g, '').trim();
}

function isDivider(line) {
  return /^\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes('-');
}

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
}

/**
 * Resolve the document's own timestamp line.
 *
 * Returns `iso: null` with a stated reason rather than throwing or defaulting:
 * a dashboard whose age cannot be established must SAY so, and the caller falls
 * back to the file's modification time with the basis labelled.
 *
 * @param {string} text
 */
export function parseStatedTimestamp(text) {
  const line = text
    .split('\n')
    .map((entry) => entry.trim())
    .find((entry) => /\bIST\b/.test(entry) && /\d/.test(entry));

  if (!line) {
    return { raw: null, iso: null, reason: 'no line containing a time and "IST" was found' };
  }

  const raw = plain(line);
  const date = raw.match(/(\d{1,2})\s+([^\s·,]+)\s+(\d{4})/);
  const time = raw.match(/(\d{1,2}):(\d{2})\s*IST/);

  if (!date) return { raw, iso: null, reason: 'no "<day> <month> <year>" in the line' };
  if (!time) return { raw, iso: null, reason: 'no "HH:MM IST" in the line' };

  const month = MONTHS[date[2].toLowerCase()];
  if (!month) return { raw, iso: null, reason: `unrecognised month name "${date[2]}"` };

  const resolved = new Date(
    Date.UTC(Number(date[3]), month - 1, Number(date[1]), Number(time[1]), Number(time[2])) -
      IST_OFFSET_MINUTES * 60_000,
  );
  if (Number.isNaN(resolved.getTime())) {
    return { raw, iso: null, reason: 'the date parts do not form a real instant' };
  }
  return { raw, iso: resolved.toISOString(), reason: null };
}

/**
 * Split a "a **1** · b **2**" run into labelled values. Returns null when the
 * shape does not hold, so the page shows the line verbatim instead of a
 * half-parsed row of numbers.
 */
function splitTotals(value) {
  const parts = value
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean);
  const pairs = [];
  for (const part of parts) {
    const match = part.match(/^(.*?)\s*\*\*(.+?)\*\*\s*(.*)$/);
    if (!match) return null;
    pairs.push({ label: plain(match[1]) || plain(match[3]), value: plain(match[2]) });
  }
  return pairs.length > 0 ? pairs : null;
}

/**
 * Split the evidence note into its grades. The grade words are read off the
 * line, not assumed: the fleet has already changed them once.
 */
function splitEvidence(value) {
  const grades = [...value.matchAll(/([A-Z][A-Z-]{2,})[—–-]\s*/g)];
  if (grades.length === 0) return null;
  return grades.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < grades.length ? grades[index + 1].index : value.length;
    return { label: match[1], value: plain(value.slice(start, end)).replace(/[.;,\s]+$/, '') };
  });
}

/** Find a `**Label:** value` field by a case-insensitive prefix of its label. */
export function field(dashboard, prefix) {
  const wanted = prefix.toLowerCase();
  const found = dashboard.fields.find((entry) => entry.label.toLowerCase().startsWith(wanted));
  return found ? found.value : null;
}

/**
 * @param {string} text
 * @returns {{ ok: true, dashboard: Dashboard } | { ok: false, reason: string }}
 */
export function parseFleetDashboard(text) {
  if (text.trim() === '') return { ok: false, reason: 'the source file is empty' };

  const lines = text.split('\n');
  const heading = lines.find((line) => line.startsWith('# '));
  const title = heading ? heading.slice(2).trim() : null;

  const dividerIndex = lines.findIndex(isDivider);
  if (dividerIndex < 1) {
    return { ok: false, reason: 'no markdown table was found — the seat table is the document' };
  }
  const columns = splitRow(lines[dividerIndex - 1]).map(plain);
  if (columns.length < 2) {
    return {
      ok: false,
      reason: `the table header has ${columns.length} column(s); at least 2 are needed`,
    };
  }

  const statusColumn = columns.findIndex((name) => name.toLowerCase() === 'status');
  const seats = [];
  for (let index = dividerIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim().startsWith('|')) break;
    const cells = splitRow(line).map(cell);
    const seat = cells[0];
    if (!seat) continue;
    const status = statusColumn >= 0 ? (cells[statusColumn] ?? null) : null;
    seats.push({ cells, seat, status, severity: classifyStatus(status) });
  }
  if (seats.length === 0) return { ok: false, reason: 'the table has a header but no seat rows' };

  const fields = [];
  for (const line of lines) {
    const match = line.trim().match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (match) fields.push({ label: plain(match[1]), value: match[2].trim() });
  }

  const dashboard = {
    title,
    statedTimestamp: parseStatedTimestamp(text),
    columns,
    seats,
    fields,
    totals: null,
    evidence: null,
  };
  const totalsRaw = field(dashboard, 'portfolio total');
  const evidenceRaw = field(dashboard, 'evidence');
  dashboard.totals = totalsRaw ? splitTotals(totalsRaw) : null;
  dashboard.evidence = evidenceRaw ? splitEvidence(evidenceRaw) : null;

  return { ok: true, dashboard };
}

/** @param {number} ms */
export function describeAge(ms) {
  if (ms < 0) {
    const ahead = Math.round(-ms / 60_000);
    return `timestamp is ${ahead} minute${ahead === 1 ? '' : 's'} in the future (clock skew)`;
  }
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return 'under a minute old';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} old`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) {
    return rest === 0 ? `${hours} hour${hours === 1 ? '' : 's'} old` : `${hours}h ${rest}m old`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ${hours % 24}h old`;
}

/**
 * @param {string} iso
 * @param {'stated' | 'file-mtime'} basis
 * @param {Date} now
 * @returns {Age}
 */
export function ageOf(iso, basis, now) {
  const ms = now.getTime() - new Date(iso).getTime();
  return { basis, iso, ms, label: describeAge(ms) };
}

/**
 * Stale is a one-way door: a future timestamp is not "fresh", it is unknown.
 *
 * @param {Age} age
 */
export function isStale(age) {
  return age.ms >= STALE_AFTER_MS || age.ms < 0;
}

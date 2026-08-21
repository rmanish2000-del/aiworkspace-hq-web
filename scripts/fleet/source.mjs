/**
 * Reads the fleet dashboard source BY FOLDER + TITLE, at the moment it is
 * asked (FOUNDER-DASHBOARD-HTML, 2026-08-21).
 *
 * WHERE THIS RUNS, STATED PLAINLY: on the founder's own machine only, against
 * the Google Drive desktop folder, behind `npm run fleet` — a server bound to
 * 127.0.0.1 that re-reads the folder on every request, so "read on every
 * request" is literal and there is no cache whose age could be misrepresented.
 *
 * WHY IT IS NOT AN ASTRO ROUTE, AND NOT DEPLOYED: reading this folder from a
 * Vercel function needs a Google Drive credential that does not exist and that
 * this seat may not create; and publishing fleet-internal status with no
 * authentication boundary would be obscurity, not access control. `src/` is the
 * published surface and its gates say so — no environment reads, no filesystem,
 * no third-party origins. Rather than weaken those to ship a dashboard, the
 * whole feature lives in `scripts/`, where nothing can publish it by accident.
 * `scripts/verify-release.mjs` proves the built artifact carries no trace of it.
 *
 * FOLDER + TITLE, not a path: the directory is listed and the entry matched by
 * name, so a renamed or case-shifted file reports MISSING and names what was
 * actually there — it never silently resolves to something else.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { ageOf, isStale, parseFleetDashboard } from './parse.mjs';

/**
 * @typedef {import('./parse.mjs').Dashboard} Dashboard
 * @typedef {import('./parse.mjs').Age} Age
 * @typedef {{ kind: 'read', text: string, path: string, mtimeIso: string }
 *   | { kind: 'missing', path: string, detail: string }
 *   | { kind: 'unreachable', path: string, detail: string }} Source
 * @typedef {{ state: 'missing' | 'unreachable', path: string, detail: string }
 *   | { state: 'malformed', path: string, reason: string, excerpt: string }
 *   | { state: 'ok', path: string, dashboard: Dashboard, age: Age, stale: boolean }} View
 */

/** The Drive-synced folder. Overridable so tests never touch the real one. */
export const SOURCE_DIR = process.env.AIWHQ_FLEET_SOURCE_DIR ?? 'G:\\My Drive\\AGENT-REPORTS';
export const SOURCE_TITLE = 'FOUNDER-FLEET-DASHBOARD-LATEST.md';

/**
 * Never throws. A dashboard that crashes on a bad read is a blank page, and a
 * blank page is the one failure mode the assignment forbids outright.
 *
 * @param {string} [dir]
 * @param {string} [title]
 * @returns {Source}
 */
export function readFleetSource(dir = SOURCE_DIR, title = SOURCE_TITLE) {
  const path = join(dir, title);
  let entries;
  try {
    entries = readdirSync(dir);
  } catch (error) {
    return {
      kind: 'unreachable',
      path,
      detail: `the folder could not be listed: ${error.message}`,
    };
  }

  const match = entries.find((entry) => entry.toLowerCase() === title.toLowerCase());
  if (!match) {
    const near = entries.filter((entry) => entry.toUpperCase().includes('DASHBOARD'));
    return {
      kind: 'missing',
      path,
      detail:
        near.length > 0
          ? `no entry titled "${title}"; the folder does hold ${near.join(', ')}`
          : `no entry titled "${title}" in a folder of ${entries.length} entries`,
    };
  }

  const resolved = join(dir, match);
  try {
    const text = readFileSync(resolved, 'utf8');
    return {
      kind: 'read',
      text,
      path: resolved,
      mtimeIso: statSync(resolved).mtime.toISOString(),
    };
  } catch (error) {
    return {
      kind: 'unreachable',
      path: resolved,
      detail: `the file was listed but could not be read: ${error.message}`,
    };
  }
}

/**
 * Turn a read into everything the page renders — including its failure states,
 * which are first-class here so they can be tested without a browser.
 *
 * @param {Source} source
 * @param {Date} now
 * @returns {View}
 */
export function buildView(source, now) {
  if (source.kind === 'unreachable' || source.kind === 'missing') {
    return { state: source.kind, path: source.path, detail: source.detail };
  }

  const parsed = parseFleetDashboard(source.text);
  if (!parsed.ok) {
    return {
      state: 'malformed',
      path: source.path,
      reason: parsed.reason,
      excerpt: source.text.slice(0, 400),
    };
  }

  // The document's own timestamp is the source's CLAIM; the file's mtime is our
  // OBSERVATION. When the claim cannot be read the observation is used and the
  // basis is printed, so an age is never of unstated provenance.
  const stated = parsed.dashboard.statedTimestamp.iso;
  const age = stated ? ageOf(stated, 'stated', now) : ageOf(source.mtimeIso, 'file-mtime', now);

  return { state: 'ok', path: source.path, dashboard: parsed.dashboard, age, stale: isStale(age) };
}

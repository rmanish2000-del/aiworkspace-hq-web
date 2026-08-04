/**
 * ledger.ts — the R-1 claim compiler (AWHQ-WEB-CC008).
 *
 * Build-time only: runs in Node during `astro build`; ships zero bytes. Loads
 * the claims ledger and copy blocks, validates the eight-check discipline
 * mechanically, and hands routes their content. A violation THROWS, so the
 * build fails — there is no editorial override path (T-1).
 *
 * Rules enforced here:
 *  - every block's claim exists in the ledger (or is explicitly navigational);
 *  - only Verified and Approved claims render as assertions; Under-design
 *    renders only as stated intent; Gated renders only as a withheld notice
 *    (never its copy); Reported/never-published tiers cannot exist here;
 *  - every negative claim carries a date and a re-verification cadence (T-3);
 *  - a withheld block never carries copy.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

export type Tier = 'Verified' | 'Approved' | 'Under-design' | 'Gated';

export interface Claim {
  id: string;
  text: string;
  tier: Tier;
  date: string;
  source: string;
  routes: string[];
  negative?: boolean;
  reverify: { cadence: string; last: string };
}

export interface Block {
  id: string;
  route: string;
  slot: string;
  kind: string;
  claim: string | null;
  copy: string;
  withheld?: boolean;
  note?: string;
}

const TIERS: readonly Tier[] = ['Verified', 'Approved', 'Under-design', 'Gated'];

function load<T>(relPath: string, key: string): T[] {
  // Resolved from the repository root: the build (and vitest) run with the
  // root as cwd, and bundle-relative URLs break under Astro's prerenderer.
  const parsed = parse(readFileSync(resolve(process.cwd(), relPath), 'utf8')) as Record<
    string,
    T[]
  >;
  const rows = parsed[key];
  if (!Array.isArray(rows) || rows.length === 0)
    throw new Error(`ledger: ${relPath} has no ${key}`);
  return rows;
}

export const CLAIMS: readonly Claim[] = load<Claim>('src/content/ledger/claims.yaml', 'claims');
export const BLOCKS: readonly Block[] = load<Block>('src/content/ledger/blocks.yaml', 'blocks');

const claimById = new Map(CLAIMS.map((claim) => [claim.id, claim]));

/* ---- Mechanical validation — throws at build time ------------------------ */

for (const claim of CLAIMS) {
  if (!TIERS.includes(claim.tier)) {
    throw new Error(`ledger: ${claim.id} carries unknown tier "${claim.tier}"`);
  }
  if (!claim.source.includes('.md')) {
    throw new Error(`ledger: ${claim.id} source does not cite a spec file in docs/specs/`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(claim.date)) {
    throw new Error(`ledger: ${claim.id} has no date`);
  }
  if (claim.negative && (!claim.reverify?.cadence || !claim.reverify?.last)) {
    throw new Error(`ledger: negative claim ${claim.id} lacks re-verification (T-3)`);
  }
}

for (const block of BLOCKS) {
  if (block.claim !== null) {
    const claim = claimById.get(block.claim);
    if (!claim) throw new Error(`ledger: block ${block.id} cites unknown claim ${block.claim}`);
    if (block.withheld) {
      if (block.copy !== '') {
        throw new Error(`ledger: withheld block ${block.id} must not carry copy`);
      }
    } else {
      if (claim.tier === 'Gated') {
        throw new Error(`ledger: block ${block.id} renders a Gated claim (${claim.id})`);
      }
      if (!claim.routes.includes(block.route)) {
        throw new Error(
          `ledger: block ${block.id} renders ${claim.id} on unlisted route ${block.route}`,
        );
      }
    }
  } else if (block.kind !== 'navigational' && block.kind !== 'footnote') {
    throw new Error(`ledger: block ${block.id} is factual but cites no claim (contract rule)`);
  }
}

/* ---- Route API ----------------------------------------------------------- */

export function blocksFor(route: string): Block[] {
  return BLOCKS.filter((block) => block.route === route && !block.withheld);
}

export function block(id: string): Block {
  const found = BLOCKS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`ledger: no block ${id}`);
  if (found.withheld) throw new Error(`ledger: block ${id} is withheld and cannot render`);
  return found;
}

/** The tier badge a rendered claim carries (CC-004 §6 encoding). */
export function badgeFor(blockId: string): { tier: Tier; date: string } | null {
  const found = BLOCKS.find((candidate) => candidate.id === blockId);
  if (!found || found.claim === null) return null;
  const claim = claimById.get(found.claim);
  if (!claim) return null;
  return { tier: claim.tier, date: claim.date };
}

/** Withheld slots render an explicit notice where the contract requires one. */
export function withheldNotice(blockId: string): string {
  const found = BLOCKS.find((candidate) => candidate.id === blockId);
  if (!found?.withheld) throw new Error(`ledger: ${blockId} is not withheld`);
  return 'This statement is withheld until its verification completes. The gap is deliberate.';
}

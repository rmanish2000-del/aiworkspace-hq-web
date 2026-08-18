/**
 * pricing.ts — the ONE source of truth for every price this site may show
 * (PRICING-SCAFFOLD, 2026-08-18; retargeted the same day under the founder
 * ruling "GUARDIAN · BOTH (INR primary) · MERGE": the R3 price names
 * WARRANT GUARDIAN, flat monthly — not AIW Pro per-seat — displayed in BOTH
 * currencies with INR primary and GST presentation in INR, USD secondary).
 *
 * THE NUMBERS ARE THE FOUNDER'S. The default is ABSENT — `null`, not zero,
 * not a placeholder. While it is null:
 *   - /pricing emits NO route at all (src/pages/pricing/[...index].astro
 *     returns zero static paths — no document, no nav entry, no hidden markup);
 *   - scripts/pricing-gate.mjs fails the build if any INR- or USD-looking
 *     figure appears on a non-frozen route (the seven frozen routes are
 *     governed by their own seal, docs/governance/CONTENT-FREEZE.json).
 *
 * TO PUBLISH (the one edit plus the seal):
 *   1. Set `PRICING_GUARDIAN_MONTHLY` below to the founder's numbers —
 *      `{ inr: <whole rupees>, usd: <whole dollars> }`.
 *   2. Record the founder's act in docs/governance/PRICING-SEAL.json — a seal
 *      entry whose `amount_inr` AND `amount_usd` match, with `sealed_by`,
 *      `date` and `ref` (the assignment or ruling that spoke the numbers).
 *   Either half without the other FAILS the build: a value with no seal is an
 *   invented number; a seal with no value is a record of nothing.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Two honest locations, tried in order:
 *   1. relative to THIS module — correct when the dev server runs with a
 *      different working directory (`astro dev --root`, found the hard way);
 *   2. relative to process.cwd() — correct during `astro build`, where the
 *      module executes from a bundled location under dist/ and (1) resolves
 *      into the build output instead of the repository.
 * Both point at the same committed file; whichever exists wins.
 */
const SEAL_CANDIDATES = [
  fileURLToPath(new URL('../../docs/governance/PRICING-SEAL.json', import.meta.url)),
  'docs/governance/PRICING-SEAL.json',
];
const SEAL_REGISTER: string =
  SEAL_CANDIDATES.find((candidate) => existsSync(candidate)) ?? 'docs/governance/PRICING-SEAL.json';

/**
 * Warrant Guardian's flat monthly price — INR primary, USD secondary — or
 * null while undecided.
 * ⚠ Setting this without a matching seal entry fails the build — see above.
 */
export const PRICING_GUARDIAN_MONTHLY: { inr: number; usd: number } | null = { inr: 999, usd: 12 };

export interface PricingSeal {
  amount_inr: number;
  amount_usd: number;
  sealed_by: string;
  date: string;
  ref: string;
}

/** Reads the seal register. Build-time only (Node fs) — never shipped. */
export function readSeals(): PricingSeal[] {
  return JSON.parse(readFileSync(SEAL_REGISTER, 'utf8')).seals;
}

/**
 * The gate both the page and scripts/pricing-gate.mjs call:
 * absent value → { publish: false }; present value → a founder seal matching
 * BOTH amounts must exist or this THROWS and the build stops.
 */
export function sealedPrice():
  { publish: false } | { publish: true; inr: number; usd: number; seal: PricingSeal } {
  if (PRICING_GUARDIAN_MONTHLY === null) return { publish: false };
  const { inr, usd } = PRICING_GUARDIAN_MONTHLY;
  const seal = readSeals().find((entry) => entry.amount_inr === inr && entry.amount_usd === usd);
  if (!seal || !seal.sealed_by || !seal.date || !seal.ref) {
    throw new Error(
      `PRICING_GUARDIAN_MONTHLY is set to ₹${inr}/$${usd} but ` +
        'docs/governance/PRICING-SEAL.json holds no founder seal matching BOTH amounts ' +
        '(amount_inr + amount_usd + sealed_by + date + ref). An unsealed price must not build.',
    );
  }
  return { publish: true, inr, usd, seal };
}

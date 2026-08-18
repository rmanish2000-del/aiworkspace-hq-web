/**
 * pricing.ts — the ONE source of truth for every price this site may show
 * (PRICING-SCAFFOLD, 2026-08-18). R3 scaffolding: everything is built around
 * the number so that publishing it is one config edit — and so that no
 * invented number can ever ship.
 *
 * THE NUMBER IS THE FOUNDER'S. Its default is ABSENT — `null`, not zero, not
 * a placeholder. While it is null:
 *   - /pricing emits NO route at all (src/pages/pricing/[...index].astro
 *     returns zero static paths — no document, no nav entry, no hidden markup);
 *   - scripts/pricing-gate.mjs fails the build if any INR-looking figure
 *     appears on a non-frozen route (the seven frozen routes are governed by
 *     their own seal, docs/governance/CONTENT-FREEZE.json).
 *
 * TO PUBLISH (the one edit plus the seal):
 *   1. Set `PRICING_GUARDIAN_MONTHLY_INR` below to the founder's number.
 *   2. Record the founder's act in docs/governance/PRICING-SEAL.json — a seal
 *      entry whose `amount_inr` matches, with `sealed_by`, `date` and `ref`
 *      (the assignment or ruling that spoke the number).
 *   Either half without the other FAILS the build: a value with no seal is an
 *   invented number; a seal with no value is a record of nothing.
 */
import { readFileSync } from 'node:fs';

/**
 * Guardian's monthly price in WHOLE RUPEES, or null while undecided.
 * ⚠ Setting this without a matching seal entry fails the build — see above.
 */
export const PRICING_GUARDIAN_MONTHLY_INR: number | null = null;

export interface PricingSeal {
  amount_inr: number;
  sealed_by: string;
  date: string;
  ref: string;
}

/** Reads the seal register. Build-time only (Node fs) — never shipped. */
export function readSeals(): PricingSeal[] {
  return JSON.parse(readFileSync('docs/governance/PRICING-SEAL.json', 'utf8')).seals;
}

/**
 * The gate both the page and scripts/pricing-gate.mjs call:
 * absent value → { publish: false }; present value → a matching founder seal
 * must exist or this THROWS and the build stops.
 */
export function sealedPrice():
  { publish: false } | { publish: true; amountInr: number; seal: PricingSeal } {
  if (PRICING_GUARDIAN_MONTHLY_INR === null) return { publish: false };
  const seal = readSeals().find((entry) => entry.amount_inr === PRICING_GUARDIAN_MONTHLY_INR);
  if (!seal || !seal.sealed_by || !seal.date || !seal.ref) {
    throw new Error(
      `PRICING_GUARDIAN_MONTHLY_INR is set to ${PRICING_GUARDIAN_MONTHLY_INR} but ` +
        'docs/governance/PRICING-SEAL.json holds no matching founder seal ' +
        '(amount_inr + sealed_by + date + ref). An unsealed price must not build.',
    );
  }
  return { publish: true, amountInr: PRICING_GUARDIAN_MONTHLY_INR, seal };
}

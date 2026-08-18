import { describe, expect, it } from 'vitest';

import { PRICING_GUARDIAN_MONTHLY, readSeals, sealedPrice } from '../../src/config/pricing';

/**
 * PRICING-SCAFFOLD (2026-08-18). The number is the founder's; until he speaks
 * it, the config is ABSENT and nothing renders. The artifact-level enforcement
 * (no /pricing document, no INR figure on any non-frozen route) lives in
 * scripts/pricing-gate.mjs, which runs after the build in verify:release and
 * CI; these tests hold the config contract itself.
 */

describe('the pricing config', () => {
  it('is either ABSENT or founder-sealed — no third state', () => {
    // The absent default guarded this scaffold until 2026-08-18, when the
    // founder spoke the number ("OK B" — ₹999/$12) and the seal entry landed
    // in the same commit. From then on the invariant is: a present value MUST
    // resolve to a matching founder seal (sealedPrice() throws otherwise).
    if (PRICING_GUARDIAN_MONTHLY === null) {
      expect(sealedPrice()).toEqual({ publish: false });
    } else {
      const price = sealedPrice();
      expect(price.publish).toBe(true);
      if (price.publish) {
        expect(price.inr).toBe(PRICING_GUARDIAN_MONTHLY.inr);
        expect(price.usd).toBe(PRICING_GUARDIAN_MONTHLY.usd);
        expect(price.seal.sealed_by.toLowerCase()).toContain('founder');
        expect(price.seal.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(price.seal.ref.length).toBeGreaterThan(0);
      }
    }
  });

  it('has a seal register with the append-only rule stated', () => {
    expect(Array.isArray(readSeals())).toBe(true);
    const register = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('node:fs').readFileSync('docs/governance/PRICING-SEAL.json', 'utf8'),
    );
    expect(register.rule).toContain('founder');
    expect(register.rule).toContain('appended, never edited');
  });
});

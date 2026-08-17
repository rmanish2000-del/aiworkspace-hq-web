import { describe, expect, it } from 'vitest';

import { PRICING_GUARDIAN_MONTHLY_INR, readSeals, sealedPrice } from '../../src/config/pricing';

/**
 * PRICING-SCAFFOLD (2026-08-18). The number is the founder's; until he speaks
 * it, the config is ABSENT and nothing renders. The artifact-level enforcement
 * (no /pricing document, no INR figure on any non-frozen route) lives in
 * scripts/pricing-gate.mjs, which runs after the build in verify:release and
 * CI; these tests hold the config contract itself.
 */

describe('the pricing config', () => {
  it('defaults to ABSENT — null, not zero, not a placeholder', () => {
    // If this fails, someone set a price. That is a founder act and requires a
    // seal entry in docs/governance/PRICING-SEAL.json in the same commit —
    // see sealedPrice(), which throws without one.
    expect(PRICING_GUARDIAN_MONTHLY_INR).toBeNull();
  });

  it('reports publish: false while the value is absent', () => {
    expect(sealedPrice()).toEqual({ publish: false });
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

import { describe, expect, it } from 'vitest';

import { pricingPage } from '../../src/content/pricing-page';
import { experience, warrantMcpProduct } from '../../src/content/copy';

/**
 * Pins the /pricing concrete Guardian example to existing product evidence.
 * Assignment 2026-08-26_1331_WEB_SHOW-CONCRETE-GUARDIAN-EXAMPLE.
 */
describe('pricingPage.guardianExample', () => {
  it('shows the proven delete-.env DENY case before payment', () => {
    expect(pricingPage.exampleBefore).toBe('delete .env');
    expect(pricingPage.exampleAfter).toContain('DENY');
    expect(pricingPage.exampleAfter.toLowerCase()).toContain('protected path');
  });

  it('matches the existing Warrant MCP policy preview and vocabulary', () => {
    const preview = experience.products.policyPreview.join(' ');
    expect(preview).toContain('delete .env');
    expect(preview).toContain('DENY');
    expect(preview.toLowerCase()).toContain('protected path');

    const vocab = warrantMcpProduct.vocabulary.join(' ');
    expect(vocab.toLowerCase()).toMatch(/protected path|file deletion/);
  });

  it('does not invent traction or performance claims', () => {
    const blob = [
      pricingPage.exampleLead,
      pricingPage.exampleNote,
      pricingPage.exampleBefore,
      pricingPage.exampleAfter,
    ].join(' ');
    expect(blob.toLowerCase()).not.toMatch(/\bcustomers?\b|\busers?\b|\btrusted by\b/);
    expect(blob.toLowerCase()).not.toMatch(/guarantee|100%|always blocks/);
  });
});

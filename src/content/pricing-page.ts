/**
 * /pricing page strings — B1 live-release availability line.
 * Moved from hardcoded markup so a11y M-9 (copy module) passes.
 * Meaning unchanged; price figures still come from sealedPrice().
 *
 * Concrete Guardian example (2026-08-26 WEB assignment): one before-and-after
 * pinned to existing Warrant MCP product behaviour only — delete .env → DENY
 * on a protected path. No invented capability.
 */
export const pricingPage = {
  metaTitle: 'Pricing — AI Workspace',
  metaDescription: 'Warrant Guardian pricing.',
  heading: 'Pricing',
  priceLeadBefore: 'Warrant Guardian is ',
  perMonth: 'per month',
  gstNote: ', GST as applicable ',
  about: 'about',
  subscribeAt: 'Subscribe at',
  questionsBeforePay: 'Questions before you pay:',
  monitored: '(monitored).',
  sealLead: 'Price set by the founder on',
  /** Compact buyer-facing example before payment. Source: warrant-mcp record. */
  exampleEyebrow: 'What Guardian catches',
  exampleHeading: 'One concrete refusal',
  exampleLead:
    'A supported agent tool call that would delete a protected environment file is refused before it runs. The decision is deterministic and cites the boundary.',
  exampleBeforeLabel: 'Agent action',
  exampleBefore: 'delete .env',
  exampleAfterLabel: 'Guardian decision',
  exampleAfter: 'DENY — protected path',
  exampleNote:
    'This is the same class of check shown on the Warrant MCP product page and in its public test suite. No customer result is claimed.',
} as const;

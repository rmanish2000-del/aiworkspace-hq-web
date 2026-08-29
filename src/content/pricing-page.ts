/**
 * /pricing page strings — B1 live-release availability line.
 * Moved from hardcoded markup so a11y M-9 (copy module) passes.
 * Meaning unchanged; price figures still come from sealedPrice().
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
} as const;

/**
 * /pricing page strings — private-beta offer disclosure.
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
  offer:
    'This is a private beta build that you install on your own Linux host. You need Docker, your own domain, and ports 80 and 443 available. Setup is manual, with hands-on support from the founder.',
  notFor:
    'Not for you yet if you want a hosted service or single sign-on with your own identity provider.',
  exampleHeading: 'A concrete policy check',
  exampleLead: 'A protected-file rule turns an unsafe agent command into a deterministic refusal:',
  exampleCommandLabel: 'Agent command',
  exampleCommand: 'delete .env',
  examplePolicyLabel: 'Confirmed policy',
  examplePolicy: 'Protected paths cannot be deleted.',
  exampleOutcomeLabel: 'Guardian result',
  exampleOutcome: 'DENY — the command does not run.',
  subscribeAt: 'Subscribe for ₹999/month at',
  questionsBeforePay: 'Questions before you pay:',
  monitored: '(monitored).',
  sealLead: 'Price set by the founder on',
} as const;

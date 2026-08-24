/**
 * payer.mjs — who paid, what they are told, and whether we have told them
 * (PAYER-GETS-SOMETHING, 2026-08-24).
 *
 * Pure. No I/O, no environment, no clock beyond what is handed in — so every
 * sentence a paying customer receives is unit-tested rather than trusted.
 *
 * ─── THE HONESTY CONSTRAINT, WHICH IS THE WHOLE POINT ─────────────────────
 * The site's own stage disclosure says "A working Founder Edition exists
 * LOCALLY." Nothing in this repository provisions repo access, mints a licence
 * key, or runs an installer. So the confirmation email does not pretend
 * otherwise. It says what was taken, that access is provisioned by hand,
 * inside the response window the site already commits to, and what the buyer
 * is owed if that does not happen — the Delivery Policy's non-delivery clause,
 * which is a full refund.
 *
 * Every factual claim below is copied from a page already published on the
 * site, never invented here:
 *   - "within 3 business days"      src/legal/contact.md, src/legal/refunds.md
 *   - the non-delivery clause       src/legal/delivery.md
 *   - the entity block              src/legal/*.md footer, the site footer
 *   - founder@aiworkspacehq.com     /contact, /pricing, /checkout
 * If one of those pages changes, this file is wrong and the test that pins it
 * to the page is what will say so.
 */

/** The one address a payer may reply to. Published on /contact and /pricing. */
export const REPLY_TO = 'founder@aiworkspacehq.com';

/** Published response commitment. Do not invent a faster one here. */
export const RESPONSE_WINDOW = 'within 3 business days';

/** Note keys this module owns on the Razorpay payment object. */
export const WELCOME_KEY = 'aiwhq_welcome';
export const WELCOME_AT_KEY = 'aiwhq_welcome_at';
export const ALERT_KEY = 'aiwhq_alert';

/**
 * Pull the payer out of a verified webhook event.
 *
 * Returns null unless money was actually taken: an authorized-but-uncaptured
 * payment is not a customer, and emailing one "payment received" would be the
 * same class of lie this assignment exists to remove.
 *
 * @param {any} event a Razorpay webhook event, already signature-verified
 */
export function payerFromEvent(event) {
  const payment = event?.payload?.payment?.entity;
  if (!payment || typeof payment.id !== 'string' || !/^pay_[A-Za-z0-9]+$/.test(payment.id)) {
    return null;
  }
  if (payment.status !== 'captured') return null;

  const email = typeof payment.email === 'string' ? payment.email.trim() : '';
  return {
    paymentId: payment.id,
    // May be empty: Razorpay does not guarantee an email on every method. An
    // empty string is carried through so the caller can SAY the payer is
    // unreachable rather than silently doing nothing.
    email,
    amountPaise: Number.isInteger(payment.amount) ? payment.amount : null,
    currency: typeof payment.currency === 'string' ? payment.currency : 'INR',
    status: payment.status,
    createdAtIso:
      typeof payment.created_at === 'number'
        ? new Date(payment.created_at * 1000).toISOString()
        : null,
    subscriptionId:
      event?.payload?.subscription?.entity?.id ??
      (typeof payment.subscription_id === 'string' ? payment.subscription_id : null),
    contact: typeof payment.contact === 'string' ? payment.contact : '',
  };
}

/** ₹9,99 — grouped the Indian way, because the buyer is reading it in India. */
export function formatAmount(amountPaise, currency = 'INR') {
  if (!Number.isInteger(amountPaise)) return 'an amount Razorpay did not report';
  const major = amountPaise / 100;
  const grouped = major.toLocaleString('en-IN', {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return currency === 'INR' ? `₹${grouped}` : `${grouped} ${currency}`;
}

/**
 * Has this payer already been written to?
 *
 * Keyed on the PAYMENT, not the event: Razorpay fires more than one event for
 * a single subscription charge (`payment.captured` and `subscription.charged`
 * both carry the same payment), and retries each of them. Only the payment id
 * is stable across all of that.
 *
 * @param {Record<string, string> | null | undefined} notes existing payment notes
 */
export function alreadyWelcomed(notes) {
  const mark = notes?.[WELCOME_KEY];
  return typeof mark === 'string' && mark.startsWith('sent');
}

const ENTITY_BLOCK = [
  'Kartavya CSC Digital Seva, a sole proprietorship of Manish Patel',
  'Tilak Ward, Deori, District Sagar, Madhya Pradesh 470226, India',
  'GSTIN 23AKZPP1502D1ZB · Udyam UDYAM-MP-39-0001250',
].join('\n');

/**
 * The confirmation the payer receives.
 *
 * Read it as a customer would. It promises exactly two things — a personal
 * reply inside the published window, and a full refund if access never
 * arrives — and both are commitments the site already makes in writing.
 */
export function welcomeEmail(payer, siteUrl = 'https://aiworkspacehq.com') {
  const amount = formatAmount(payer.amountPaise, payer.currency);
  const subject = `Warrant Guardian — payment received (${amount})`;
  const text = [
    'Thank you — your payment went through.',
    '',
    'WHAT WAS TAKEN',
    `  Product     Warrant Guardian, Founder Edition`,
    `  Amount      ${amount} per month (GST as applicable)`,
    `  Payment id  ${payer.paymentId}`,
    payer.subscriptionId ? `  Subscription ${payer.subscriptionId}` : null,
    payer.createdAtIso ? `  Date        ${payer.createdAtIso}` : null,
    '',
    'WHAT HAPPENS NEXT — stated plainly, because you paid a stranger',
    '  Founder Edition access is set up by hand, by me. It is not provisioned',
    '  automatically, and I would rather say so than leave you hunting for',
    `  something that is not there. I will email you personally from`,
    `  ${REPLY_TO} ${RESPONSE_WINDOW} with your access.`,
    '  Nothing is required from you in the meantime.',
    '',
    'IF THAT DOES NOT HAPPEN',
    '  The Delivery Policy covers exactly this: if you pay and access is not',
    '  provisioned, write to me and it is resolved or the charge is refunded in',
    '  full. Reply to this email and you have done everything you need to.',
    '',
    'YOUR RIGHTS AND THE PAPERWORK',
    `  Delivery Policy   ${siteUrl}/delivery`,
    `  Refunds           ${siteUrl}/refunds`,
    `  Terms             ${siteUrl}/terms`,
    `  Privacy           ${siteUrl}/privacy`,
    `  Contact           ${siteUrl}/contact`,
    '',
    `Reply to this email and it reaches a person: ${REPLY_TO}`,
    '',
    '—',
    ENTITY_BLOCK,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return { subject, text };
}

/**
 * The founder's alert.
 *
 * "He must never learn of a customer by accident" — so this carries everything
 * needed to act without opening a dashboard, and says outright when the payer
 * cannot be reached.
 */
export function founderAlertEmail(payer, welcomeOutcome) {
  const amount = formatAmount(payer.amountPaise, payer.currency);
  const reachable = payer.email !== '';
  const subject = reachable
    ? `PAYMENT — ${amount} from ${payer.email}`
    : `PAYMENT — ${amount} — NO EMAIL ON THE PAYMENT`;

  const text = [
    reachable
      ? 'A payment was captured and verified. A real person is now waiting on you.'
      : 'A payment was captured and verified, but Razorpay reported NO EMAIL for it. ' +
        'This payer cannot be contacted from the webhook — open the payment in ' +
        'Razorpay and find a contact before anything else.',
    '',
    `  Amount       ${amount}`,
    `  Email        ${payer.email || '(none reported)'}`,
    `  Contact      ${payer.contact || '(none reported)'}`,
    `  Payment id   ${payer.paymentId}`,
    payer.subscriptionId ? `  Subscription ${payer.subscriptionId}` : null,
    payer.createdAtIso ? `  Captured at  ${payer.createdAtIso}` : null,
    `  Status       ${payer.status}`,
    '',
    `  Confirmation to the payer: ${welcomeOutcome}`,
    '',
    `You committed to a personal reply ${RESPONSE_WINDOW}. The clock started at`,
    `the timestamp above, not when you read this.`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return { subject, text };
}

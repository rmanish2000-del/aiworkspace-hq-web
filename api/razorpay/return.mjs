/**
 * POST/GET /api/razorpay/return — the bank-redirect landing
 * (R4-RETURN-PATH-AND-WEBHOOK, 2026-08-18).
 *
 * Born from the founder's first successful test payment: the demo bank's
 * Success page never brought him back to the site, so the page's own proof
 * surface never rendered. Razorpay's redirect flow POSTs
 * razorpay_payment_id, razorpay_subscription_id and razorpay_signature to
 * `callback_url`; a static page cannot receive a POST, so this function does —
 * verifies the SUBSCRIPTION-flow signature (HMAC-SHA256 over
 * `payment_id + "|" + subscription_id`, which is NOT the order-flow layout),
 * constant-time, then 303-redirects to /checkout with only public
 * identifiers. The page then re-confirms against Razorpay via
 * subscription-status before saying anything is paid — the signature gets the
 * visitor home; Razorpay's own answer is still the only success authority.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { stampPaymentNote } from '../_lib/razorpay-note.mjs';

export const config = { api: { bodyParser: false } };

function parseParams(raw, url) {
  const params = new URLSearchParams(raw);
  const fromQuery = new URL(url, 'https://x').searchParams;
  const pick = (name) => params.get(name) ?? fromQuery.get(name) ?? '';
  return {
    paymentId: pick('razorpay_payment_id'),
    subscriptionId: pick('razorpay_subscription_id'),
    signature: pick('razorpay_signature'),
  };
}

export default async function handler(request, response) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const { paymentId, subscriptionId, signature } = parseParams(
    Buffer.concat(chunks).toString('utf8'),
    request.url ?? '/',
  );

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const idShape = /^(pay|sub)_[A-Za-z0-9]+$/;

  const fail = () => {
    response.statusCode = 303;
    response.setHeader('location', '/checkout?return=unverified');
    response.end();
  };

  if (!keySecret || !idShape.test(paymentId) || !subscriptionId.startsWith('sub_') || !signature) {
    console.error('razorpay return: missing or malformed fields — sent back unverified');
    return fail();
  }

  const expected = Buffer.from(
    createHmac('sha256', keySecret).update(`${paymentId}|${subscriptionId}`).digest('hex'),
    'utf8',
  );
  const actual = Buffer.from(signature, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    console.error('razorpay return: SIGNATURE MISMATCH — sent back unverified');
    return fail();
  }

  // R4-SELF-EVIDENCING: record the outcome where it survives the tab closing —
  // on Razorpay's own payment object. Best-effort: never block the return.
  await stampPaymentNote(paymentId, {
    aiwhq_return: 'verified',
    aiwhq_return_at: new Date().toISOString(),
    aiwhq_subscription: subscriptionId,
  });

  // Only public identifiers travel in the URL — never the signature or any
  // secret-derived value.
  response.statusCode = 303;
  response.setHeader('location', `/checkout?return=paid&sub=${encodeURIComponent(subscriptionId)}`);
  return response.end();
}

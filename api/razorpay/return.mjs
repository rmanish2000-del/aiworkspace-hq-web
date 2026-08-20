/**
 * POST/GET /api/razorpay/return — the bank-redirect landing
 * (R4-RETURN-PATH-AND-WEBHOOK, 2026-08-18; instrumented under
 * RETURN-PATH-DIAGNOSED, 2026-08-20).
 *
 * Razorpay's redirect flow sends razorpay_payment_id, razorpay_subscription_id
 * and razorpay_signature to `callback_url`; a static page cannot receive a
 * POST, so this function does — verifies the SUBSCRIPTION-flow signature
 * (HMAC-SHA256 over `payment_id + "|" + subscription_id`, which is NOT the
 * order-flow layout), constant-time, then 303-redirects to /checkout with only
 * public identifiers.
 *
 * WHY IT NOW STAMPS ON EVERY PATH (2026-08-20): three real test payments were
 * webhook-verified but carried no return stamp, and `return_path_verified:
 * false` read identically for "the payer closed the tab" and "our handler is
 * broken" — opposite problems. The founder's eyewitness account ruled out
 * abandonment, so the record had to be able to tell the difference itself.
 * Now every invocation writes its own outcome — verified, signature-mismatch,
 * or malformed, with the parameter NAMES that arrived and the request shape —
 * so the next payment answers the question without anyone reading a log.
 * Silence in the record now means one thing only: we were never called.
 *
 * Notes carry identifiers, outcomes and key NAMES. Never a signature, never a
 * secret, never card data.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { stampPaymentNote } from '../_lib/razorpay-note.mjs';

export const config = { api: { bodyParser: false } };

/**
 * Razorpay posts form-encoded, but a flow that sent JSON would previously have
 * parsed to nothing and looked identical to "never called". Both are read, and
 * the shape is recorded either way.
 */
function parseParams(raw, url, contentType) {
  const fromQuery = new URL(url, 'https://x').searchParams;
  let body = new URLSearchParams(raw);
  let shape = 'form';

  if ((contentType ?? '').includes('json') || raw.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      body = new URLSearchParams(
        Object.entries(parsed).map(([key, value]) => [key, String(value)]),
      );
      shape = 'json';
    } catch {
      shape = 'unparseable-body';
    }
  }

  const pick = (name) => body.get(name) ?? fromQuery.get(name) ?? '';
  const keysSeen = [...new Set([...body.keys(), ...fromQuery.keys()])].join(',') || 'none';
  return {
    paymentId: pick('razorpay_payment_id'),
    subscriptionId: pick('razorpay_subscription_id'),
    orderId: pick('razorpay_order_id'),
    signature: pick('razorpay_signature'),
    shape,
    keysSeen,
  };
}

export default async function handler(request, response) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  const { paymentId, subscriptionId, orderId, signature, shape, keysSeen } = parseParams(
    raw,
    request.url ?? '/',
    request.headers['content-type'],
  );

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const idShape = /^pay_[A-Za-z0-9]+$/;
  const arrival = {
    aiwhq_return_at: new Date().toISOString(),
    aiwhq_return_shape: `${request.method ?? 'GET'}/${shape}`,
    aiwhq_return_keys: keysSeen,
  };

  const bounce = async (reason) => {
    console.error(`razorpay return: ${reason} (${request.method}/${shape}, keys: ${keysSeen})`);
    // Stamp the failure too — an unstamped payment must mean "never called".
    if (idShape.test(paymentId)) {
      await stampPaymentNote(paymentId, { ...arrival, aiwhq_return: reason });
    }
    response.statusCode = 303;
    response.setHeader('location', `/checkout?return=unverified&why=${encodeURIComponent(reason)}`);
    response.end();
  };

  if (!keySecret) return bounce('no-key-configured');
  if (!idShape.test(paymentId)) return bounce('malformed-or-missing-payment-id');
  if (!subscriptionId.startsWith('sub_')) {
    // An order-flow callback reaching the subscription handler is a real
    // possibility worth naming rather than lumping into "malformed".
    return bounce(orderId ? 'order-flow-callback-not-subscription' : 'missing-subscription-id');
  }
  if (!signature) return bounce('missing-signature');

  const expected = Buffer.from(
    createHmac('sha256', keySecret).update(`${paymentId}|${subscriptionId}`).digest('hex'),
    'utf8',
  );
  const actual = Buffer.from(signature, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return bounce('signature-mismatch');
  }

  await stampPaymentNote(paymentId, {
    ...arrival,
    aiwhq_return: 'verified',
    aiwhq_subscription: subscriptionId,
  });

  // Only public identifiers travel in the URL — never the signature or any
  // secret-derived value.
  response.statusCode = 303;
  response.setHeader('location', `/checkout?return=paid&sub=${encodeURIComponent(subscriptionId)}`);
  return response.end();
}

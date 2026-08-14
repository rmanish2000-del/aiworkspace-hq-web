/**
 * api/_lib/razorpay.mjs — the runtime copy of `src/lib/razorpay.ts`.
 *
 * Vercel's functions directory is compiled independently of the Astro build, so
 * a handler cannot import TypeScript from `src/`. Rather than let the two
 * drift, `tests/unit/razorpay.test.ts` asserts that this file and the TS module
 * agree: the same inputs must produce the same signature and the same
 * validation verdicts. A divergence fails the build.
 *
 * Nothing here reads a credential; the secret is passed in by the handler.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const MIN_AMOUNT_PAISE = 100;

export function validateOrderRequest(input) {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'body must be an object' };
  }
  const { amount, currency, receipt } = input;

  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return { ok: false, error: 'amount must be an integer number of paise' };
  }
  if (amount < MIN_AMOUNT_PAISE) {
    return { ok: false, error: `amount must be at least ${MIN_AMOUNT_PAISE} paise` };
  }
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
    return { ok: false, error: 'currency must be a three-letter ISO code' };
  }
  if (typeof receipt !== 'string' || receipt.length === 0 || receipt.length > 40) {
    return { ok: false, error: 'receipt must be a non-empty string of at most 40 characters' };
  }
  return { ok: true, value: { amount, currency, receipt } };
}

export function expectedSignature(orderId, paymentId, secret) {
  return createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

/** Constant-time comparison. See src/lib/razorpay.ts for why `===` is wrong. */
export function verifyPaymentSignature(fields, secret) {
  const orderId = fields?.razorpay_order_id;
  const paymentId = fields?.razorpay_payment_id;
  const signature = fields?.razorpay_signature;
  if (
    typeof orderId !== 'string' ||
    typeof paymentId !== 'string' ||
    typeof signature !== 'string'
  ) {
    return false;
  }
  if (!orderId || !paymentId || !signature || !secret) return false;

  const expected = Buffer.from(expectedSignature(orderId, paymentId, secret), 'utf8');
  const actual = Buffer.from(signature, 'utf8');
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export function idempotencyKey(fields) {
  return typeof fields?.razorpay_payment_id === 'string' && fields.razorpay_payment_id
    ? fields.razorpay_payment_id
    : null;
}

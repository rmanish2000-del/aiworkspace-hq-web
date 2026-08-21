/**
 * POST /api/razorpay/verify-payment — Vercel serverless function.
 *
 * Success ONLY on a signature match, computed in constant time. A mismatch is
 * 400 and NOT PAID; a missing field is 400 and NOT PAID. There is no third
 * outcome and no "probably fine" path.
 *
 * IDEMPOTENCY: the key is `razorpay_payment_id` — one per payment, stable
 * across retries and webhook replays. This repository has NO datastore, so this
 * handler records nothing and, deliberately, GRANTS nothing: a verified
 * signature returns `verified: true` and the key the caller must record. When a
 * store exists, the grant goes behind a check on that key. Inventing
 * persistence here would be the worse failure.
 *
 * Live keys accepted only when LIVE_PAYMENTS_RELEASED is true
 * (api/_lib/live-release.mjs — BUSINESS-QUEUE B1, 2026-08-21).
 */
import { idempotencyKey, verifyPaymentSignature } from '../_lib/razorpay.mjs';
import { isAllowedKey } from '../_lib/live-release.mjs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keySecret || !keyId) {
    console.error('razorpay: credentials are not configured');
    return response.status(500).json({ error: 'payments are not configured' });
  }
  if (!isAllowedKey(keyId)) {
    console.error(
      'razorpay: refusing key — not test, and live payments are not released (see api/_lib/live-release.mjs)',
    );
    return response.status(500).json({ error: 'payments are not configured' });
  }

  const fields = request.body ?? {};
  const key = idempotencyKey(fields);
  if (!key) {
    return response.status(400).json({ verified: false, error: 'missing razorpay_payment_id' });
  }

  if (!verifyPaymentSignature(fields, keySecret)) {
    console.error('razorpay: signature mismatch or missing field', { payment_id: key });
    return response.status(400).json({ verified: false, error: 'signature verification failed' });
  }

  return response.status(200).json({
    verified: true,
    idempotency_key: key,
    // Nothing is granted here — see the header note. This response is a
    // statement about the signature, not an entitlement.
    granted: false,
  });
}

/**
 * GET /api/razorpay/subscription-status?id=sub_… — Vercel serverless function
 * (R4-CHECKOUT, 2026-08-18).
 *
 * The honest answer to "is it active?". No local state exists to lie with:
 * this asks Razorpay — the actual ledger — every time, server-side, and
 * returns only the status and the id. The success page calls this instead of
 * trusting its own redirect; "active"/"authenticated" from HERE is the only
 * thing the UI may present as paid.
 *
 * Live keys accepted only when LIVE_PAYMENTS_RELEASED is true
 * (api/_lib/live-release.mjs — BUSINESS-QUEUE B1, 2026-08-21).
 */
import { isAllowedKey } from '../_lib/live-release.mjs';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || !isAllowedKey(keyId)) {
    console.error(
      'razorpay: credentials missing or not allowed (see api/_lib/live-release.mjs)',
    );
    return response.status(500).json({ error: 'payments are not configured' });
  }

  const id = typeof request.query?.id === 'string' ? request.query.id : '';
  if (!/^sub_[A-Za-z0-9]+$/.test(id)) {
    return response.status(400).json({ error: 'id must be a Razorpay subscription id' });
  }

  try {
    const upstream = await fetch(`https://api.razorpay.com/v1/subscriptions/${id}`, {
      headers: {
        authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
    });
    const payload = await upstream.json();
    if (!upstream.ok) {
      console.error('razorpay: status lookup failed', upstream.status);
      return response.status(upstream.status === 400 ? 404 : 500).json({ error: 'not found' });
    }
    return response.status(200).json({
      subscription_id: payload.id,
      status: payload.status, // created | authenticated | active | halted | cancelled | …
      current_end: payload.current_end ?? null,
    });
  } catch (error) {
    console.error('razorpay: subscription-status threw', error);
    return response.status(500).json({ error: 'payment provider error' });
  }
}

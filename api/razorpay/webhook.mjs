/**
 * POST /api/razorpay/webhook — Vercel serverless function (R4-CHECKOUT,
 * 2026-08-18). The ONLY source of payment truth.
 *
 * Razorpay signs every webhook: `x-razorpay-signature` = HMAC-SHA256 of the
 * RAW body with the webhook secret configured in their dashboard. Verification
 * here is constant-time; a mismatch is 400 and the event is treated as never
 * having happened. The success redirect a browser follows proves NOTHING —
 * only an event that passes this check counts.
 *
 * DURABLE RECORD, stated honestly (the repo has NO datastore, and inventing
 * one silently is the failure this fleet names): Razorpay itself is the
 * ledger. Every event this handler accepts already exists as a queryable
 * object on Razorpay (subscription, payment, invoice), and
 * /api/razorpay/subscription-status reads THAT, live, whenever the state is
 * needed. This handler therefore acknowledges verified events (200) and logs
 * them for the function log; it neither stores state nor grants entitlements.
 * When a datastore is founder-approved, the grant logic goes here, keyed on
 * the idempotent event id (`x-razorpay-event-id`).
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export const config = { api: { bodyParser: false } };

async function rawBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'method not allowed' });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('razorpay webhook: RAZORPAY_WEBHOOK_SECRET is not configured');
    return response.status(500).json({ error: 'webhook is not configured' });
  }

  const body = await rawBody(request);
  const signature = request.headers['x-razorpay-signature'];
  if (typeof signature !== 'string' || !signature) {
    console.error('razorpay webhook: missing signature header');
    return response.status(400).json({ verified: false });
  }

  const expected = Buffer.from(createHmac('sha256', secret).update(body).digest('hex'), 'utf8');
  const actual = Buffer.from(signature, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    console.error('razorpay webhook: SIGNATURE MISMATCH — event discarded');
    return response.status(400).json({ verified: false });
  }

  let event;
  try {
    event = JSON.parse(body.toString('utf8'));
  } catch {
    console.error('razorpay webhook: unparseable body on a valid signature');
    return response.status(400).json({ verified: false });
  }

  // Idempotency: Razorpay retries deliveries; the event id is stable across
  // retries. Nothing is granted here, so a replay grants nothing twice by
  // construction — and when a store exists, this id is the dedup key.
  const eventId = request.headers['x-razorpay-event-id'] ?? '(none)';
  console.log(
    `razorpay webhook VERIFIED: ${event.event ?? '(unnamed)'} event_id=${eventId} ` +
      `subscription=${event.payload?.subscription?.entity?.id ?? '-'} ` +
      `payment=${event.payload?.payment?.entity?.id ?? '-'}`,
  );

  return response.status(200).json({ verified: true });
}

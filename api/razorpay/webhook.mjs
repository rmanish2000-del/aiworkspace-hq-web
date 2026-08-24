/**
 * POST /api/razorpay/webhook — Vercel serverless function (R4-CHECKOUT,
 * 2026-08-18; made to deliver something under PAYER-GETS-SOMETHING,
 * 2026-08-24). The ONLY source of payment truth.
 *
 * Razorpay signs every webhook: `x-razorpay-signature` = HMAC-SHA256 of the
 * RAW body with the webhook secret configured in their dashboard. Verification
 * here is constant-time; a mismatch is 400 and the event is treated as never
 * having happened. The success redirect a browser follows proves NOTHING —
 * only an event that passes this check counts.
 *
 * ─── WHAT CHANGED ON 2026-08-24, AND WHY ──────────────────────────────────
 * Until today this handler's own comment said it "neither stores state nor
 * grants entitlements". That was honest, and it was also the largest hole in
 * the business: the site invites strangers to buy, money arrived, and the
 * buyer received a Razorpay receipt and nothing else — no confirmation from
 * us, no way to reach them, and no way for the founder to learn of them except
 * by opening a dashboard. A payment that produces nothing is worse than no
 * payment.
 *
 * So a verified capture now does three things before it answers:
 *   1. RECORDS the payer, where the record survives a restart;
 *   2. WRITES TO THEM, truthfully, with a real reply address;
 *   3. ALERTS THE FOUNDER, so he never learns of a customer by accident.
 *
 * ─── THE STORE, AND WHY IT IS NOT A NEW ONE ───────────────────────────────
 * The assignment says: if no store exists, choose the simplest one the repo
 * can already support, and say why. Razorpay is that store. The payment object
 * ALREADY persists, durably and queryably, every field the assignment asks for
 * — id, email, amount, timestamp, status — and this repo already reads it back
 * (`subscription-status`, `run-record`). What was missing was not storage but
 * OUR mark on it, so `notes` carries the delivery outcome. That needs no new
 * service, no new credential, and creates no second copy of a customer record
 * to drift out of step with the first.
 *
 * ─── IDEMPOTENCY ──────────────────────────────────────────────────────────
 * Keyed on the PAYMENT, not the event. Razorpay fires `payment.captured` AND
 * `subscription.charged` for one charge, and retries each; only the payment id
 * is stable across all of it. `aiwhq_welcome` on the payment is the marker,
 * and the mail provider is handed the same id as an `Idempotency-Key`.
 *
 * ─── WHEN DELIVERY FAILS ──────────────────────────────────────────────────
 * Never swallowed behind a 200, and never a retry storm either — those are
 * different failures and they get different answers:
 *   transient (provider 5xx, network, unreadable record) → 500, so Razorpay
 *     redelivers and the idempotency marker keeps it to one email;
 *   permanent (no mail provider configured, rejected sender) → 200, because
 *     redelivering a missing credential twenty times only gets the webhook
 *     DISABLED by Razorpay, which would cost us the payment record as well.
 *     The failure is written onto the payment as `aiwhq_welcome: FAILED …`,
 *     visible against that payment in the dashboard, and logged at error.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { isEmailConfigured, opsRecipient, sendEmail } from '../_lib/email.mjs';
import {
  ALERT_KEY,
  REPLY_TO,
  WELCOME_AT_KEY,
  WELCOME_KEY,
  alreadyWelcomed,
  founderAlertEmail,
  payerFromEvent,
  welcomeEmail,
} from '../_lib/payer.mjs';
import { readPaymentNotes, stampPaymentNote } from '../_lib/razorpay-note.mjs';

export const config = { api: { bodyParser: false } };

async function rawBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks);
}

/**
 * Record the payer and write to them. Returns whether Razorpay should retry.
 *
 * @returns {Promise<{ retry: boolean, outcome: string }>}
 */
async function deliverToPayer(payer) {
  // The idempotency marker has to be READ before anything is sent, and a read
  // we could not perform is not the same as "nothing sent yet".
  const existing = await readPaymentNotes(payer.paymentId);
  if (!existing.ok) {
    console.error(
      `payer delivery: cannot read the record for ${payer.paymentId} (${existing.reason}) — ` +
        'refusing to send blind; asking Razorpay to redeliver',
    );
    return { retry: true, outcome: `record-unreadable: ${existing.reason}` };
  }
  if (alreadyWelcomed(existing.notes)) {
    console.log(`payer delivery: ${payer.paymentId} already welcomed — duplicate suppressed`);
    return { retry: false, outcome: 'already-sent' };
  }

  // A payer with no email is a customer we cannot reach. That is a fact to
  // report loudly, not a branch to fall quietly out of.
  let welcome;
  if (!payer.email) {
    welcome = { sent: false, reason: 'razorpay-reported-no-email', permanent: true };
  } else {
    const body = welcomeEmail(payer);
    welcome = await sendEmail({
      to: payer.email,
      subject: body.subject,
      text: body.text,
      replyTo: REPLY_TO,
      idempotencyKey: payer.paymentId,
    });
  }

  const welcomeOutcome = welcome.sent ? 'sent' : `FAILED — ${welcome.reason}`;
  if (!welcome.sent) {
    console.error(
      `payer delivery: confirmation NOT sent for ${payer.paymentId} — ${welcome.reason}`,
    );
  }

  // The founder is told either way, including — especially — when the payer
  // could not be written to.
  const alertBody = founderAlertEmail(payer, welcomeOutcome);
  const ops = opsRecipient();
  const alert = ops
    ? await sendEmail({
        to: ops,
        subject: alertBody.subject,
        text: alertBody.text,
        replyTo: payer.email || REPLY_TO,
        idempotencyKey: `${payer.paymentId}:ops`,
      })
    : { sent: false, reason: 'OPS_EMAIL-not-configured', permanent: true };
  if (!alert.sent) {
    console.error(`payer delivery: FOUNDER NOT ALERTED for ${payer.paymentId} — ${alert.reason}`);
  }

  await stampPaymentNote(payer.paymentId, {
    [WELCOME_KEY]: welcomeOutcome.slice(0, 255),
    [WELCOME_AT_KEY]: new Date().toISOString(),
    [ALERT_KEY]: (alert.sent ? 'sent' : `FAILED — ${alert.reason}`).slice(0, 255),
  });

  const retry = (!welcome.sent && !welcome.permanent) || (!alert.sent && !alert.permanent);
  return { retry, outcome: `welcome=${welcomeOutcome} alert=${alert.sent ? 'sent' : 'FAILED'}` };
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

  const eventId = request.headers['x-razorpay-event-id'] ?? '(none)';
  console.log(
    `razorpay webhook VERIFIED: ${event.event ?? '(unnamed)'} event_id=${eventId} ` +
      `subscription=${event.payload?.subscription?.entity?.id ?? '-'} ` +
      `payment=${event.payload?.payment?.entity?.id ?? '-'}`,
  );

  // R4-SELF-EVIDENCING: the webhook is the server-side truth, so its verified
  // receipt is stamped onto the same payment object the return path uses. This
  // is what lets the run record say "the webhook arrived AND verified" without
  // a datastore and without anyone reading a dashboard.
  const paymentId = event.payload?.payment?.entity?.id;
  if (paymentId) {
    await stampPaymentNote(paymentId, {
      aiwhq_webhook: `${event.event ?? 'unnamed'} verified`,
      aiwhq_webhook_at: new Date().toISOString(),
      aiwhq_webhook_event_id: String(eventId),
    });
  }

  // Only a CAPTURED payment is a customer. Everything else — authorized,
  // failed, an event carrying no payment at all — is acknowledged and nothing
  // is claimed about it.
  const payer = payerFromEvent(event);
  if (!payer) {
    return response.status(200).json({ verified: true, delivered: false });
  }

  if (!isEmailConfigured()) {
    // Said once, at error level, with the exact remedy — because a payer is
    // now waiting and nothing will reach them until this is set.
    console.error(
      `payer delivery: RESEND_API_KEY is not configured — ${payer.paymentId} was captured and ` +
        'NOBODY has been written to. Set RESEND_API_KEY and OPS_EMAIL.',
    );
  }

  const { retry, outcome } = await deliverToPayer(payer);
  if (retry) {
    return response.status(500).json({ verified: true, delivered: false, outcome });
  }
  return response.status(200).json({ verified: true, delivered: true, outcome });
}

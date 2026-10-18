/**
 * Buyer confirmation and founder alert for one verified Razorpay payment.
 *
 * Idempotency is the payment id, stored on the payment's own notes
 * (`aiwhq_welcome` / `aiwhq_alert`) — the same durable record the Astro
 * webhook used. Resend is also given that id as an Idempotency-Key.
 *
 * Nothing here throws. The webhook must answer 200 after the signature
 * checks out even when mail is down; the error is logged instead.
 */
import { isEmailConfigured, opsRecipient, sendEmail } from "@/lib/email.server";
import {
  ALERT_KEY,
  REPLY_TO,
  WELCOME_AT_KEY,
  WELCOME_KEY,
  alreadyAlerted,
  founderAlertEmail,
  isPaymentAlertEvent,
  payerFromEvent,
  welcomeEmail,
  type PaymentAlertPayer,
  type RazorpayWebhookEvent,
} from "@/lib/payer.server";
import { readPaymentNotes, stampPaymentNote } from "@/lib/razorpay.server";

function eventName(event: RazorpayWebhookEvent): string {
  return typeof event.event === "string" ? event.event : "";
}

async function stampReceipt(
  paymentId: string,
  name: string,
  extra: Record<string, string> = {},
): Promise<void> {
  try {
    await stampPaymentNote(paymentId, {
      aiwhq_webhook: name,
      aiwhq_webhook_at: new Date().toISOString(),
      ...extra,
    });
  } catch (error) {
    console.error(`payment alert: could not stamp ${paymentId}`, error);
  }
}

async function sendBuyer(payer: PaymentAlertPayer): Promise<string> {
  if (!payer.email) {
    console.error(`payment alert: ${payer.paymentId} has no email — buyer not contacted`);
    return "FAILED — razorpay-reported-no-email";
  }

  const body = welcomeEmail(payer);
  const result = await sendEmail({
    to: payer.email,
    subject: body.subject,
    text: body.text,
    replyTo: REPLY_TO,
    idempotencyKey: payer.paymentId,
  });
  if (!result.sent) {
    console.error(`payment alert: buyer email NOT sent for ${payer.paymentId} — ${result.reason}`);
  }
  return result.sent ? "sent" : `FAILED — ${result.reason}`;
}

async function sendAdmin(payer: PaymentAlertPayer, welcomeOutcome: string): Promise<string> {
  const body = founderAlertEmail(payer, welcomeOutcome);
  const result = await sendEmail({
    to: opsRecipient(),
    subject: body.subject,
    text: body.text,
    replyTo: payer.email || REPLY_TO,
    idempotencyKey: `${payer.paymentId}:ops`,
  });
  if (!result.sent) {
    console.error(`payment alert: admin email NOT sent for ${payer.paymentId} — ${result.reason}`);
  }
  return result.sent ? "sent" : `FAILED — ${result.reason}`;
}

export async function deliverVerifiedPaymentAlert(event: RazorpayWebhookEvent): Promise<void> {
  const name = eventName(event);
  if (!isPaymentAlertEvent(name)) return;

  const payer = payerFromEvent(event);
  if (!payer) {
    const paymentId = event.payload?.payment?.entity?.id;
    if (typeof paymentId === "string") await stampReceipt(paymentId, name);
    return;
  }

  const existing = await readPaymentNotes(payer.paymentId);
  if (!existing.ok) {
    console.error(
      `payment alert: cannot read notes for ${payer.paymentId} (${existing.reason}) — sending with provider idempotency key`,
    );
  } else if (alreadyAlerted(existing.notes)) {
    console.log(`payment alert: ${payer.paymentId} already sent — duplicate suppressed`);
    await stampReceipt(payer.paymentId, name);
    return;
  }

  if (!isEmailConfigured()) {
    console.error(
      `payment alert: RESEND_API_KEY is not configured — ${payer.paymentId} was captured and nobody was emailed`,
    );
  }

  const welcomeOutcome = await sendBuyer(payer);
  const alertOutcome = await sendAdmin(payer, welcomeOutcome);

  await stampReceipt(payer.paymentId, name, {
    [WELCOME_KEY]: welcomeOutcome.slice(0, 255),
    [WELCOME_AT_KEY]: new Date().toISOString(),
    [ALERT_KEY]: alertOutcome.slice(0, 255),
  });
}

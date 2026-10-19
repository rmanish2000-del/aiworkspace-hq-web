/**
 * POST /api/razorpay/webhook — the only source of payment truth.
 *
 * Razorpay signs every webhook: `x-razorpay-signature` = HMAC-SHA256 of the
 * RAW body with the webhook secret. Verification is constant-time; a mismatch
 * is 400 and the event is treated as never having happened.
 *
 * A verified `payment.captured`, `subscription.charged`, or
 * `subscription.activated` event that carries a captured payment emails the
 * buyer and the founder (Resend). The browser return path is not a trigger.
 * Mail is idempotent on the payment id. If sending fails, the error is logged
 * and this handler still returns 200 — a 500 would make Razorpay retry the
 * event, and a thrown mail error must not do that.
 */
import { createFileRoute } from "@tanstack/react-router";

import { deliverVerifiedPaymentAlert } from "@/lib/payment-alert.server";
import type { RazorpayWebhookEvent } from "@/lib/payer.server";
import { hmacHex, signatureMatches } from "@/lib/razorpay.server";

export async function handleRazorpayWebhook(request: Request): Promise<Response> {
  const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
  if (!secret) {
    console.error("razorpay webhook: no webhook secret configured");
    return Response.json({ error: "webhook is not configured" }, { status: 500 });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!signature || !signatureMatches(hmacHex(secret, raw), signature)) {
    console.error("razorpay webhook: signature mismatch — event discarded");
    return Response.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(raw) as RazorpayWebhookEvent;
  } catch {
    return Response.json({ error: "unparseable body" }, { status: 400 });
  }

  const paymentId = event.payload?.payment?.entity?.id;
  console.log(
    `razorpay webhook: ${typeof event.event === "string" ? event.event : "unnamed"} verified`,
    typeof paymentId === "string" ? paymentId : "no-payment-id",
  );

  try {
    await deliverVerifiedPaymentAlert(event);
  } catch (error) {
    console.error("razorpay webhook: payment alert failed", error);
  }

  return Response.json({ ok: true });
}

export const Route = createFileRoute("/api/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => handleRazorpayWebhook(request),
    },
  },
});

/**
 * POST /api/razorpay/webhook — the only source of payment truth.
 *
 * Razorpay signs every webhook: `x-razorpay-signature` = HMAC-SHA256 of the
 * RAW body with the webhook secret. Verification is constant-time; a mismatch
 * is 400 and the event is treated as never having happened. A verified capture
 * stamps the payment itself (Razorpay's own durable object) with the outcome,
 * which is what /api/razorpay/run-record and the dashboard read back.
 */
import { createFileRoute } from "@tanstack/react-router";

import { hmacHex, signatureMatches, stampPaymentNote } from "@/lib/razorpay.server";

export const Route = createFileRoute("/api/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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

        let event: any;
        try {
          event = JSON.parse(raw);
        } catch {
          return Response.json({ error: "unparseable body" }, { status: 400 });
        }

        const payment =
          event?.payload?.payment?.entity ?? event?.payload?.subscription?.entity ?? null;
        const paymentId: string | undefined = event?.payload?.payment?.entity?.id;

        console.log(
          `razorpay webhook: ${event?.event} verified`,
          paymentId ?? payment?.id ?? "no-payment-id",
        );

        if (paymentId && (event?.event === "payment.captured" || event?.event === "subscription.charged")) {
          await stampPaymentNote(paymentId, {
            aiwhq_webhook: event.event,
            aiwhq_webhook_at: new Date().toISOString(),
          });
        }

        return Response.json({ ok: true });
      },
    },
  },
});

/**
 * POST/GET /api/razorpay/return — the bank-redirect landing.
 *
 * Razorpay's redirect flow posts razorpay_payment_id, razorpay_subscription_id
 * and razorpay_signature to callback_url. The SUBSCRIPTION-flow signature is
 * HMAC-SHA256 over `payment_id|subscription_id` (not the order-flow layout).
 * Verified constant-time server-side, then 303 to /checkout carrying only
 * public identifiers. Every invocation stamps its own outcome on the payment,
 * so silence in the record means one thing only: we were never called.
 */
import { createFileRoute } from "@tanstack/react-router";

import { hmacHex, signatureMatches, stampPaymentNote } from "@/lib/razorpay.server";

const PAYMENT_ID = /^pay_[A-Za-z0-9]+$/;

function parseParams(raw: string, url: string, contentType: string | null) {
  const fromQuery = new URL(url).searchParams;
  let body = new URLSearchParams(raw);
  let shape = "form";

  if ((contentType ?? "").includes("json") || raw.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      body = new URLSearchParams(Object.entries(parsed).map(([k, v]) => [k, String(v)]));
      shape = "json";
    } catch {
      shape = "unparseable-body";
    }
  }

  const pick = (name: string) => body.get(name) ?? fromQuery.get(name) ?? "";
  const keysSeen = [...new Set([...body.keys(), ...fromQuery.keys()])].join(",") || "none";
  return {
    paymentId: pick("razorpay_payment_id"),
    subscriptionId: pick("razorpay_subscription_id"),
    orderId: pick("razorpay_order_id"),
    signature: pick("razorpay_signature"),
    shape,
    keysSeen,
  };
}

async function handle(request: Request): Promise<Response> {
  const raw = request.method === "GET" ? "" : await request.text();
  const { paymentId, subscriptionId, orderId, signature, shape, keysSeen } = parseParams(
    raw,
    request.url,
    request.headers.get("content-type"),
  );

  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  const arrival = {
    aiwhq_return_at: new Date().toISOString(),
    aiwhq_return_shape: `${request.method}/${shape}`,
    aiwhq_return_keys: keysSeen,
  };

  const bounce = async (reason: string) => {
    console.error(`razorpay return: ${reason} (${request.method}/${shape}, keys: ${keysSeen})`);
    if (PAYMENT_ID.test(paymentId)) {
      await stampPaymentNote(paymentId, { ...arrival, aiwhq_return: reason });
    }
    return new Response(null, {
      status: 303,
      headers: { location: `/checkout?return=unverified&why=${encodeURIComponent(reason)}` },
    });
  };

  if (!keySecret) return bounce("no-key-configured");
  if (!PAYMENT_ID.test(paymentId)) return bounce("malformed-or-missing-payment-id");
  if (!subscriptionId.startsWith("sub_")) {
    return bounce(orderId ? "order-flow-callback-not-subscription" : "missing-subscription-id");
  }
  if (!signature) return bounce("missing-signature");

  if (!signatureMatches(hmacHex(keySecret, `${paymentId}|${subscriptionId}`), signature)) {
    return bounce("signature-mismatch");
  }

  await stampPaymentNote(paymentId, {
    ...arrival,
    aiwhq_return: "verified",
    aiwhq_subscription: subscriptionId,
  });

  return new Response(null, {
    status: 303,
    headers: { location: `/checkout?return=paid&sub=${encodeURIComponent(subscriptionId)}` },
  });
}

export const Route = createFileRoute("/api/razorpay/return")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});

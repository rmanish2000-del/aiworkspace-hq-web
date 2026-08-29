/**
 * GET /api/razorpay/readiness — operator-facing configuration report.
 * Names what is configured; never echoes a key or a secret.
 */
import { createFileRoute } from "@tanstack/react-router";

import { LIVE_PAYMENTS_RELEASED, keyClass, razorpay, readCredentials } from "@/lib/razorpay.server";

export const Route = createFileRoute("/api/razorpay/readiness")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const readinessToken = process.env["RAZORPAY_READINESS_TOKEN"];
        if (!readinessToken || request.headers.get("x-readiness-token") !== readinessToken) {
          return new Response("Not found", { status: 404 });
        }

        const keyId = process.env["RAZORPAY_KEY_ID"];
        const keySecret = process.env["RAZORPAY_KEY_SECRET"];
        const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        const credentials = readCredentials();

        let upstream = "not-attempted";
        if (credentials) {
          try {
            const probe = await razorpay("plans?count=1", credentials);
            upstream = probe.ok ? "authenticated" : `rejected-${probe.status}`;
          } catch {
            upstream = "unreachable";
          }
        }

        return Response.json({
          key_id_present: Boolean(keyId),
          key_secret_present: Boolean(keySecret),
          webhook_secret_present: Boolean(webhookSecret),
          key_class: keyClass(keyId),
          live_payments_released: LIVE_PAYMENTS_RELEASED,
          credentials_allowed: Boolean(credentials),
          upstream,
          checkout_page: "/checkout",
          checked_at: new Date().toISOString(),
        });
      },
    },
  },
});

/**
 * GET /api/razorpay/subscription-status?id=sub_… — asks Razorpay itself.
 * "active"/"authenticated" from HERE is the only thing the UI may present as
 * paid; a redirect proves nothing.
 */
import { createFileRoute } from "@tanstack/react-router";

import { razorpay, readCredentials } from "@/lib/razorpay.server";

export const Route = createFileRoute("/api/razorpay/subscription-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const credentials = readCredentials();
        if (!credentials) {
          console.error("razorpay: credentials missing or not allowed");
          return Response.json({ error: "payments are not configured" }, { status: 500 });
        }

        const id = new URL(request.url).searchParams.get("id") ?? "";
        if (!/^sub_[A-Za-z0-9]+$/.test(id)) {
          return Response.json({ error: "id must be a Razorpay subscription id" }, { status: 400 });
        }

        try {
          const upstream = await razorpay(`subscriptions/${id}`, credentials);
          if (!upstream.ok) {
            console.error("razorpay: status lookup failed", upstream.status);
            return Response.json(
              { error: "not found" },
              { status: upstream.status === 400 ? 404 : 500 },
            );
          }
          return Response.json({
            subscription_id: upstream.payload.id,
            status: upstream.payload.status,
            current_end: upstream.payload.current_end ?? null,
          });
        } catch (error) {
          console.error("razorpay: subscription-status threw", error);
          return Response.json({ error: "payment provider error" }, { status: 500 });
        }
      },
    },
  },
});

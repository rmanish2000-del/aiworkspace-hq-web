/**
 * POST /api/razorpay/create-subscription — port of the pre-redesign Vercel
 * function. Creates a monthly Warrant Guardian subscription at the founder
 * sealed price (₹999/mo, PRICING-SEAL 2026-08-18) and returns only what the
 * checkout modal needs. The amount is never taken from the browser.
 */
import { createFileRoute } from "@tanstack/react-router";

import { razorpay, readCredentials } from "@/lib/razorpay.server";

const SEALED_INR = 999;
const PLAN_PERIOD = "monthly";
const PLAN_ITEM = {
  name: "Warrant Guardian — monthly",
  amount: SEALED_INR * 100, // paise
  currency: "INR",
  description: "Warrant Guardian subscription at the founder-sealed price (PRICING-SEAL.json)",
};

export const Route = createFileRoute("/api/razorpay/create-subscription")({
  server: {
    handlers: {
      POST: async () => {
        const credentials = readCredentials();
        if (!credentials) {
          console.error("razorpay: credentials are missing or not allowed");
          return Response.json({ error: "payments are not configured" }, { status: 500 });
        }

        try {
          const plans = await razorpay("plans?count=100", credentials);
          if (plans.status === 401) {
            return Response.json(
              { error: "payment provider rejected the credentials" },
              { status: 401 },
            );
          }
          if (!plans.ok) {
            console.error("razorpay: plan lookup failed", plans.status);
            return Response.json({ error: "payment provider error" }, { status: 500 });
          }

          let plan = (plans.payload.items ?? []).find(
            (candidate: any) =>
              candidate.period === PLAN_PERIOD &&
              candidate.item?.amount === PLAN_ITEM.amount &&
              candidate.item?.currency === "INR",
          );
          if (!plan) {
            const created = await razorpay("plans", credentials, {
              method: "POST",
              body: JSON.stringify({ period: PLAN_PERIOD, interval: 1, item: PLAN_ITEM }),
            });
            if (!created.ok) {
              console.error("razorpay: plan creation failed", created.status);
              return Response.json({ error: "payment provider error" }, { status: 500 });
            }
            plan = created.payload;
          }

          const subscription = await razorpay("subscriptions", credentials, {
            method: "POST",
            body: JSON.stringify({
              plan_id: plan.id,
              total_count: 120,
              customer_notify: 1,
              notes: {
                surface: "aiworkspacehq.com/checkout",
                seal: "PRICING-SEAL 2026-08-18 OK B",
              },
            }),
          });
          if (!subscription.ok) {
            console.error("razorpay: subscription creation failed", subscription.status);
            return Response.json({ error: "payment provider error" }, { status: 500 });
          }

          return Response.json({
            subscription_id: subscription.payload.id,
            key_id: credentials.keyId,
            amount_inr: SEALED_INR,
          });
        } catch (error) {
          console.error("razorpay: create-subscription threw", error);
          return Response.json({ error: "payment provider error" }, { status: 500 });
        }
      },
    },
  },
});

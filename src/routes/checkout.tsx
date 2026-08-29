/**
 * /checkout — restored after the redesign migration (was src/pages/checkout.astro).
 *
 * The one page that ships client JavaScript. Honesty contract preserved:
 *   - the price shown is the founder-sealed value, never free text;
 *   - GST is stated BEFORE the pay button;
 *   - a dismissed modal is a normal outcome, not an error;
 *   - "payment received" is only said after /api/razorpay/subscription-status
 *     (which asks Razorpay itself) answers authenticated/active.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

import { Section } from "@/components/site/primitives";

const SEALED_INR = 999;
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Warrant Guardian subscription | AI Workspace" },
      {
        name: "description",
        content:
          "Subscribe to Warrant Guardian at the founder-sealed price of ₹999 per month. GST as applicable is added at payment.",
      },
      { property: "og:title", content: "Checkout — Warrant Guardian subscription" },
      {
        property: "og:description",
        content: "Warrant Guardian monthly subscription checkout, operated by Kartavya CSC Digital Seva.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function CheckoutPage() {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  const rupees = SEALED_INR.toLocaleString("en-IN");

  // Return leg from the bank redirect: confirm with Razorpay before saying anything is paid.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("return") === "paid" && params.get("sub")) {
      setState("Payment submitted — confirming with the payment provider…");
      fetch(`/api/razorpay/subscription-status?id=${encodeURIComponent(params.get("sub")!)}`)
        .then((response) => (response.ok ? response.json() : null))
        .then((truth) => {
          if (truth && (truth.status === "active" || truth.status === "authenticated")) {
            setState(
              `Payment received — subscription ${truth.subscription_id} is ${truth.status}. A receipt follows from Razorpay.`,
            );
          } else {
            setState(
              `Your payment was submitted but is not confirmed yet (status: ${truth ? truth.status : "unknown"}). If money left your account it will reconcile.`,
            );
          }
        })
        .catch(() => setState("Your payment was submitted but confirmation could not be fetched."));
    } else if (params.get("return") === "unverified") {
      setState(
        "The return from the payment page could not be verified, so nothing is shown as paid. If you completed a payment it is still real — Razorpay will email a receipt.",
      );
    }
  }, []);

  const pay = useCallback(async () => {
    setBusy(true);
    setState("Preparing your subscription…");

    const ready = await loadRazorpay();
    if (!ready) {
      setBusy(false);
      setState("The payment window could not load. Nothing was charged.");
      return;
    }

    let order: { subscription_id: string; key_id: string };
    try {
      const created = await fetch("/api/razorpay/create-subscription", { method: "POST" });
      if (!created.ok) {
        setBusy(false);
        setState("Payments are not available right now. Nothing was charged.");
        return;
      }
      order = await created.json();
    } catch {
      setBusy(false);
      setState("Payments are not available right now. Nothing was charged.");
      return;
    }

    const rzp = new (window as any).Razorpay({
      key: order.key_id,
      subscription_id: order.subscription_id,
      name: "Warrant Guardian",
      description: "Monthly subscription",
      // Bank authentication (3DS) redirects rather than returning to the modal.
      // Redirect-only is the only shape that survives the window closing: the
      // browser posts to /api/razorpay/return, which verifies the signature
      // server-side before anything is shown or recorded.
      callback_url: `${window.location.origin}/api/razorpay/return`,
      redirect: true,
      modal: {
        ondismiss: () => {
          setBusy(false);
          setState("Checkout closed — nothing was charged. You can try again any time.");
        },
      },
    });
    rzp.on("payment.failed", (failure: any) => {
      setBusy(false);
      setState(
        `The payment did not go through (${failure?.error?.description ?? "declined"}). Nothing was charged.`,
      );
    });
    rzp.open();
  }, []);

  return (
    <Section eyebrow="Checkout" heading="Warrant Guardian">
      <div className="max-w-2xl">
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          Warrant Guardian — <strong className="text-foreground">₹{rupees} per month</strong>. GST as
          applicable is added at payment.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 md:p-7">
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">₹{rupees}</span>
            <span className="text-sm text-muted-foreground">per month</span>
          </p>
          <button
            id="pay"
            type="button"
            onClick={pay}
            disabled={busy}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
          >
            <Lock className="size-4" aria-hidden /> Subscribe — ₹{rupees}/month
          </button>
          <p id="state" aria-live="polite" className="mt-4 min-h-6 text-sm text-muted-foreground">
            {state}
          </p>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            Payment is processed by Razorpay. Card details never reach this site.
          </p>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Operated by Kartavya CSC Digital Seva. Before paying, you can read the{" "}
          <a className="link-quiet" href="/terms">Terms of Service</a>,{" "}
          <a className="link-quiet" href="/privacy">Privacy Policy</a>,{" "}
          <a className="link-quiet" href="/refunds">Refund and Cancellation Policy</a>,{" "}
          <a className="link-quiet" href="/delivery">Delivery Policy</a>,{" "}
          <a className="link-quiet" href="/contact">Contact</a> and{" "}
          <a className="link-quiet" href="/about">About</a> pages.
        </p>
      </div>
    </Section>
  );
}

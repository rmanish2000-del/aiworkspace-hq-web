import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, CreditCard, Lock, RefreshCcw, Users } from "lucide-react";
import { pricingPage as copy } from "@/content/pricing-page";
import { Card, Section, StatusChip } from "@/components/site/primitives";
import { CtaBand, PageHero, SignalStrip } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

/**
 * The price figures are the founder's sealed values, recorded in
 * docs/governance/PRICING-SEAL.json of the source repository
 * (₹999 / $12 flat monthly, sealed 2026-08-18).
 */
const SEAL = {
  inr: 999,
  usd: 12,
  date: "2026-08-18",
} as const;

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const signals = [
  { icon: BadgeCheck, label: "Sealed Price" },
  { icon: CreditCard, label: "Flat Monthly" },
  { icon: Users, label: "No Seat Tiers" },
  { icon: Lock, label: "No Hidden Add-ons" },
  { icon: RefreshCcw, label: "Cancel Anytime" },
];

const included = [
  "Full access to the operating layer as it ships",
  "Governance, provenance, and human authorization on every task",
  "Evidence records you can export and hand to an auditor",
  "Direct line to the founder for questions before you pay",
];

function PricingPage() {
  const rupees = SEAL.inr.toLocaleString("en-IN");
  const dollars = SEAL.usd.toLocaleString("en-US");

  return (
    <>
      <PageHero
        badge="Pricing"
        title={copy.heading}
        lead="One flat monthly price. No seat tiers, no usage meters, no quote gate."
        primary={{ to: "/checkout", label: "Subscribe — ₹999/mo" }}
        secondary={{ to: "/platform", label: "Explore Platform" }}
        aside={
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-muted/60 px-5 py-3">
              <span className="text-xs text-muted-foreground">Single plan</span>
              <StatusChip tone="verified">Sealed {SEAL.date}</StatusChip>
            </div>
            <div className="p-6 md:p-7">
              <p className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">₹{rupees}</span>
                <span className="text-sm text-muted-foreground">{copy.perMonth}</span>
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                GST as applicable · about {`$${dollars}`} {copy.perMonth}
              </p>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/checkout"
                className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Subscribe <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        }
      />

      <SignalStrip label="Pricing commitments" items={signals} />

      <Section eyebrow="How billing works" heading="Plainly stated, nothing buried">
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "What you pay",
              body: `A flat ₹${rupees} ${copy.perMonth}, GST as applicable — about $${dollars} ${copy.perMonth}. No seat tiers and no usage meters.`,
            },
            {
              title: "Where you subscribe",
              body: "Subscribe on the checkout page. The same flat price applies whether you are one person or a team.",
            },
            {
              title: "Questions before paying",
              body: "Email founder@aiworkspacehq.com before you pay. The inbox is monitored and answered by the founder.",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <Card className="h-full transition-colors duration-200 hover:border-primary/40">
                <h3 className="h3">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="/checkout" className="link-quiet inline-flex min-h-11 items-center text-sm font-medium sm:min-h-0">Go to checkout →</a>
          <a
            href="mailto:founder@aiworkspacehq.com"
            className="link-quiet inline-flex min-h-11 items-center text-sm font-medium sm:min-h-0"
          >
            founder@aiworkspacehq.com
          </a>
        </div>
        <p className="micro-notice mt-8">
          {copy.sealLead} {SEAL.date}.
        </p>
      </Section>

      <CtaBand
        heading="One price, one system, one record of the work"
        lead="Start now, or ask questions first — both go to the founder."
        primary={{ to: "/checkout", label: "Subscribe" }}
        secondary={{ to: "/products", label: "See Products" }}
      />
    </>
  );
}

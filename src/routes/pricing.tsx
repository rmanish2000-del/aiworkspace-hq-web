import { createFileRoute } from "@tanstack/react-router";
import { pricingPage as copy } from "@/content/pricing-page";
import { PageHead, Section } from "@/components/site/primitives";

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

function PricingPage() {
  const rupees = SEAL.inr.toLocaleString("en-IN");
  const dollars = SEAL.usd.toLocaleString("en-US");

  return (
    <>
      <PageHead title={copy.heading} />
      <Section>
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="lead">
            {copy.priceLeadBefore}
            <strong className="font-semibold text-foreground">
              ₹{rupees} {copy.perMonth}
            </strong>
            {copy.gstNote}
            <span className="text-muted-foreground">
              ({copy.about} ${dollars} {copy.perMonth})
            </span>
            .
          </p>
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            {copy.subscribeAt}{" "}
            <a href="/checkout" className="text-foreground underline underline-offset-4 hover:text-primary">
              /checkout
            </a>
            . {copy.questionsBeforePay}{" "}
            <a
              href="mailto:founder@aiworkspacehq.com"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              founder@aiworkspacehq.com
            </a>{" "}
            {copy.monitored}
          </p>
          <p className="micro-notice">
            {copy.sealLead} {SEAL.date}.
          </p>
        </div>
      </Section>
    </>
  );
}

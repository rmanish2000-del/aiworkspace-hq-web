import { createFileRoute } from "@tanstack/react-router";
import { WITHHELD_NOTICE } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — AI Workspace" },
      {
        name: "description",
        content: "Security: what we can say, and what we cannot.",
      },
      { property: "og:title", content: "Security — AI Workspace" },
      {
        property: "og:description",
        content: "Security: what we can say, and what we cannot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <>
      <PageHero
        badge="Security"
        title={<LedgerBlock id="CB-70" badge={false} bare />}
        primary={{ to: "/contact", label: "Ask For Evidence" }}
        secondary={{ to: "/trust", label: "Read Trust" }}
      />

      <Section eyebrow="Boundary" heading="The gate on this page" id="notice-heading">
        <LedgerBlock
          id="CB-71"
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <Section eyebrow="Evidence" heading="What is true today" id="facts-heading">
        <TermList
          items={["CB-72", "CB-73"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
        <p className="micro-notice mt-8">{WITHHELD_NOTICE}</p>
      </Section>

      <Section eyebrow="Limits" heading="Where this page stops" id="boundary-heading">
        <LedgerBlock
          id="CB-75"
          badge={false}
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <CtaBand
        heading="Security review before deployment"
        lead="We share what exists and name what does not."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/enterprise", label: "For Enterprise" }}
      />
    </>
  );
}

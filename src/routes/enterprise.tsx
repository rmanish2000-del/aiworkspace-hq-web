import { createFileRoute } from "@tanstack/react-router";
import { REVIEW_STAMP } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";

export const Route = createFileRoute("/enterprise")({
  head: () => ({
    meta: [
      { title: "For enterprise — AI Workspace" },
      {
        name: "description",
        content: "The questions an evaluator asks, answered honestly.",
      },
      { property: "og:title", content: "For enterprise — AI Workspace" },
      {
        property: "og:description",
        content: "The questions an evaluator asks, answered honestly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnterprisePage,
});

function EnterprisePage() {
  return (
    <>
      <PageHero
        badge="For enterprise"
        title={<LedgerBlock id="CB-50" badge={false} bare />}
        lead={<LedgerBlock id="CB-51" badge={false} bare />}
        primary={{ to: "/contact", label: "Request Early Access" }}
        secondary={{ to: "/trust", label: "Read Trust" }}
        chip={`Last reviewed ${REVIEW_STAMP}`}
      />

      <Section eyebrow="Evaluation" heading="The questions" id="questions-heading">
        <TermList
          items={["CB-52", "CB-53", "CB-54", "CB-55", "CB-56"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section eyebrow="Accountability" heading="Who decides" id="governance-heading">
        <LedgerBlock
          id="CB-57"
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <CtaBand
        heading="Bring your evaluation questions"
        lead="We answer with the record, or we tell you the answer does not exist yet."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/security", label: "Read Security" }}
      />
    </>
  );
}

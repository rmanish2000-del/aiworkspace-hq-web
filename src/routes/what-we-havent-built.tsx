import { createFileRoute } from "@tanstack/react-router";
import { REVIEW_STAMP } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";

export const Route = createFileRoute("/what-we-havent-built")({
  head: () => ({
    meta: [
      { title: "What we have not built — AI Workspace" },
      {
        name: "description",
        content: "A list of gaps, kept current, in plain language.",
      },
      { property: "og:title", content: "What we have not built — AI Workspace" },
      {
        property: "og:description",
        content: "A list of gaps, kept current, in plain language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GapsPage,
});

function GapsPage() {
  return (
    <>
      <PageHero
        badge="What we have not built"
        title={<LedgerBlock id="CB-40" badge={false} bare />}
        lead={<LedgerBlock id="CB-41" badge={false} bare />}
        primary={{ to: "/building", label: "What We Are Building" }}
        secondary={{ to: "/trust", label: "Read Trust" }}
        chip={`Last reviewed ${REVIEW_STAMP}`}
      />

      <Section eyebrow="Published gaps" heading="The gaps" id="gaps-heading">
        <TermList
          items={["CB-42", "CB-43", "CB-44", "CB-45", "CB-46", "CB-47"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section eyebrow="Reasoning" heading="Why we publish this" id="why-heading">
        <LedgerBlock
          id="CB-48"
          className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground"
        />
      </Section>

      <CtaBand
        heading="Ask about a gap that matters to you"
        lead="If it is not built, we will say so and tell you what would change that."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/resources", label: "Browse Resources" }}
      />
    </>
  );
}

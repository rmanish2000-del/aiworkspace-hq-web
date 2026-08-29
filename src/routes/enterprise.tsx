import { createFileRoute } from "@tanstack/react-router";
import { REVIEW_STAMP } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { PageHead, Section, TermList } from "@/components/site/primitives";

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
      <PageHead
        eyebrow="For enterprise"
        title={<LedgerBlock id="CB-50" badge={false} bare />}
        lead={<LedgerBlock id="CB-51" badge={false} bare />}
      />

      <Section heading="The questions" id="questions-heading">
        <TermList
          items={["CB-52", "CB-53", "CB-54", "CB-55", "CB-56"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section heading="Who decides" id="governance-heading">
        <LedgerBlock id="CB-57" className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground" />
      </Section>

      <p className="micro-notice">Last reviewed {REVIEW_STAMP}.</p>
    </>
  );
}

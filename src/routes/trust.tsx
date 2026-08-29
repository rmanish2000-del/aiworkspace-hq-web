import { createFileRoute } from "@tanstack/react-router";
import { REVIEW_STAMP, WITHHELD_NOTICE } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { PageHead, Section, TermList } from "@/components/site/primitives";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust — AI Workspace" },
      {
        name: "description",
        content: "What we can be held to, and what we cannot.",
      },
      { property: "og:title", content: "Trust — AI Workspace" },
      {
        property: "og:description",
        content: "What we can be held to, and what we cannot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrustPage,
});

function TrustPage() {
  return (
    <>
      <PageHead
        eyebrow="Trust"
        title={<LedgerBlock id="CB-10" badge={false} bare />}
        lead={<LedgerBlock id="CB-11" badge={false} bare />}
      />

      <Section heading="What we do not have" id="missing-heading">
        <TermList
          items={["CB-12", "CB-13", "CB-14", "CB-15"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section heading="What we can show you" id="method-heading">
        <TermList
          items={["CB-16", "CB-17"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section heading="How we use AI" id="ai-heading">
        <TermList
          items={["CB-18", "CB-19", "CB-20"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
        <p className="micro-notice mt-8">{WITHHELD_NOTICE}</p>
      </Section>

      <p className="micro-notice">Last reviewed {REVIEW_STAMP}.</p>
    </>
  );
}

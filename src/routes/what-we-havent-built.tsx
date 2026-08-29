import { createFileRoute } from "@tanstack/react-router";
import { REVIEW_STAMP } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { PageHead, Section, TermList } from "@/components/site/primitives";

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
      <PageHead
        eyebrow="What we have not built"
        title={<LedgerBlock id="CB-40" badge={false} bare />}
        lead={<LedgerBlock id="CB-41" badge={false} bare />}
      />

      <Section heading="The gaps" id="gaps-heading">
        <TermList
          items={["CB-42", "CB-43", "CB-44", "CB-45", "CB-46", "CB-47"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section heading="Why we publish this" id="why-heading">
        <LedgerBlock id="CB-48" className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground" />
      </Section>

      <p className="micro-notice">Last reviewed {REVIEW_STAMP}.</p>
    </>
  );
}

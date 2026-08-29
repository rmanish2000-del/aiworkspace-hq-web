import { createFileRoute } from "@tanstack/react-router";
import { WITHHELD_NOTICE } from "@/content/ledger";
import { LedgerBlock } from "@/components/site/ledger-block";
import { PageHead, Section, TermList } from "@/components/site/primitives";

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
      <PageHead eyebrow="Security" title={<LedgerBlock id="CB-70" badge={false} />} />

      <Section heading="The gate on this page" id="notice-heading">
        <LedgerBlock id="CB-71" className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground" />
      </Section>

      <Section heading="What is true today" id="facts-heading">
        <TermList
          items={["CB-72", "CB-73"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
        <p className="micro-notice mt-8">{WITHHELD_NOTICE}</p>
      </Section>

      <Section heading="Where this page stops" id="boundary-heading">
        <LedgerBlock id="CB-75" badge={false} className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground" />
      </Section>
    </>
  );
}

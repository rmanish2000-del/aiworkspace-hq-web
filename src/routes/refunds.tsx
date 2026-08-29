import { createFileRoute } from "@tanstack/react-router";
import markdown from "@/content/legal/refunds.md?raw";
import { LegalDoc } from "@/components/site/legal-doc";
import { PageHead, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refunds — AI Workspace" },
      {
        name: "description",
        content: "The refund policy for AI Workspace purchases.",
      },
      { property: "og:title", content: "Refunds — AI Workspace" },
      {
        property: "og:description",
        content: "The refund policy for AI Workspace purchases.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Refunds" />
      <Section>
        <LegalDoc markdown={markdown} />
      </Section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import markdown from "@/content/legal/delivery.md?raw";
import { LegalDoc } from "@/components/site/legal-doc";
import { PageHead, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery — AI Workspace" },
      {
        name: "description",
        content: "How AI Workspace delivers access after purchase.",
      },
      { property: "og:title", content: "Delivery — AI Workspace" },
      {
        property: "og:description",
        content: "How AI Workspace delivers access after purchase.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Delivery" />
      <Section>
        <LegalDoc markdown={markdown} />
      </Section>
    </>
  );
}

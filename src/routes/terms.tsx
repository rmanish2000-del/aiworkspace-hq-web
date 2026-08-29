import { createFileRoute } from "@tanstack/react-router";
import markdown from "@/content/legal/terms.md?raw";
import { LegalDoc } from "@/components/site/legal-doc";
import { PageHead, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — AI Workspace" },
      {
        name: "description",
        content: "The terms that govern use of AI Workspace products and services.",
      },
      { property: "og:title", content: "Terms — AI Workspace" },
      {
        property: "og:description",
        content: "The terms that govern use of AI Workspace products and services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Terms" />
      <Section>
        <LegalDoc markdown={markdown} />
      </Section>
    </>
  );
}

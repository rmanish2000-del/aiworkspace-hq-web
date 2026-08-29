import { createFileRoute } from "@tanstack/react-router";
import markdown from "@/content/legal/privacy.md?raw";
import { LegalDoc } from "@/components/site/legal-doc";
import { PageHead, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — AI Workspace" },
      {
        name: "description",
        content: "How AI Workspace handles personal data, logs, and analytics.",
      },
      { property: "og:title", content: "Privacy — AI Workspace" },
      {
        property: "og:description",
        content: "How AI Workspace handles personal data, logs, and analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHead eyebrow="Legal" title="Privacy" />
      <Section>
        <LegalDoc markdown={markdown} />
      </Section>
    </>
  );
}

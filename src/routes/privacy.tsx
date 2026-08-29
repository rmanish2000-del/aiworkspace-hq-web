import { createFileRoute } from "@tanstack/react-router";
import markdown from "@/content/legal/privacy.md?raw";
import { LegalDoc } from "@/components/site/legal-doc";
import { Section } from "@/components/site/primitives";
import { PageHero } from "@/components/site/page-shell";

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
      <PageHero badge="Legal" title="Privacy" />
      <Section>
        <LegalDoc markdown={markdown} />
      </Section>
    </>
  );
}

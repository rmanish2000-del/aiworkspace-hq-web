import { createFileRoute } from "@tanstack/react-router";
import { principles as copy, principlesPage as page } from "@/content/copy";
import { Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";

export const Route = createFileRoute("/principles")({
  head: () => ({
    meta: [
      { title: page.metaTitle },
      { name: "description", content: page.metaDescription },
      { property: "og:title", content: page.metaTitle },
      { property: "og:description", content: page.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrinciplesPage,
});

function PrinciplesPage() {
  return (
    <>
      <PageHero
        badge="Principles"
        title={copy.heading}
        lead={page.lead}
        primary={{ to: "/trust", label: "Read Trust" }}
        secondary={{ to: "/what-we-havent-built", label: "What We Haven't Built" }}
      />

      <Section eyebrow="The rules" heading="What we hold ourselves to">
        <TermList
          className="mt-2"
          items={copy.items.map((p) => ({
            title: p.title,
            body: p.gloss,
          }))}
        />
      </Section>

      <Section eyebrow="In practice" heading={page.meaningHeading}>
        <TermList items={page.meaningPoints.map((p) => ({ body: p }))} />
      </Section>

      <CtaBand
        heading="Hold us to these in an evaluation"
        lead="Ask for the evidence behind any principle on this page."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/resources", label: "Browse Resources" }}
      />
    </>
  );
}

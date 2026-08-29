import { createFileRoute } from "@tanstack/react-router";
import { principles as copy, principlesPage as page } from "@/content/copy";
import { PageHead, Section, TermList } from "@/components/site/primitives";

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
      <PageHead eyebrow={copy.eyebrow} title={page.heading} lead={page.lead} />

      <Section>
        <TermList
          items={copy.items.map((p) => ({
            index: p.index,
            title: p.name,
            body: (
              <>
                <span className="text-foreground">{p.statement}</span>
                <br />
                {p.detail}
              </>
            ),
          }))}
        />
      </Section>

      <Section heading={page.meaningHeading}>
        <TermList items={page.meaningPoints.map((p) => ({ body: p }))} />
      </Section>
    </>
  );
}

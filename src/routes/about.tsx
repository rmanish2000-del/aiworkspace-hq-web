import { createFileRoute } from "@tanstack/react-router";
import { about as copy } from "@/content/copy";
import { ArrowLink, Card, PageHead, Section, TermList } from "@/components/site/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHead title={copy.heading} />

      <Section heading={copy.whyHeading}>
        <p className="lead mt-2">{copy.whyBody}</p>
      </Section>

      <Section heading={copy.todayHeading}>
        <p className="lead mt-2">{copy.todayBody}</p>
      </Section>

      <Section heading={copy.claimsHeading} lead={copy.claimsLead}>
        <TermList items={copy.claims.map((c) => ({ body: c }))} />
      </Section>

      <Section heading={copy.contactHeading}>
        <Card className="mt-8 max-w-2xl">
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            {copy.contactBody}
          </p>
          <div className="mt-5 flex flex-wrap gap-6">
            <ArrowLink to="/#interest">{copy.contactRegisterLinkText}</ArrowLink>
            <ArrowLink to="/contact">{copy.contactContactLinkText}</ArrowLink>
          </div>
        </Card>
      </Section>
    </>
  );
}

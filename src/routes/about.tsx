import { createFileRoute } from "@tanstack/react-router";
import { about as copy } from "@/content/copy";
import { ArrowLink, Card, Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

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
      <PageHero
        badge="About"
        title={copy.heading}
        lead={copy.whyBody}
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/platform", label: "Explore Platform" }}
      />

      <Section heading={copy.todayHeading}>
        <p className="lead mt-2">{copy.todayBody}</p>
      </Section>

      <Section heading={copy.claimsHeading} lead={copy.claimsLead}>
        <TermList items={copy.claims.map((c) => ({ body: c }))} />
      </Section>

      <Section heading={copy.contactHeading}>
        <Reveal>
          <Card className="mt-8 max-w-2xl">
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy.contactBody}
            </p>
            <div className="mt-5 flex flex-wrap gap-6">
              <ArrowLink to="/contact">{copy.contactRegisterLinkText}</ArrowLink>
              <ArrowLink to="/contact">{copy.contactContactLinkText}</ArrowLink>
            </div>
          </Card>
        </Reveal>
      </Section>

      <CtaBand
        heading="Talk to the people building it"
        lead="A person reads and answers. We will tell you what exists today and what does not."
        primary={{ to: "/contact", label: "Contact Us" }}
        secondary={{ to: "/what-we-havent-built", label: "What We Haven't Built" }}
      />
    </>
  );
}

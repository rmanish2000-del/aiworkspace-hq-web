import { createFileRoute, Link } from "@tanstack/react-router";
import { contact as copy } from "@/content/copy";
import { ArrowLink, Card, PageHead, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

const EMAIL = "founder@aiworkspacehq.com";

function ContactPage() {
  const lead = copy.lead.split("contact routes");
  return (
    <>
      <PageHead
        eyebrow={copy.heading}
        title={copy.heading}
        lead={
          <>
            {lead[0]}
            <a href={`mailto:${EMAIL}`} className="text-foreground underline underline-offset-4 hover:text-primary">
              contact routes
            </a>
            {lead[1] ?? ""}
          </>
        }
      />

      <Section heading={copy.generalHeading}>
        <Card className="max-w-xl">
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            For anything not covered below, email us. A person reads and answers.
          </p>
          <ArrowLink to={`mailto:${EMAIL}`} className="mt-4">
            {EMAIL}
          </ArrowLink>
        </Card>
      </Section>

      <Section heading={copy.privacyHeading}>
        <Card className="max-w-xl">
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{copy.privacyBody}</p>
          <ArrowLink to="/privacy" className="mt-4">
            {copy.privacyLinkText}
          </ArrowLink>
        </Card>
      </Section>

      <Section heading={copy.securityHeading}>
        <Card className="max-w-xl">
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{copy.securityBody}</p>
          <ArrowLink to={`mailto:${EMAIL}`} className="mt-4">
            {EMAIL}
          </ArrowLink>
        </Card>
      </Section>

      <Section heading={copy.locationHeading}>
        <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          The registered entity name and address are pending legal confirmation and are deliberately
          not published yet. This gap is documented on the{" "}
          <Link to="/what-we-havent-built" className="text-foreground underline underline-offset-4 hover:text-primary">
            what we have not built
          </Link>{" "}
          page.
        </p>
      </Section>
    </>
  );
}

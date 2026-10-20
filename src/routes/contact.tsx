import { createFileRoute, Link } from "@tanstack/react-router";
import { contact as copy } from "@/content/copy";
import { ArrowLink, Card, Section } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";
import { EmailCopy } from "@/components/site/email-link";
import { PlanRequestForm } from "@/components/site/plan-request-form";

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

function ContactPage() {
  const lead = copy.lead.split("contact routes");
  return (
    <>
      <PageHero
        badge={copy.heading}
        title={copy.heading}
        lead={
          <>
            {lead[0]}
            <a href="#plan" className="text-foreground underline underline-offset-4 hover:text-primary">
              contact routes
            </a>
            {lead[1] ?? ""}
          </>
        }
      />

      <Section id="plan" className="scroll-mt-24">
        <h2 className="h2 max-w-2xl">Ask for a scoped plan</h2>
        <p className="lead mt-5">
          Tell us one piece of work your team repeats every week. We will reply with a scoped plan
          for Discovery — what we would look at, what you would receive, and the fee.
        </p>
        <PlanRequestForm />
      </Section>

      <Section>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              heading: copy.generalHeading,
              body: "For anything not covered below, email us. A person reads and answers.",
              email: true,
            },
            {
              heading: copy.privacyHeading,
              body: copy.privacyBody,
              email: false,
            },
            {
              heading: copy.securityHeading,
              body: copy.securityBody,
              email: true,
            },
          ].map((c, i) => (
            <Reveal key={c.heading} delay={i * 60}>
              <Card className="flex h-full flex-col transition-colors duration-200 hover:border-primary/40">
                <h2 className="h3">{c.heading}</h2>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
                {c.email ? (
                  <EmailCopy className="mt-5" />
                ) : (
                  <ArrowLink to="/privacy" className="mt-5">
                    {copy.privacyLinkText}
                  </ArrowLink>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section heading={copy.locationHeading}>
        <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          The registered entity name and address are pending legal confirmation and are deliberately
          not published yet. This gap is documented on the{" "}
          <Link
            to="/what-we-havent-built"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            what we have not built
          </Link>{" "}
          page.
        </p>
      </Section>

      <CtaBand
        heading="Everything we publish, in one place"
        lead="Technology, security, principles and the gap list are open to read before you talk to us."
        primary={{ to: "/resources", label: "Browse Resources" }}
        secondary={{ to: "/platform", label: "Explore Platform" }}
      />
    </>
  );
}

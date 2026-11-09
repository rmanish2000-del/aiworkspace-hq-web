import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { contact as copy } from "@/content/copy";
import { ArrowLink, Card, Section } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";
import { EmailCopy } from "@/components/site/email-link";
import { PlanRequestForm } from "@/components/site/plan-request-form";
import { SocialLinks } from "@/components/site/social-links";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/contact") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        badge={copy.heading}
        title={copy.heading}
        lead={
          <>
            {copy.lead}{" "}
            <a href="#plan" className="text-foreground underline underline-offset-4 hover:text-primary">
              Jump to the plan form
            </a>
            .
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

      <Section heading="On social media">
        <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Follow @aiworkspacehq for process notes and product updates. No third-party embeds — just
          links.
        </p>
        <SocialLinks className="mt-5" showHandle />
      </Section>

      <Section heading="Hire on Upwork">
        <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Prefer a marketplace listing? The public catalog item is{" "}
          <a
            href="https://www.upwork.com/services/product/2109673752356316568"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            AI Eval Audit
          </a>
          .
        </p>
      </Section>

      <Section heading={copy.locationHeading}>
        <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Kartavya CSC Digital Seva, a sole proprietorship of Manish Patel
          <br />
          Tilak Ward, Deori, District Sagar, Madhya Pradesh 470226, India
          <br />
          GSTIN 23AKZPP1502D1ZB · Udyam UDYAM-MP-39-0001250
          <br />
          Email: founder@aiworkspacehq.com
        </p>
      </Section>

      <CtaBand
        heading="See the work before you hire"
        lead="Our Work lists products, projects and credentials. Services explains what you buy."
        primary={{ to: "/our-work", label: "Our Work" }}
        secondary={{ to: "/services", label: "Services" }}
      />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { about as copy } from "@/content/copy";
import { ArrowLink, Card, Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";
import { SocialLinks } from "@/components/site/social-links";
import { credentials } from "@/content/work";
import { PRODUCT_NAMES } from "@/content/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/about") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
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
        primary={{ to: "/contact", label: "Ask for a plan" }}
        secondary={{ to: "/our-work", label: "Our Work" }}
      />

      <Section heading="Who operates this">
        <Reveal>
          <Card className="mt-8 max-w-2xl">
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              AI Workspace HQ is operated by Kartavya CSC Digital Seva, a sole proprietorship of
              Manish Patel, Tilak Ward, Deori, District Sagar, Madhya Pradesh 470226, India. GSTIN
              23AKZPP1502D1ZB · Udyam UDYAM-MP-39-0001250. Email: founder@aiworkspacehq.com.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
              One person builds the software, writes this site, and answers the email. When
              something here is wrong, there is one person who will fix it.
            </p>
          </Card>
        </Reveal>
      </Section>

      <Section heading="Products">
        <p className="lead mt-2 max-w-2xl">
          {PRODUCT_NAMES.join(", ")} — each with status and links on{" "}
          <ArrowLink to="/our-work">Our Work</ArrowLink>.
        </p>
      </Section>

      <Section heading={copy.todayHeading}>
        <p className="lead mt-2">{copy.todayBody}</p>
        <div className="mt-6 flex flex-wrap gap-6">
          <ArrowLink to="/services">Services</ArrowLink>
          <ArrowLink to="/our-work">Our Work</ArrowLink>
          <ArrowLink to="/pricing">Pricing</ArrowLink>
        </div>
      </Section>


      <Section heading="Hackathon credentials">
        <Reveal>
          <Card className="mt-8 max-w-2xl">
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              Warrant was submitted to the Agentic Commerce Hackathon (Prava). Prize sponsors listed
              by that hackathon include Visa and OpenAI. ProofShot was submitted to the Meta Global
              AI Developer Hackathon, Indie Developer track (Meta and Cerebral Valley; inference
              partners include Fireworks, Baseten, and Modal). Sponsors named here are the
              hackathon&apos;s, not ours. No wins or placements are claimed.
            </p>
            <div className="mt-5">
              <ArrowLink to="/our-work">See hackathon entries</ArrowLink>
            </div>
          </Card>
        </Reveal>
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
              <a
                href={credentials.upwork.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                Hire on Upwork — {credentials.upwork.title}
              </a>
            </div>
            <SocialLinks className="mt-6" showHandle />
          </Card>
        </Reveal>
      </Section>

      <CtaBand
        heading="Talk to the person building it"
        lead="A person reads and answers. We will tell you what exists today and what does not."
        primary={{ to: "/contact", label: "Ask for a plan" }}
        secondary={{ to: "/what-we-havent-built", label: "What We Haven't Built" }}
      />
    </>
  );
}

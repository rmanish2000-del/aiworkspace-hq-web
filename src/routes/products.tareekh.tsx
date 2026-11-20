import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { tareekhProduct as copy } from "@/content/tareekh";
import { Card, Section } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/products/tareekh")({
  head: () => ({
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl(copy.canonicalPath) },
      { property: "og:image", content: absoluteUrl("/products/tareekh/og.png") },
      { property: "og:image:alt", content: "Tareekh — never miss your next court date" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: copy.metaTitle },
      { name: "twitter:description", content: copy.metaDescription },
      { name: "twitter:image", content: absoluteUrl("/products/tareekh/og.png") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(copy.canonicalPath) }],
  }),
  component: TareekhPage,
});

function TareekhPage() {
  return (
    <>
      <PageHero
        badge={copy.eyebrow}
        title={copy.heading}
        lead={copy.lead}
        primary={{ to: copy.waUrl, label: copy.waLabel }}
        secondary={{ to: copy.siteUrl, label: copy.siteLabel }}
        aside={
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/products/tareekh/logo.svg"
                alt="Tareekh logo"
                width={48}
                height={48}
                className="size-12 rounded-[0.75rem]"
              />
              <div>
                <p className="font-display text-lg font-semibold tracking-tight">Tareekh</p>
                <p className="text-sm text-muted-foreground">A product of AI Workspace HQ</p>
              </div>
            </div>
            <figure>
              <img
                src="/products/tareekh/hero-desktop.png"
                alt="Tareekh website on a desktop screen: a CNR box and a WhatsApp conversation showing a sample case update."
                width={1440}
                height={900}
                className="w-full rounded-lg border border-border shadow-sm"
              />
              <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {copy.sampleNote}
              </figcaption>
            </figure>
          </div>
        }
      >
        <p className="mt-8 max-w-2xl rounded-md border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {copy.liveScope}
        </p>
      </PageHero>

      <Section eyebrow="The problem" heading={copy.problemHeading}>
        <p className="lead mt-4 max-w-2xl">{copy.problemBody}</p>
      </Section>

      <Section eyebrow="How it works" heading={copy.howHeading} className="bg-paper">
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.how.map((step, i) => (
            <Reveal key={step.label} delay={i * 60}>
              <Card className="h-full">
                <span className="eyebrow">{i + 1}</span>
                <h3 className="h3 mt-3">{step.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Who it is for" heading={copy.audienceHeading}>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {copy.audiences.map((a) => (
            <li
              key={a}
              className="rounded-md border border-border bg-muted px-4 py-4 text-[0.9375rem] leading-relaxed text-muted-foreground"
            >
              {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="What is different" heading={copy.differentHeading} className="bg-paper">
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="h3">Today</h3>
            <ul className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy.today.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card className="border-primary/30">
            <h3 className="h3">With Tareekh</h3>
            <ul className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy.withTareekh.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h3 className="h3">{copy.liveFeaturesHeading}</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {copy.liveFeatures.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="h3">{copy.soonHeading}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              These are not live yet. They are labelled so they are not mixed with today&apos;s
              features.
            </p>
            <ul className="mt-4 space-y-2">
              {copy.soon.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-dashed border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mr-2 rounded-full border border-border px-2 py-0.5 text-[0.6875rem] uppercase tracking-wide">
                    Coming soon
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="mt-10 max-w-sm">
          <img
            src="/products/tareekh/hero-mobile.png"
            alt="Tareekh on a phone: the Hindi homepage with the CNR box and a WhatsApp sample."
            width={375}
            height={667}
            className="w-full rounded-[1.5rem] border border-border shadow-sm"
          />
          <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
            The same product on a phone, in Hindi. The website is in 12 Indian languages.
          </figcaption>
        </figure>
      </Section>

      <Section eyebrow="Pricing" heading={copy.pricingHeading} lead={copy.pricingLead}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {copy.plans.map((plan) => (
            <Card key={plan.name} className="h-full">
              <p className="eyebrow">{plan.name}</p>
              <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{plan.price}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Build" heading={copy.builtHeading} className="bg-paper">
        <p className="lead mt-4 max-w-2xl">{copy.builtBody}</p>
      </Section>

      <Section eyebrow="Limits" heading={copy.limitsHeading}>
        <ul className="mt-8 grid gap-3">
          {copy.limits.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border px-4 py-3 text-[0.9375rem] leading-relaxed text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        heading={copy.ctaHeading}
        lead={`${copy.ctaLead} WhatsApp: ${copy.waNumber}.`}
        primary={{ to: copy.waUrl, label: copy.waLabel }}
        secondary={{ to: copy.siteUrl, label: copy.siteLabel }}
      />
    </>
  );
}

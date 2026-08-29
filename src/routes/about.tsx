import { createFileRoute } from "@tanstack/react-router";
import { about as copy, shared } from "@/content/copy";
import { ArrowLink, Card, PageHead, Section } from "@/components/site/primitives";

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
      <PageHead title={copy.heading} lead={copy.lead} />

      <Section heading={copy.principlesHeading}>
        <p className="lead mt-2">{copy.principlesBody}</p>
        <ArrowLink to={copy.principlesLinkHref} className="mt-6 inline-flex">
          {copy.principlesLinkText}
        </ArrowLink>
      </Section>

      <Section heading={copy.founderHeading}>
        <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <Card>
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
              {copy.founderBody}
            </p>
          </Card>
          <Card>
            <p className="eyebrow">{copy.founderCardLabel}</p>
            <p className="mt-3 text-lg font-semibold tracking-tight">{copy.founderCardName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{copy.founderCardBio}</p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">{copy.founderCardNote}</p>
          </Card>
        </div>
      </Section>

      <Section heading={copy.stackHeading}>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {copy.stackItems.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
            >
              <span aria-hidden className="text-[var(--color-verified)]">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="eyebrow">{copy.companyHeading}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {shared.singleEngineer} {shared.noPricePlan}
            </p>
          </Card>
          <Card>
            <p className="eyebrow">{copy.originHeading}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {copy.originBody}
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}

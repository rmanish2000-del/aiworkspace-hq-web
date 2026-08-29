import { createFileRoute } from "@tanstack/react-router";
import { warrantProduct as copy } from "@/content/copy";
import { LedgerBlock } from "@/components/site/ledger-block";
import { ArrowLink, ButtonLink, Card, Section, TermList } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/products/warrant")({
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
  component: WarrantPage,
});

function WarrantPage() {
  return (
    <>
      <PageHero
        badge={copy.eyebrow}
        title={copy.heading}
        lead={copy.lead}
        primary={{ to: "/pricing", label: "View Pricing" }}
        secondary={{ to: copy.githubHref, label: copy.githubLabel }}
        aside={
          <Card className="border-l-2">
            <span className="eyebrow">Maturity</span>
            <p className="mt-3 text-[0.9375rem] leading-relaxed">{copy.maturity}</p>
          </Card>
        }
      />

      <Section eyebrow="Who it is for" heading={copy.audienceHeading}>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {copy.audiences.map((a) => (
            <li
              key={a}
              className="rounded-md border border-border bg-muted px-4 py-3 text-[0.875rem] text-muted-foreground"
            >
              {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="The problem" heading={copy.problemHeading}>
        <p className="lead mt-4">{copy.problemBody}</p>
      </Section>

      <Section eyebrow="How it works" heading={copy.workflowHeading}>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {copy.workflow.map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <Card className="h-full transition-colors duration-200 hover:border-primary/40">
                <span className="eyebrow">{i + 1}</span>
                <h3 className="h3 mt-3">{s.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="By design" heading={copy.refusalHeading}>
        <Card className="border-l-2 border-l-foreground">
          <p className="text-[0.9375rem] leading-relaxed">{copy.refusalBody}</p>
        </Card>
      </Section>

      <Section eyebrow="Evidence" heading={copy.capabilitiesHeading}>
        <TermList
          items={["CB-88", "CB-89", "CB-90"].map((id) => ({
            body: <LedgerBlock id={id} />,
          }))}
        />
      </Section>

      <Section eyebrow="Try it" heading={copy.tryHeading} lead={copy.tryBody}>
        <ButtonLink to={copy.githubHref} variant="secondary" className="mt-6 min-h-11">
          {copy.githubLabel}
        </ButtonLink>
      </Section>

      <Section eyebrow="Limits" heading={copy.trustHeading}>
        <h3 className="h3 mt-2">{copy.limitationsHeading}</h3>
        <TermList className="mt-4" items={copy.limitations.map((l) => ({ body: l }))} />
      </Section>

      <Section eyebrow="Partnership" heading={copy.partnershipHeading} lead={copy.partnershipBody}>
        <ArrowLink to={copy.partnershipHref} className="mt-6 inline-flex">
          {copy.partnershipLabel}
        </ArrowLink>
      </Section>

      <CtaBand
        heading="Put Warrant Guardian in front of your policy"
        lead="See the refusal path and the evidence record on a task of your choosing."
        primary={{ to: "/pricing", label: "View Pricing" }}
        secondary={{ to: "/contact", label: "Contact Us" }}
      />
    </>
  );
}

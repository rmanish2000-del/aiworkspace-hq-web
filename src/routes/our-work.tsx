import { createFileRoute, Link } from "@tanstack/react-router";
import { credentials, products, projects, workMeta } from "@/content/work";
import { softwareApplicationsJsonLd } from "@/content/social";
import { breadcrumbJsonLd, pageSeo } from "@/lib/seo";
import { Card, Section } from "@/components/site/primitives";
import { CtaBand, PageHero } from "@/components/site/page-shell";
import { Reveal } from "@/components/site/motion";

const workSeo = pageSeo({
  title: workMeta.title,
  description: workMeta.description,
  path: "/our-work",
  jsonLd: [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Our Work", path: "/our-work" },
    ]),
    ...softwareApplicationsJsonLd,
  ],
});

export const Route = createFileRoute("/our-work")({
  head: () => workSeo,
  component: OurWorkPage,
});

function ExternalLink(props: { href: string; children: string }) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
    >
      {props.children}
    </a>
  );
}

function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function OurWorkPage() {
  return (
    <>
      <PageHero
        badge="Our Work"
        title="Products, projects, and credentials you can check"
        lead="GitHub is the source of truth for our engineering. Live products come first, then other substantial projects, then recognition that is public on GitHub and Upwork."
        primary={{ to: "/contact", label: "Ask for a plan" }}
        secondary={{ to: "/process", label: "See the 12 steps" }}
      />

      <Section id="products" heading="Products">
        <p className="lead mt-2 max-w-2xl">
          Live or shippable systems with a clear operator and a public surface you can open.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {products.map((item, i) => (
            <Reveal key={item.id} delay={i * 40}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="h3">{item.name}</h3>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {item.value}
                </p>
                <TagList tags={item.stack} />
                <div className="mt-5 flex flex-wrap gap-4">
                  {item.liveUrl ? <ExternalLink href={item.liveUrl}>Live site</ExternalLink> : null}
                  {item.githubUrl ? (
                    <ExternalLink href={item.githubUrl}>GitHub</ExternalLink>
                  ) : null}
                  {item.detailHref ? (
                    <Link
                      to={item.detailHref}
                      className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      Product page
                    </Link>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="projects" heading="Projects" className="bg-paper">
        <p className="lead mt-2 max-w-2xl">
          Other substantial builds. Private repositories are described at a high level only — no
          private links.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((item, i) => (
            <Reveal key={item.id} delay={i * 40}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="h3">{item.name}</h3>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {item.value}
                </p>
                <TagList tags={item.stack} />
                {item.note ? (
                  <p className="mt-3 text-xs text-muted-foreground">{item.note}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-4">
                  {item.liveUrl ? <ExternalLink href={item.liveUrl}>Live site</ExternalLink> : null}
                  {item.githubUrl ? (
                    <ExternalLink href={item.githubUrl}>GitHub</ExternalLink>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="credentials" heading={credentials.heading}>
        <p className="lead mt-2 max-w-2xl">{credentials.lead}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <p className="eyebrow">GitHub achievements</p>
            <ul className="mt-5 flex flex-wrap gap-4">
              {credentials.achievements.map((a) => (
                <li key={a.id} className="flex w-28 flex-col items-center text-center">
                  <img
                    src={a.image}
                    alt={`GitHub achievement: ${a.name}`}
                    width={64}
                    height={64}
                    className="size-16"
                  />
                  <span className="mt-2 text-xs font-medium text-ink">{a.name}</span>
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {a.tier}
                    {a.count > 1 ? ` · x${a.count}` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              {credentials.publicRepoCount} public repositories on{" "}
              <ExternalLink href={credentials.profileUrl}>github.com/rmanish2000-del</ExternalLink>
              . Snapshot synced {credentials.syncedAt}.
            </p>
          </Card>
          <Card>
            <p className="eyebrow">Upwork catalog</p>
            <h3 className="h3 mt-3">{credentials.upwork.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              A packaged evaluation of an AI feature’s claims against evidence — listed on Upwork.
            </p>
            <div className="mt-5">
              <ExternalLink href={credentials.upwork.url}>View Upwork listing</ExternalLink>
            </div>
          </Card>
        </div>
      </Section>

      <CtaBand
        heading="Want this process on one of your jobs?"
        lead="Ask for a scoped Discovery plan. Every step leaves a receipt you can check."
        primary={{ to: "/contact", label: "Ask for a plan" }}
        secondary={{ to: "/trust", label: "Read Trust" }}
      />
    </>
  );
}

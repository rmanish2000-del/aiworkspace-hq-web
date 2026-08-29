import { createFileRoute } from "@tanstack/react-router";
import { ArrowLink, Card, PageHead, Section } from "@/components/site/primitives";

const title = "Resources — AI Workspace HQ";
const description =
  "Technology notes, security posture, principles, roadmap and the published gap list behind the AI Workspace operating layer.";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

const resources = [
  { href: "/technology", title: "Technology", body: "How the operating layer is built and what runs today." },
  { href: "/security", title: "Security", body: "Security posture, boundaries and current controls." },
  { href: "/principles", title: "Principles", body: "The rules we hold ourselves to when shipping capability." },
  { href: "/building", title: "What we are building", body: "Work in progress, stated plainly with status." },
  { href: "/what-we-havent-built", title: "The gap list", body: "Capability we have not built yet, published on purpose." },
  { href: "/enterprise", title: "Enterprise", body: "How enterprise evaluation and deployment work." },
];

function ResourcesPage() {
  return (
    <>
      <PageHead
        eyebrow="Resources"
        title="Everything we publish, in one place"
        lead="Evidence before claims. Each page below states what exists today and what does not."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.href} className="flex h-full flex-col transition-colors hover:border-primary/40">
              <h2 className="text-base font-semibold tracking-tight">{r.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <ArrowLink to={r.href} className="mt-5">
                Open
              </ArrowLink>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PLAN_HREF } from "@/content/caid";
import { Band, CloseBand, PrimaryAction, ProcessDetail } from "@/components/site/caid-sections";

const title = "The 12 steps — AI Workspace";
const description =
  "How we deploy AI into real work: understand, prove, ship and improve, in twelve steps that each leave a receipt you can check.";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <>
      <section className="bg-paper">
        <div className="container-site pb-14 pt-14 md:pb-20 md:pt-20">
          <h1 className="h1 max-w-3xl text-ink">The 12 steps</h1>
          <p className="lead mt-6">
            What we do at each step, and the receipt you get for it. A step is only marked done when
            its receipt exists and you can open it.
          </p>
          <div className="mt-8">
            <PrimaryAction href={PLAN_HREF} cta="hero">
              Ask for a scoped plan
            </PrimaryAction>
          </div>
        </div>
      </section>
      <Band>
        <ProcessDetail />
      </Band>
      <CloseBand />
    </>
  );
}

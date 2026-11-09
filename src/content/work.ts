import snapshot from "./github-snapshot.json";
import { products as portfolioProducts, projects as portfolioProjects } from "./products";

export const workMeta = {
  title: "Our Work — AI Workspace",
  description:
    "Live products, selected engineering projects, and credentials you can verify — Jachega, ProofShot, Warrant, SensexPilot, and more.",
} as const;

/** Products — single source: src/content/products.json */
export const products = portfolioProducts;

/** Projects — single source: src/content/products.json (TradeOS folded into SensexPilot). */
export const projects = portfolioProjects;

/** Hackathon credentials — sponsors/partners are the hackathon's, not ours. No wins claimed. */
export const hackathons = [
  {
    id: "warrant-agentic-commerce",
    project: "Warrant",
    name: "Agentic Commerce Hackathon",
    organisers: "Prava (via Devfolio)",
    track: "Online build — AI agent commerce with Prava",
    when: "31 Jul – 2 Aug 2026",
    status: "Submitted",
    statusNote: "Hackathon ended. No win or placement claimed.",
    blurb:
      "Built Warrant as an authorization layer for AI purchasing agents. Prize sponsors listed by the hackathon include Visa, OpenAI, Linq, Localhost, Project Nanda, and Senso. Prava is the required payments platform for the event — not our sponsor.",
    links: [
      { label: "Devfolio submission", href: "https://devfolio.co/projects/warrant-an-authorization-layer-for-ai-purchasing-agents-855e" },
      { label: "GitHub (submission tag)", href: "https://github.com/rmanish2000-del/warrant" },
      { label: "Hackathon page", href: "https://agentic-commerce.devfolio.co/" },
    ],
  },
  {
    id: "proofshot-meta",
    project: "ProofShot",
    name: "Meta Global AI Developer Hackathon",
    organisers: "Meta and Cerebral Valley",
    track: "Indie Developer track",
    when: "26 Oct – 4 Nov 2026",
    status: "Submitted",
    statusNote: "Submitted 4 Nov 2026 (Cerebral Valley confirmation). No win or placement claimed.",
    blurb:
      "Built ProofShot in the Indie Developer track. Official inference partners for the event include Fireworks, Baseten, and Modal. Meta models used in the build are disclosed in the public README.",
    links: [
      { label: "GitHub", href: "https://github.com/rmanish2000-del/proofshot-hackathon" },
      { label: "Live demo", href: "https://rmanish2000-proofshot.hf.space/" },
      { label: "Hackathon page", href: "https://dev.meta.ai/events/global-hackathon" },
      { label: "Partners (Cerebral Valley)", href: "https://cerebralvalley.ai/e/meta-ai-developer-hackathon" },
    ],
  },
] as const;

export const credentials = {
  heading: "Credentials & recognition",
  lead: "What is public on GitHub, Upwork, and the hackathons we entered — badges, listings, and submissions you can open. Sponsors named below belong to those hackathons, not to us. No wins claimed.",
  profileUrl: snapshot.profileUrl,
  publicRepoCount: snapshot.publicRepoCount,
  achievements: snapshot.achievements,
  upwork: snapshot.upworkCatalog,
  syncedAt: snapshot.syncedAt,
} as const;

export const githubSnapshot = snapshot;

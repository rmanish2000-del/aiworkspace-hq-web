import snapshot from "./github-snapshot.json";

export const workMeta = {
  title: "Our Work — AI Workspace",
  description:
    "Live products, selected engineering projects from GitHub, and credentials you can verify — Jachega, ProofShot, Warrant, and more.",
} as const;

/** Products shown first. Nothing here is repeated under Projects. */
export const products = [
  {
    id: "jachega",
    name: "Jachega",
    status: "Prototype",
    value:
      "Consumer virtual try-on: one shopper photo plus a brand product, previewed on you, then buy on the brand’s own site.",
    stack: ["TypeScript", "AI vision", "on-device preview"],
    liveUrl: "https://www.jachega.in",
    githubUrl: null as string | null,
    detailHref: null as string | null,
  },
  {
    id: "proofshot",
    name: "ProofShot",
    status: "Hackathon demo",
    value:
      "Gated AI product photography: a code gate decides RELEASE / REVIEW / REFUSE and writes a hash-chained receipt anyone can verify offline.",
    stack: ["TypeScript", "vision gate", "hash-chained receipts"],
    liveUrl: "https://rmanish2000-proofshot.hf.space/",
    githubUrl: "https://github.com/rmanish2000-del/proofshot-hackathon",
    detailHref: null as string | null,
    hackathon:
      "Built for the Meta Global AI Developer Hackathon — Indie Developer track (Meta + Cerebral Valley; inference partners include Fireworks, Baseten, and Modal). Submitted 4 Nov 2026; result not claimed.",
  },
  {
    id: "warrant",
    name: "Warrant",
    status: "Open source",
    value: "Authorization layer for AI purchasing agents — rules before action.",
    stack: ["TypeScript", "authorization"],
    liveUrl: null as string | null,
    githubUrl: "https://github.com/rmanish2000-del/warrant",
    detailHref: "/products/warrant",
    hackathon:
      "Built for the Agentic Commerce Hackathon (Prava). Prize sponsors listed by that hackathon include Visa and OpenAI. Submitted Aug 2026; no placement claimed.",
  },
  {
    id: "warrant-mcp",
    name: "Warrant MCP",
    status: "Open source",
    value: "Write the rules for an AI agent once, in plain English, as a deterministic MCP.",
    stack: ["TypeScript", "MCP", "authorization"],
    liveUrl: null as string | null,
    githubUrl: "https://github.com/rmanish2000-del/warrant-mcp",
    detailHref: "/products/warrant-mcp",
  },
] as const;

/**
 * Other substantial projects. Private repos: high-level only, no private GitHub links.
 * TradeOS is a neutral engineering case study — no profit, returns, or advice claims.
 */
export const projects = [
  {
    id: "eduos",
    name: "EduOS",
    status: "Live",
    value: "Learning tools for tutoring and coaching centres.",
    stack: ["TypeScript", "education ops"],
    liveUrl: "https://eduos.global",
    githubUrl: null as string | null,
    note: "Private codebase; public product site only.",
  },
  {
    id: "nyayos",
    name: "NyayOS",
    status: "Pilot preparation",
    value:
      "Organises business-dispute papers into a reviewable file for a human reviewer. It never predicts outcomes.",
    stack: ["TypeScript", "document workflows"],
    liveUrl: null as string | null,
    githubUrl: null as string | null,
    note: "Private codebase.",
  },
  {
    id: "tradeos",
    name: "TradeOS",
    status: "Internal engineering",
    value:
      "Founder-only research and trading systems engineering: live desks, supervisors, adapters, and replay tooling. Not a product, not a service, and not investment advice.",
    stack: ["Python", "live systems", "adapters"],
    liveUrl: null as string | null,
    githubUrl: null as string | null,
    note: "Private codebase. No performance or returns claims.",
  },
] as const;


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

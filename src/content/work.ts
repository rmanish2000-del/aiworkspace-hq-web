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

export const credentials = {
  heading: "Credentials & recognition",
  lead: "What is public on GitHub and Upwork — badges and counts taken from the profile and catalog, not invented.",
  profileUrl: snapshot.profileUrl,
  publicRepoCount: snapshot.publicRepoCount,
  achievements: snapshot.achievements,
  upwork: snapshot.upworkCatalog,
  syncedAt: snapshot.syncedAt,
} as const;

export const githubSnapshot = snapshot;

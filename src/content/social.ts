/**
 * Public social profiles and a static “Latest posts” shelf.
 * Titles come from startupos docs/marketing/posting-log.md — never invent copy.
 */

export const SOCIAL_HANDLE = "@aiworkspacehq";

export const socialProfiles = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/aiworkspacehq/",
    ariaLabel: "AI Workspace on LinkedIn",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/aiworkspacehq",
    ariaLabel: "AI Workspace on X",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/aiworkspacehq/",
    ariaLabel: "AI Workspace on Instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61595442609488",
    ariaLabel: "AI Workspace on Facebook",
  },
] as const;

export type SocialProfileId = (typeof socialProfiles)[number]["id"];

/** Hardcoded build-time cards — no third-party embeds or scripts. */
export const latestPosts = [
  {
    id: "post-11",
    platform: "LinkedIn",
    title: "An instruction is not a boundary.",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7524057962085052416",
  },
  {
    id: "post-10",
    platform: "Instagram",
    title: "Two gates: does it work, and will it pay?",
    href: "https://www.instagram.com/aiworkspacehq/p/DfUS-Rhh-Kc/",
  },
  {
    id: "post-09",
    platform: "Instagram",
    title: "Measure quality before offering anything.",
    href: "https://www.instagram.com/aiworkspacehq/p/DfRsNLXsDMX/",
  },
] as const;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AI Workspace HQ",
  alternateName: "AI Workspace",
  url: "https://aiworkspacehq.com",
  logo: "https://aiworkspacehq.com/icon-512.png",
  email: "founder@aiworkspacehq.com",
  description:
    "Customer AI deployment you can check, step by step. One repeated job at a time, with a receipt for every step.",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Deori",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
  },
  sameAs: socialProfiles.map((p) => p.href),
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI Workspace HQ",
  url: "https://aiworkspacehq.com",
  description:
    "Customer AI deployment services and products — Warrant, Warrant MCP, Jachega, ProofShot, and more.",
  publisher: { "@type": "Organization", name: "AI Workspace HQ", url: "https://aiworkspacehq.com" },
} as const;

/** Founder — only public sameAs we can verify without inventing profiles. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Manish Patel",
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "AI Workspace HQ", url: "https://aiworkspacehq.com" },
  email: "founder@aiworkspacehq.com",
  url: "https://aiworkspacehq.com/about",
  sameAs: ["https://github.com/rmanish2000-del"],
} as const;

export const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Customer AI Deployment",
  url: "https://aiworkspacehq.com/services",
  description:
    "Discovery, Pilot, Production and Care: put AI on one repeated job through a 12-step process where every step leaves a receipt you can check.",
  provider: { "@type": "Organization", name: "AI Workspace HQ", url: "https://aiworkspacehq.com" },
  areaServed: "Worldwide",
  serviceType: "Customer AI deployment",
} as const;

export const softwareApplicationsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Jachega",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://www.jachega.in",
    description:
      "Consumer virtual try-on: one shopper photo plus a brand product, previewed on you, then buy on the brand's own site.",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ProofShot",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://rmanish2000-proofshot.hf.space/",
    description:
      "Gated AI product photography with a code gate and hash-chained receipt anyone can verify offline.",
  },
] as const;


/** Mentions of hackathon submissions — not Award (no wins claimed). */
export const hackathonSubjectOfJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Warrant",
    url: "https://github.com/rmanish2000-del/warrant",
    description: "Authorization layer for AI purchasing agents.",
    subjectOf: {
      "@type": "Event",
      name: "Agentic Commerce Hackathon",
      url: "https://agentic-commerce.devfolio.co/",
      organizer: { "@type": "Organization", name: "Prava" },
      startDate: "2026-07-31",
      endDate: "2026-08-02",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ProofShot",
    url: "https://github.com/rmanish2000-del/proofshot-hackathon",
    description: "Gated AI product photography with hash-chained receipts.",
    subjectOf: {
      "@type": "Event",
      name: "Meta Global AI Developer Hackathon",
      url: "https://dev.meta.ai/events/global-hackathon",
      organizer: [
        { "@type": "Organization", name: "Meta" },
        { "@type": "Organization", name: "Cerebral Valley" },
      ],
      startDate: "2026-10-26",
      endDate: "2026-11-04",
    },
  },
] as const;

export const ogImage = {
  url: "https://aiworkspacehq.com/og.png",
  alt: "AI Workspace — Customer AI you can check, step by step.",
  width: "1200",
  height: "630",
} as const;

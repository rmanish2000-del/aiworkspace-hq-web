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
  name: "AI Workspace",
  url: "https://aiworkspacehq.com",
  logo: "https://aiworkspacehq.com/icon-512.png",
  email: "founder@aiworkspacehq.com",
  sameAs: socialProfiles.map((p) => p.href),
} as const;

export const ogImage = {
  url: "https://aiworkspacehq.com/og.png",
  alt: "AI Workspace — Customer AI you can check, step by step.",
  width: "1200",
  height: "630",
} as const;

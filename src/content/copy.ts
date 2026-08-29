/**
 * copy.ts — the single source of every visible string.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ TRANSCRIBED VERBATIM FROM P0 `04-final-public-copy.md`.                    │
 * │                                                                           │
 * │ Do not paraphrase, shorten, expand, retitle, or "improve" any string here. │
 * │ Every string has been claim-checked against `02-approved-terminology-and-  │
 * │ claims.md`. Any edit invalidates that check.                              │
 * │                                                                           │
 * │ Claude Code has NO content authority (P1-A §7.1). If a needed string does  │
 * │ not exist in `04`, that is a specification gap to be raised — never a gap  │
 * │ to be filled in code.                                                     │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Two placeholder syntaxes appear, and they mean different things (`04` header):
 *
 *   {{NAME}}  a value a human must supply BEFORE publication. These must never
 *             reach the browser. Every string containing one is listed in
 *             `BUILD_TIME_PLACEHOLDER_KEYS` below and is asserted unrendered.
 *
 *   %name%    a value the running page substitutes at RUNTIME (a live character
 *             count, a field's limit). Expected in the source.
 *
 * Strings for surfaces not built in the current authorized scope are retained
 * here rather than deleted, so that wiring them later requires no new content
 * decision. See `docs/decisions/ADR-0002-scope-deviations.md` for what renders
 * today and why.
 */

/* -------------------------------------------------------------------------- */
/* 1. Document metadata — `04` §1                                             */
/* -------------------------------------------------------------------------- */

export const meta = {
  /** `<title>` — home. 44 characters. */
  titleHome: 'AI Workspace — Enterprise AI Operating Layer',

  /** `<title>` — privacy. */
  titlePrivacy: 'Privacy notice — AI Workspace',

  /** `<meta name="description">` — home. 166 characters. */
  descriptionHome:
    'AI Workspace is an Enterprise AI Operating Layer, designed to connect the enterprise systems you already run, understand your organization, and orchestrate AI agents.',

  /** `<meta name="description">` — privacy. */
  descriptionPrivacy:
    'How AI Workspace handles the information you submit when you register interest.',

  /** Canonical paths. The origin comes from PUBLIC_SITE_URL, never a literal. */
  canonicalPathHome: '/',
  canonicalPathPrivacy: '/privacy',

  lang: 'en',

  /** `04` §1 — index on `/` and `/privacy`; noindex on `/404`. */
  robotsIndexable: 'index, follow',
  robotsNotIndexable: 'noindex, follow',
} as const;

/* -------------------------------------------------------------------------- */
/* 2. Header — `04` §2                                                        */
/* -------------------------------------------------------------------------- */

export const header = {
  /** Plain text (`07` §3). Not a link at P0 — there is nowhere else to go. */
  wordmark: 'AI Workspace',
} as const;

/* -------------------------------------------------------------------------- */
/* 2b. Shared strings — one entry, many references (P2-C §5)                  */
/* -------------------------------------------------------------------------- */

/**
 * Strings that appear on more than one route.
 *
 * P2-C §5 is explicit: these have **one canonical key** and are referenced,
 * never duplicated. A copied string is a string that can drift — and two
 * versions of a binding commitment is the failure this whole copy module
 * exists to prevent.
 *
 * The entries below are the definitions. `hero`, `principlesPage` and `about`
 * point at them rather than restating them, so a change here changes every
 * route at once and a change on one route is impossible.
 */
export const shared = {
  /**
   * [AD] P0 `04` §3, verbatim. The core proposition.
   * Referenced by: `/` hero supporting text, `/about` lead.
   */
  coreProposition:
    'AI Workspace is designed to connect the enterprise systems you already run, understand how your organization actually works, and give AI agents a governed place to operate — without asking you to migrate the systems you already depend on.',

  /**
   * [V] P0 `04` §3, verbatim. **Binding commitment C-11.**
   * Referenced by: `/`, `/platform`, `/principles`, `/about`.
   */
  stageDisclosure: 'AI Workspace is in development. Founder Edition is available for purchase.',

  /**
   * [V] P1-J §7.1. Referenced by: `/principles`, `/about`.
   *
   * The wording deliberately avoids `pricing` and `roadmap`, which the
   * whole-word prohibited-term test matches even inside a denial. **Do not
   * "improve" it back** (P2-C §5, §12.2).
   */
  noPricePlan:
    'A sealed Founder Edition price is published. No further availability date and no forward plan is published.',
} as const;

/* -------------------------------------------------------------------------- */
/* /building — THREE-PROJECTS-ON-SITE (founder instruction, 2026-08-19)        */
/*                                                                            */
/* Every fact below is transcribed from GROK's THREE-PROJECTS-BOOTSTRAP report */
/* (Drive id 1Gpx9_n4NjlQbTN8SXL5KYJNCBUhB7wTt) and the per-project definition */
/* files it cites. Nothing is invented: no feature, no buyer, no date, and no  */
/* claim that any of the three is available, usable, in trial, or has anyone   */
/* on it. The programme names are published under the founder act recorded in  */
/* docs/governance/PROGRAMME-DISCLOSURE.json (P-16 disclosure).                */
/* -------------------------------------------------------------------------- */

export const building = {
  metaTitle: 'What we are building — AI Workspace',
  metaDescription:
    'Three efforts at day zero, each with its problem, its intended operator, its honest state and the date we would stop.',
  eyebrow: 'What we are building',
  heading: 'Three efforts at day zero, with the date we would stop each one.',
  lead: 'None of these is a product yet. Each has a written problem, an intended operator, and a kill date — the day we archive it if the one thing it must prove has not happened. Publishing the kill date is the point: it is what stops an idea outliving its evidence.',
  stateLabel: 'State today',
  forLabel: 'Intended for',
  killLabel: 'We stop it on',
  projects: [
    {
      name: 'LegalEngineering',
      what: 'A durable index and chronology for document-heavy case work, so exhibits and timelines are found rather than rebuilt.',
      intendedFor:
        'Ourselves first, on one real matter. Chambers only after internal use has proved it.',
      state:
        'Day zero. A written definition and a first task list exist. No software has been built.',
      kill: '19 October 2026',
      killWhy: 'if the index and chronology are not in weekly use on that matter by then.',
    },
    {
      name: 'UrjaOps',
      what: 'A register that shows which solar site is blocked on which filing or document, without ten folders and a message thread.',
      intendedFor:
        'Operations leads at EPCs and aggregators, who track this today in spreadsheets, shared drives and field calls.',
      state:
        'Day zero. A written definition and a first task list exist. No software has been built.',
      kill: '19 November 2026',
      killWhy:
        'if no operator has put a real site list into the register and confirmed it does the job of their weekly spreadsheet.',
    },
    {
      name: 'EduOS',
      what: 'A way for cohort operators to prove completion with evidence, instead of reconstructing it from spreadsheets afterwards.',
      intendedFor:
        'Training leads and small education teams, who chase this today through spreadsheets and messages.',
      state:
        'Day zero, and deliberately parked: no build work begins until a named design partner exists. Attention is finite and two other efforts rank ahead of it.',
      kill: '19 November 2026',
      killWhy: 'if no design partner has committed by then.',
    },
  ],
  closing: 'If one of these describes a problem you have, the contact page reaches a person.',
  closingAction: 'Contact',
  closingHref: '/contact',
} as const;

/* -------------------------------------------------------------------------- */
/* 3. Hero — `04` §3                                                          */
/* -------------------------------------------------------------------------- */

export const hero = {
  /** Eyebrow. A `<p>`, not a heading — it carries no document-outline meaning. */
  eyebrow: 'Enterprise AI Operating Layer',

  /** The single `h1` on the page. */
  headline: 'The layer between your enterprise systems and your AI agents',

  /** The core proposition. One definition, in `shared` — see P2-C §5. */
  supporting: shared.coreProposition,

  /** Binding commitment C-11. One definition, in `shared`. */
  stageDisclosure: shared.stageDisclosure,

  /** Not rendered in the current scope — the form section it targets is not built. */
  ctaLabel: 'Register interest',

  /** Not rendered in the current scope. */
  ctaAccessibleName: 'Register interest in AI Workspace early access',
} as const;

/* -------------------------------------------------------------------------- */
/* 4. Principles — `04` §4                                                    */
/* -------------------------------------------------------------------------- */

export const principles = {
  heading: 'How we are building it',

  lead: 'Five principles govern how AI Workspace is designed. They also govern what this page is willing to claim.',

  /** Order is fixed and matches the approved foundation (`03` §3, Block 3). */
  items: [
    {
      title: 'Connect before migrate',
      gloss:
        'Our starting point is the systems you already run. Adopting AI Workspace is not meant to begin with a migration project.',
    },
    {
      title: 'Understand before automate',
      gloss:
        'Automation built on a shallow understanding of an organization produces confident output that is wrong in ways only insiders notice. Understanding comes first.',
    },
    {
      title: 'Extend before replace',
      gloss:
        'The tools your teams already know are an asset, not an obstacle. The aim is to extend what they can do, not to compete with them.',
    },
    {
      title: 'Reuse before rebuild',
      gloss:
        'A connection, a definition, or a policy should be established once and reused across the organization, rather than rebuilt by every team that needs it.',
    },
    {
      title: 'Evidence before claims',
      gloss:
        'We would rather show you something working than describe something planned. That is why this page makes no claims about performance, adoption, or availability.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 5. Early interest — `04` §5                                                */
/*                                                                            */
/* NOT RENDERED IN THE CURRENT SCOPE. The authorized assignment excludes forms */
/* outright, and AWHQ-AUT-P1F MF-1/MF-2 exclude any submission path. Retained  */
/* verbatim so that building it later is a wiring task, not a copy decision.   */
/* -------------------------------------------------------------------------- */

export const interest = {
  heading: 'Register interest',

  lead: 'If you want to hear from us when early access opens, leave your work email. Everything else is optional and only helps us understand who we are building for.',

  formAccessibleName: 'Register interest in AI Workspace',

  /** `04` §5.1. No placeholders are used anywhere — placeholder text is not a label. */
  fields: {
    email: {
      label: 'Work email',
      hint: 'Required. We use this only to contact you about early access.',
    },
    fullName: { label: 'Full name', hint: 'Optional' },
    organization: { label: 'Organization', hint: 'Optional' },
    role: { label: 'Role', hint: 'Optional' },
    context: {
      label: 'What are you trying to solve?',
      hint: 'Optional. A sentence or two is plenty.',
    },
  },

  /** Runtime placeholder `%n%`. Live counter; announced within 100 of the limit. */
  characterCounter: '%n% of 1000 characters',

  /** `04` §5.2. Required, unchecked by default, never bundled. */
  consentLabel:
    'I agree that AI Workspace may store the details I submit and email me about AI Workspace early access. I can ask to be removed at any time.',

  /** `04` §5.3. */
  submitLabel: 'Register interest',
  submitBusyLabel: 'Sending…',

  /**
   * `04` §5.4. The second and fourth sentences are binding commitments C-12 and
   * C-13 (`02` §2). Changing either requires the operational or technical change
   * behind it to be made first.
   */
  privacyMicroNotice:
    'We store your email address and any optional details you provide. We will only contact you about AI Workspace early access. We do not sell or share this information, and we do not use tracking cookies on this site. Read the privacy notice.',

  /** The link text inside the micro-notice, linking to `/privacy`. */
  privacyMicroNoticeLinkText: 'Read the privacy notice',

  /** `04` §5.5. */
  successHeading: 'Thank you — your interest is registered',

  /** Contains a build-time placeholder. Blocked on Open Item C. */
  successBody:
    'We will email you when early access opens. We will not use your address for anything else, and you can ask us to remove your details at any time by emailing {{PRIVACY_EMAIL}}.',

  /** `04` §5.6 — field-level validation. */
  fieldErrors: {
    emailEmpty: 'Enter your work email address.',
    emailMalformed: 'Enter an email address in the format name@example.com.',
    emailTooLong: 'That email address is longer than we can accept.',
    consentMissing: 'Please confirm you agree before submitting.',
    contextTooLong: 'Please shorten this to 1000 characters or fewer.',
    /** Runtime placeholder `%limit%`. */
    fieldTooLong: 'Please shorten this to %limit% characters or fewer.',
  },

  /** `04` §5.6 — form-level errors. */
  formErrors: {
    network: 'We could not reach the server. Check your connection and try again.',
    /** Contains a build-time placeholder. Blocked on Open Item C. */
    serverError:
      'Something went wrong on our side. Please try again in a moment, or email us at {{PRIVACY_EMAIL}}.',
    rateLimited: 'You have submitted this a few times already. Please wait a minute and try again.',
    botCheckFailed: 'We could not verify that submission. Please try again.',
    /**
     * Byte-for-byte identical to `successHeading`, with no trailing period, and
     * rendered through the same success path (`05` §6). Asserted by test.
     */
    duplicate: 'Thank you — your interest is registered',
  },

  errorSummaryHeading: 'There is a problem with this form',
} as const;

/* -------------------------------------------------------------------------- */
/* 6. Footer — `04` §6                                                        */
/*                                                                            */
/* Every line below carries a build-time placeholder blocked on an open item:  */
/*   {{LEGAL_ENTITY_NAME}}, {{JURISDICTION}}  — Open Item B                    */
/*   {{PRIVACY_EMAIL}}                        — Open Item C                    */
/* AWHQ-AUT-P1F P-12 prohibits filling the legal-entity line. The `Privacy`    */
/* link is withheld with the `/privacy` route per P1-F §9.2, so no dead link   */
/* exists. The footer therefore renders as a landmark with no copy today.      */
/* -------------------------------------------------------------------------- */

export const footer = {
  entityLine: '{{LEGAL_ENTITY_NAME}}, {{JURISDICTION}}',
  privacyLinkText: 'Privacy',
  contactEmail: '{{PRIVACY_EMAIL}}',
  copyright: '© 2026 {{LEGAL_ENTITY_NAME}}. All rights reserved.',
} as const;

/* -------------------------------------------------------------------------- */
/* 7. Secondary call to action — `04` §7. Drafted, not deployed.              */
/* Omitted at P0 per `03` §3. Neither may be added until the destination       */
/* exists and its content has passed the `02` §4 review.                       */
/* -------------------------------------------------------------------------- */

export const secondaryCta = {
  whenThereIsSomethingToRead: 'Read how it works',
  whenThereIsSomethingToSee: 'See a demonstration',
} as const;

/* -------------------------------------------------------------------------- */
/* 8. Open Graph and social cards — `04` §8                                   */
/*                                                                            */
/* `og:image` and `og:image:alt` are deliberately absent. The OG image is a    */
/* brand asset, and AWHQ-AUT-P1F P-15 prohibits any logo, wordmark, or brand   */
/* asset while 0 of 8 IP assets have evidenced ownership.                      */
/* -------------------------------------------------------------------------- */

export const openGraph = {
  type: 'website',
  siteName: 'AI Workspace',
  locale: 'en_US',
  title: 'AI Workspace — Enterprise AI Operating Layer',
  description:
    'An Enterprise AI Operating Layer, designed to connect the systems you already run, understand how your organization works, and give AI agents a governed place to operate.',
  /** Retained for when P-15 lifts. Not emitted today. */
  imageAlt: 'AI Workspace — Enterprise AI Operating Layer',
  twitterCard: 'summary_large_image',
} as const;

/* -------------------------------------------------------------------------- */
/* 9. 404 page — `04` §11                                                     */
/* -------------------------------------------------------------------------- */

export const notFound = {
  heading: 'Page not found',

  /**
   * ⚠️ CORRECTED BY P1-J §10.
   *
   * P0 `04` §11 reads "There is only one page here at the moment." That becomes
   * factually FALSE the moment a second content route ships, so P1-J supplies
   * this replacement. The old string must appear nowhere in the build, and a
   * test asserts that.
   */
  body: 'That page does not exist, or it has moved.',

  /** The superseded `04` §11 string, kept only so the test can assert absence. */
  supersededBody: 'There is only one page here at the moment.',

  linkText: 'Go to the AI Workspace home page',

  /** P1-J §10 — two further recovery links. */
  links: [
    { href: '/platform', label: 'Platform' },
    { href: '/principles', label: 'Principles' },
  ],
} as const;

/* ========================================================================== */
/* PHASE 1 — transcribed from `AWHQ-WEB-P1J` v1.0                             */
/*                                                                            */
/* P1-J §11: "A string that appears on two routes is one entry. Duplicating   */
/* it is how a claim silently diverges between pages." So the shared strings  */
/* below are REFERENCES to the P0 entries already defined above, never copies:*/
/*                                                                            */
/*   stage disclosure   -> hero.stageDisclosure    (`04` §3, C-11)            */
/*   five principles    -> principles.items        (`04` §4)                  */
/*   "Register interest"-> interest.heading         (`04` §5)                 */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/* Navigation — P1-J §4.1. Replaces DEC-008.                                  */
/* -------------------------------------------------------------------------- */

export const nav = {
  /** Accessible name for the landmark. Two navs would need distinct names. */
  label: 'Main',
  items: [
    { href: '/trust', label: 'Trust' },
    { href: '/technology', label: 'Technology' },
    { href: '/products', label: 'Products' },
    { href: '/what-we-havent-built', label: 'What we have not built' },
    { href: '/platform', label: 'Platform' },
    { href: '/principles', label: 'Principles' },
    { href: '/contact', label: 'Contact' },
  ],
  /**
   * The fourth item, styled as the primary button and pointing at the form on
   * the home route. Its label is `interest.heading` — one entry, referenced.
   */
  registerInterestHref: '/#interest',

  /**
   * P2-C §5 `nav.about`. **Footer only** — not primary nav (P2-C §8.1).
   *
   * §8.2: primary nav is a promise of substance, and `/about`'s distinguishing
   * section is withheld. The promotion trigger is recorded so the decision does
   * not need remaking: promote when the withheld section publishes.
   */
  about: 'About',

  /**
   * CC-008 — footer labels for the two secondary evidence routes. Footer
   * only, like `about`, until AG-4 ratifies their nav position.
   */
  enterprise: 'For enterprise',
  security: 'Security',

  /**
   * FD-W1 (founder directive, 2026-08-04): a footer link to the Warrant
   * console at /warrant/console — the route PR #19 proxies to the console's
   * own deployment. Navigational label; no factual assertion.
   */
  warrant: 'Warrant console',
} as const;

/* -------------------------------------------------------------------------- */
/* /platform — P1-J §6                                                        */
/*                                                                            */
/* Every line traced to P0 `01` or the Approved Foundation. Nothing here       */
/* describes architecture, a feature, an integration, a deployment model, a    */
/* performance figure, or a date. No competitor is named.                      */
/* -------------------------------------------------------------------------- */

export const platform = {
  /** [D] Approved Foundation, Public Category. Same string as `hero.eyebrow`. */
  eyebrow: 'Enterprise AI Operating Layer',

  /** [D] definitional; verbless, so it asserts no tense. */
  heading: 'What an Enterprise AI Operating Layer is',

  /** [D] P0 `01` §1. */
  lead: "Every adjacent category names a part of the problem — search, retrieval, automation, assistance, agent runtimes. None of them names the layer that has to exist between an organization's systems and its AI agents. That layer is what AI Workspace is being built to be.",

  /** [D] P0 `01` §2. */
  problemHeading: 'The problem',
  problems: [
    {
      leadIn: 'Organizations already run on dozens of systems',
      body: 'Work, decisions, and knowledge are spread across tools that were chosen over many years for good reasons.',
    },
    {
      leadIn: 'AI tools arrive assuming a clean slate',
      body: 'Most require data to be moved, duplicated, or re-platformed before they become useful.',
    },
    {
      leadIn: 'Migration is the cost nobody budgeted for',
      body: 'Consolidating systems is usually a larger undertaking than the AI capability being bought is worth.',
    },
    {
      leadIn: 'Without organizational context, AI output is generic',
      body: "A model that does not know an organization's structure, terminology, ownership, and history produces plausible answers that are wrong in ways only insiders detect.",
    },
    {
      leadIn: 'Without a governed layer, agents cannot be trusted with real work',
      body: 'Ungoverned agents are a security, audit, and accountability problem before they are a productivity gain.',
    },
  ],

  /** Approved Foundation, Core Proposition. */
  pillarsHeading: 'Three things it is designed to do',

  /** [AD] — states plainly that these are intentions, not capabilities. */
  pillarsLead:
    'These are design intentions, not delivered capabilities. AI Workspace is in development.',

  /** Structural label for the evidence-backed capability ledger. */
  verifiedCapabilityHeading: 'Verified product capability',

  /** [AD] all three worded "is designed to". P0 `01` §4. */
  pillars: [
    {
      title: 'Connect',
      body: 'AI Workspace is designed to work with the enterprise systems an organization already runs, rather than replacing them.',
    },
    {
      title: 'Understand',
      body: 'AI Workspace is designed to build an understanding of how an organization works — its structure, terminology, and relationships — so that AI output is grounded in that organization rather than in generic assumptions.',
    },
    {
      title: 'Orchestrate',
      body: 'AI Workspace is designed to be the layer where AI agents are coordinated, bounded, and made accountable.',
    },
  ],

  /** [D] P0 `01` §5. */
  distinctionsHeading: 'What it is not',
  distinctionsLead:
    'These distinctions are definitional. They describe what each category is for, and none of them says that any of these tools does not work.',

  /** [D] verbatim from the approved P0 `01` §5 table. No competitor is named. */
  distinctions: [
    {
      category: 'AI assistants',
      body: 'An assistant helps a person with a task. An operating layer gives an organization a governed place for AI to work across systems.',
    },
    {
      category: 'AI IDEs and coding tools',
      body: "Those serve a development workflow. An operating layer is concerned with an organization's systems and knowledge, not a single craft.",
    },
    {
      category: 'Workflow automation',
      body: 'Automation executes predefined steps. An operating layer supplies the context and governance that agents need in order to act where steps were not predefined.',
    },
    {
      category: 'Enterprise search',
      body: 'Search returns documents to a person. An operating layer builds a usable model of organizational knowledge that agents can act on.',
    },
    {
      category: 'Chatbots',
      body: 'A chatbot is an interface. An operating layer is infrastructure.',
    },
    {
      category: 'RAG platforms',
      body: 'Retrieval is a technique used inside a system. It is not the system, and it does not by itself address orchestration, governance, or accountability.',
    },
    {
      category: 'Agent frameworks',
      body: 'A framework helps a developer build an agent. An operating layer is what an organization needs before it can safely run many agents built by many teams.',
    },
  ],

  /** P1-J §6.2. 158 characters. */
  metaTitle: 'Platform — AI Workspace',
  metaDescription:
    'What an Enterprise AI Operating Layer is, the problem it addresses, and how it differs from assistants, automation, enterprise search, and agent frameworks.',
  canonicalPath: '/platform',
} as const;

/* -------------------------------------------------------------------------- */
/* Product portfolio — AIWHQ-CODEX-BTFDR-005                                 */
/*                                                                            */
/* Repository evidence is recorded in the assignment evidence specification.  */
/* Capability assertions render through the claim ledger; this module owns     */
/* navigation, explanatory and conversion copy.                               */
/* -------------------------------------------------------------------------- */

export const products = {
  eyebrow: 'Product family',
  heading: 'Policy-backed infrastructure for governed AI action',
  lead: 'AI Workspace, Warrant and Warrant MCP address different layers of governed AI operation. These pages separate what each product does, what has been verified, and where its boundary sits.',
  relationHeading: 'One thesis, two authorization products',
  relationLead:
    'Human policy becomes machine-enforceable structure, and deterministic code makes the runtime authorization decision.',
  familyHeading: 'Choose the authorization boundary',
  warrantTitle: 'Warrant',
  warrantSummary: 'Commerce-specific authorization for AI purchasing agents.',
  warrantHref: '/products/warrant',
  warrantMcpTitle: 'Warrant MCP',
  warrantMcpSummary: 'Deterministic policy enforcement for AI-agent actions and tool calls.',
  warrantMcpHref: '/products/warrant-mcp',
  metaTitle: 'Products — AI Workspace',
  metaDescription:
    'Explore Warrant for AI purchasing authorization and Warrant MCP for deterministic AI-agent tool policy, with verified capabilities and stated limitations.',
  canonicalPath: '/products',
} as const;

/* -------------------------------------------------------------------------- */
/* Founder-review experience — AIWHQ-CODEX-UX-001                            */
/*                                                                            */
/* Presentation copy below restates accepted repository evidence. Capability  */
/* proof continues to render through the claim ledger; these strings organise */
/* discovery, audience paths and interaction without widening any claim.      */
/* -------------------------------------------------------------------------- */

export const experience = {
  nav: {
    menu: 'Menu',
    closeHint: 'Choose a destination',
    /** Mobile-menu eyebrow — was hardcoded in SiteNav; single-source repair. */
    menuEyebrow: 'Explore AI Workspace',
    primaryAction: 'View verified evidence',
    primaryHref: '/platform#verified-capability-heading',
  },
  home: {
    metaTitle: 'AI Workspace — The operating layer for accountable AI',
    metaDescription:
      'Connect approved knowledge, governed work, verification and human review in one evidence-backed operating layer for accountable enterprise AI.',
    eyebrow: 'Enterprise AI operating layer · Founder Edition',
    heading: 'The enterprise operating layer for accountable AI.',
    lead: 'Connect approved knowledge to governed execution, verification, evidence and authorized human review—without losing provenance or accountability.',
    /**
     * HOME-CTA-AND-BETA-PATH (Chat ruling, founder input, 2026-08-18): ONE
     * primary action site-wide — "View verified evidence", matching
     * nav.primaryAction — the evidence-first positioning is the moat. The
     * platform path moves to the secondary slot; the capability-section link
     * (which renders secondaryAction against /platform) becomes coherent with
     * it. Strings sealed by that assignment file, quoted verbatim.
     */
    primaryAction: 'View verified evidence',
    primaryHref: '/trust',
    /**
     * H1-P3-CTA-C2 (founder decision, 2026-08-19, Drive id
     * 1ojSAjcvvSACoPMuMFydBDKyFDQ1i9jlF proposal C2): the hero secondary
     * points at the honesty page — the site's differentiator.
     */
    secondaryAction: 'Read the gap list',
    secondaryHref: '/what-we-havent-built',
    /** Beta path (same ruling): small, secondary, must not imply purchasability. */
    pricingAction: 'See pricing',
    pricingHref: '/pricing',
    stage: 'A working Founder Edition exists locally. Founder Edition is available for purchase.',
    visualLabel: 'Verified operating flow',
    visualTitle: 'Context enters with provenance. Work leaves with evidence.',
    sourceLabel: 'Approved source',
    sourceValue: 'Governed knowledge',
    contextLabel: 'Scoped context',
    contextValue: 'Exact provenance',
    assignmentLabel: 'Assignment',
    assignmentValue: 'Validated · Routed',
    resultLabel: 'Result',
    resultValue: 'Verified · Reviewed',
    auditLabel: 'Accountability trail retained',
    audienceHeading: 'Start with the evidence you need.',
    audiences: [
      {
        label: 'Enterprise leader',
        question: 'What changes for the organization?',
        href: '/enterprise',
      },
      {
        label: 'Technical leader',
        question: 'How is the operating boundary structured?',
        href: '/platform',
      },
      {
        label: 'Developer',
        question: 'What can I inspect and run?',
        href: '/technology',
      },
      {
        label: 'Design partner',
        question: 'What is real enough to evaluate today?',
        href: '/products',
      },
    ],
    problemEyebrow: 'The enterprise gap',
    problemHeading: 'Enterprise AI needs more than capable models.',
    problemLead:
      'Knowledge, ownership and decisions are spread across systems. A prompt alone cannot give an agent organizational context, authority or accountability.',
    problemPoints: [
      'Context loses its source when it is copied between tools.',
      'Automation outruns policy when the decision boundary is implicit.',
      'Results become difficult to review when evidence arrives separately.',
    ],
    capabilityEyebrow: 'The operating layer',
    capabilityHeading: 'Govern the path from context to decision.',
    capabilities: [
      {
        index: '01',
        title: 'Ground work in approved knowledge',
        body: 'Ingest from an approved source, retrieve within Organization, Workspace or Project scope, and return exact provenance.',
        status: 'Verified',
      },
      {
        index: '02',
        title: 'Move assignments through explicit state',
        body: 'Validate readiness, identify an eligible executor, route work, activate a bounded attempt and expose the resulting state.',
        status: 'Verified',
      },
      {
        index: '03',
        title: 'Review results before completion',
        body: 'Attach evidence, run deterministic verification, record criterion findings and require an authorized human decision.',
        status: 'Verified',
      },
    ],
    methodEyebrow: 'How it works',
    methodHeading: 'A documented path from source to decision.',
    methodSteps: [
      {
        index: '01',
        title: 'Connect',
        body: 'Register an approved source within a defined scope.',
      },
      {
        index: '02',
        title: 'Retrieve',
        body: 'Return only relevant context with exact provenance.',
      },
      {
        index: '03',
        title: 'Execute',
        body: 'Route work through an accountable assignment and attempt.',
      },
      { index: '04', title: 'Verify', body: 'Review evidence and record the authorized decision.' },
    ],
    portfolioEyebrow: 'Product portfolio',
    portfolioHeading: 'One operating thesis. Clear product boundaries.',
    portfolioLead:
      'The portfolio separates the enterprise operating layer from domain-specific authorization products. Maturity is stated on every surface.',
    platformCard: {
      label: 'Core platform',
      title: 'AI Workspace',
      body: 'Organizational knowledge, governed assignments, execution, verification and review.',
      status: 'Verified foundation',
      href: '/platform',
      action: 'Explore the platform',
    },
    warrantCard: {
      label: 'Commerce authorization',
      title: 'Warrant',
      body: 'Clause-cited ALLOW, ESCALATE or DENY decisions for AI purchasing proposals.',
      status: 'Local sandbox demonstration',
      href: '/products/warrant',
      action: 'Explore Warrant',
    },
    warrantMcpCard: {
      label: 'Agent tool policy',
      title: 'Warrant MCP',
      body: 'Deterministic checks for supported tool calls, with binding enforcement in Claude Code.',
      status: 'Reference implementation',
      href: '/products/warrant-mcp',
      action: 'Explore Warrant MCP',
    },
    futureCard: {
      label: 'Domain products',
      title: 'Evidence gate first',
      body: 'Future domain surfaces appear only after their repository capability and maturity boundary are accepted.',
      status: 'Not presented as available',
      /** THREE-PROJECTS-ON-SITE (2026-08-19): the abstract placeholder now
       *  leads somewhere real — three named, dated, day-zero efforts. */
      action: 'See what we are building next',
      href: '/building',
    },
    evidenceEyebrow: 'Evidence before claims',
    evidenceHeading: 'See what is verified—and what is not.',
    evidenceLead:
      'Verified statements point to repository evidence. Design intent, demonstrations and limitations are labelled separately so a buyer can distinguish proof from direction.',
    evidenceItems: [
      {
        label: 'Verified',
        // POST-MERGE-VERIFY-AND-BADGE (2026-08-13): the evidence is NAMED, not
        // gestured at. Verified from the public warrant-mcp repository at
        // eea5496de1cc: README ("npm test  # 227 tests, including the SPEC.md
        // conformance corpus") and SECURITY-SURFACE.md (the bypass table:
        // eleven routes tested, seven bypasses found, five closed, one still
        // open, one mitigated — published, not hidden).
        body: 'Implemented and checked against named public evidence: the warrant-mcp repository’s 227 passing tests and its published bypass disclosure (SECURITY-SURFACE.md).',
      },
      { label: 'Demonstration', body: 'Reviewable behaviour with a stated operating boundary.' },
      { label: 'In development', body: 'A direction that is not presented as delivered.' },
    ],
    developerEyebrow: 'Technical proof',
    developerHeading: 'Inspect the contract. Trace the result.',
    developerLead:
      'The governed context contract returns scoped source material with provenance. Product repositories expose their own test and policy evidence.',
    contractLabel: 'Governed context contract',
    contractCode: 'aiw.governed_context/v1',
    contractLines: [
      'scope: Organization / Workspace / Project',
      'source: approved · read-only',
      'result: ranked context + exact provenance',
    ],
    developerAction: 'Read the technology choices',
    developerHref: '/technology',
    closeEyebrow: 'Evaluate what exists',
    closeHeading: 'Evaluate the evidence, not the promise.',
    closeLead:
      'Review the platform evidence, inspect the authorization products, and decide whether the current boundary matches a problem worth testing together.',
    closePrimary: 'Review verified capability',
    closePrimaryHref: '/platform#verified-capability-heading',
    closeSecondary: 'Explore the product family',
    closeSecondaryHref: '/products',
  },
  common: {
    maturityLabel: 'Maturity',
    proofLabel: 'Evidence',
    boundaryLabel: 'Current boundary',
    learnMore: 'Learn more',
  },
  platform: {
    summary: 'Approved context enters. Governed work advances. Evidence stays attached.',
    flowHeading: 'The operating path',
    flowSteps: [
      { label: 'Knowledge', body: 'Approved source · exact provenance' },
      { label: 'Assignment', body: 'Validate · route · activate' },
      { label: 'Result', body: 'Evidence · verify · review' },
      { label: 'Decision', body: 'Approve · remediate · complete' },
    ],
    proofHeading: 'Capability ledger',
    proofLead: 'Each statement below is bounded to what the canonical repository demonstrates.',
  },
  products: {
    heading: 'Authorization products for agents that act.',
    lead: 'Warrant governs purchasing proposals. Warrant MCP governs supported tool calls. They share a policy-first thesis, not a shared runtime.',
    compareHeading: 'Choose the decision boundary',
    commerceLabel: 'Purchase intent',
    toolLabel: 'Tool call',
    runtimeLabel: 'Deterministic evaluator',
    outcomeLabel: 'Clause-cited decision',
    policyPreview: ['action: delete .env', 'decision: DENY', 'boundary: protected path'],
  },
  footer: {
    statement: 'Enterprise AI operations grounded in context, policy and evidence.',
    explore: 'Explore',
    verify: 'Verify',
    engage: 'Engage',
    status: 'AI Workspace is in development. Founder Edition is available for purchase.',
  },
} as const;

export const warrantProduct = {
  eyebrow: 'AI purchasing authorization',
  heading: 'Decide whether an AI purchasing agent is allowed to spend',
  lead: 'Warrant turns a human-confirmed spending policy into deterministic purchase authorization. The runtime returns ALLOW, ESCALATE or DENY and cites the clause that governed the decision.',
  maturity:
    'Current maturity: a local, single-operator demonstration with Prava sandbox payment sessions. No real-money processing is claimed.',
  audienceHeading: 'Built for teams placing agents near a purchase',
  audiences: [
    'Agent-commerce builders',
    'Payment and commerce infrastructure teams',
    'Procurement automation teams',
    'Enterprise AI teams evaluating policy-led purchasing',
  ],
  problemHeading: 'Model judgement is not spending authority',
  problemBody:
    'An agent can propose a purchase. The authority to approve, escalate or refuse it must come from a policy a person has confirmed, evaluated by code whose result does not depend on model judgement at runtime.',
  workflowHeading: 'From policy to a clause-cited decision',
  workflow: [
    { label: '1 · Write policy', body: 'A person states spending rules in plain English.' },
    {
      label: '2 · Compile',
      body: 'Claude maps the policy into numbered clauses and exposes ambiguities.',
    },
    { label: '3 · Confirm', body: 'A person resolves ambiguity and confirms the mandate.' },
    { label: '4 · Propose', body: 'An agent submits a purchase proposal.' },
    {
      label: '5 · Decide',
      body: 'Deterministic code returns ALLOW, ESCALATE or DENY with the governing clause.',
    },
    {
      label: '6 · Act or stop',
      body: 'Only the supported authorized path may reach the downstream sandbox provider.',
    },
    {
      label: '7 · Record',
      body: 'The decision and available outcome evidence are appended to the authorization record.',
    },
  ],
  refusalHeading: 'The product moment is a refusal',
  refusalBody:
    'A proposal can sit below every numeric limit and still be denied because its supplier is not approved. The denial cites the exact clause; the provider receives no call.',
  capabilitiesHeading: 'Verified in the repository',
  tryHeading: 'Run the evidence path',
  tryBody:
    'The repository includes a keyless test suite, five headless decision scenarios and a local operator console. Provider interaction remains sandbox-only.',
  githubLabel: 'Open the Warrant repository',
  githubHref: 'https://github.com/rmanish2000-del/warrant',
  consoleLabel: 'Open the sandbox console',
  consoleHref: '/warrant/console',
  partnershipHeading: 'Evaluate a bounded design partnership',
  partnershipBody:
    'Teams exploring purchasing authorization can open a public GitHub issue with the agent, payment boundary and policy question they need to test.',
  partnershipLabel: 'Start a public product conversation',
  partnershipHref:
    'https://github.com/rmanish2000-del/warrant/issues/new?title=Design%20partnership%20enquiry',
  trustHeading: 'Trust comes from the boundary',
  limitationsHeading: 'Current limitations',
  limitations: [
    'Prava interaction is sandbox-only; no real money moves.',
    'The console is local and single-operator, not a hardened service.',
    'The ALLOW path is authorized and recorded but is not wired to the provider.',
    'Spend counts at approval; release of expired holds is not implemented.',
    'The authorization record is tamper-evident, not signed and not non-repudiable.',
  ],
  metaTitle: 'Warrant — AI Purchasing Authorization — AI Workspace',
  metaDescription:
    'Warrant applies human-confirmed spending policy to AI purchase proposals with deterministic ALLOW, ESCALATE or DENY decisions and clause citations.',
  canonicalPath: '/products/warrant',
} as const;

export const warrantMcpProduct = {
  eyebrow: 'AI-agent tool policy',
  heading: 'Rules an AI agent cannot talk its way past',
  lead: 'Warrant MCP compiles plain-English policy once and uses deterministic code to check supported tool calls. A Claude Code hook turns DENY into a hard block where that integration applies.',
  maturity:
    'Current maturity: an open-source TypeScript reference implementation, a versioned policy specification and Claude Code enforcement. Other MCP hosts receive an advisory check tool, not binding enforcement.',
  problemHeading: 'Approval prompts and agent judgement leave a gap',
  problemBody:
    'A person should not have to approve every tool call, and the agent should not be the authority that decides whether its own action is permitted. A closed policy vocabulary provides a narrower, testable boundary.',
  quickstartHeading: 'Sixty-second path',
  quickstartCommands: [
    'npm install -g warrant-mcp',
    'cd your-project',
    'warrant-mcp init',
    'warrant-mcp test "delete .env"',
  ],
  quickstartBody:
    'Initialization installs a reviewed example policy without an API key. Policy review is the only command that compiles and the only one that needs an Anthropic API key.',
  lifecycleHeading: 'Policy lifecycle',
  lifecycle: [
    { label: 'Write', body: 'State rules in plain English.' },
    { label: 'Review', body: 'Compile once, inspect clauses and compare behaviour.' },
    { label: 'Accept', body: 'Adopt the reviewed artifact.' },
    { label: 'Check', body: 'Evaluate a supported action against closed structured rules.' },
    { label: 'Enforce', body: 'The Claude Code hook blocks DENY before the tool executes.' },
    { label: 'Report', body: 'Render the local decision record as a self-contained HTML report.' },
  ],
  vocabularyHeading: 'A closed, specified rule vocabulary',
  vocabulary: [
    'File deletion outside a workspace or against protected paths',
    'File writes constrained to named scopes',
    'Forbidden shell tokens, sequences and invocations',
    'HTTP host and method allowlists',
  ],
  specBody:
    'SPEC.md version 0.1.0 defines eight rule types, precedence, fail-closed behaviour and deliberate limits. A 76-case language-agnostic corpus checks the reference implementation against that contract.',
  capabilitiesHeading: 'Verified in the repository',
  integrationHeading: 'Supported enforcement model',
  integrationBody:
    'Claude Code PreToolUse is the binding integration. The check_action MCP tool returns advice for other hosts; it cannot force a host to comply.',
  recordHeading: 'Local record and report',
  recordBody:
    'Checked tool calls append to a local JSONL record. The report command renders a self-contained offline HTML view and screens output for credential shapes and machine identity before writing.',
  installLabel: 'Open installation and quickstart',
  githubHref: 'https://github.com/rmanish2000-del/warrant-mcp#sixty-seconds',
  specLabel: 'Read the policy specification',
  specHref: 'https://github.com/rmanish2000-del/warrant-mcp/blob/main/SPEC.md',
  securityLabel: 'Read the security surface',
  securityHref: 'https://github.com/rmanish2000-del/warrant-mcp/blob/main/SECURITY-SURFACE.md',
  partnershipHeading: 'Test a policy boundary with the reference implementation',
  partnershipBody:
    'Teams evaluating deterministic tool policy can open a public GitHub issue with the host, action types and failure boundary they need to test.',
  partnershipLabel: 'Start a public product conversation',
  partnershipHref:
    'https://github.com/rmanish2000-del/warrant-mcp/issues/new?title=Design%20partnership%20enquiry',
  limitationsHeading: 'Limitations are part of the product',
  limitations: [
    'This is a policy layer, not a sandbox.',
    'Binding enforcement currently applies to Claude Code tool calls only.',
    'Shell expansion, obfuscation, symlinks, implicit targets, unmapped tools and time-of-check/time-of-use gaps remain open classes.',
    'Hook configuration remains editable unless organization-managed settings protect it.',
    'The local record is append-only by convention, has no integrity check and is evidence rather than proof.',
  ],
  metaTitle: 'Warrant MCP — Deterministic AI Tool Policy — AI Workspace',
  metaDescription:
    'Warrant MCP compiles plain-English AI-agent policy once, checks supported tool calls deterministically, and blocks DENY through a Claude Code hook.',
  canonicalPath: '/products/warrant-mcp',
} as const;

/* -------------------------------------------------------------------------- */
/* /principles — P1-J §7                                                      */
/*                                                                            */
/* The five principles and glosses are NOT repeated here. They resolve from   */
/* `principles.items` above — one entry, referenced by `/` and `/principles`. */
/* -------------------------------------------------------------------------- */

export const principlesPage = {
  /** Same string as `principles.heading` — `04` §4. */
  heading: 'How we are building it',

  /** [V] authored in P1-J §7.1; a fact about the programme, not the product. */
  lead: 'Five principles govern how AI Workspace is designed. They also govern what this site is willing to claim. They are published here so that they can be held against us.',

  /** [V] */
  meaningHeading: 'What this means for this site',

  /**
   * Three checkable facts about the site, not product claims.
   *
   * ⚠️ P1-J §7.1 carries an explicit warning about the third string. An earlier
   * draft read "There is no pricing… and no roadmap on this site." That would
   * FAIL CI: the prohibited-term test matches `pricing` and `roadmap` as whole
   * words in any visible string — including one that denies them — exactly as
   * `02` §1.3 records for `customers`. The wording below says the same thing
   * and passes the gate. **Do not "improve" it back.**
   */
  meaningPoints: [
    'No claim appears here that we cannot evidence today.',
    'Where something is a design intention rather than a delivered capability, it is written as one.',
    shared.noPricePlan,
  ],

  /** P1-J §7.2. 149 characters. */
  metaTitle: 'Principles — AI Workspace',
  metaDescription:
    'The five principles that govern how AI Workspace is designed, and that govern what this site is willing to claim: connect, understand, extend, reuse, evidence.',
  canonicalPath: '/principles',
} as const;

/* -------------------------------------------------------------------------- */
/* /contact — P1-J §8. SHELL ONLY.                                            */
/*                                                                            */
/* Every address and the whole location block are placeholders blocked on      */
/* Open Item C (no mailbox exists) and B-F04 (no confirmed registered office). */
/* P1-J §8.1: "A contact page that publishes a non-existent address is worse   */
/* than no contact page." They are held here and NOT rendered — see            */
/* WITHHELD_UNTIL_UNBLOCKED.                                                   */
/* -------------------------------------------------------------------------- */

export const contact = {
  heading: 'Contact',

  /** [V] Inline link `register interest` -> `/#interest`. */
  lead: 'AI Workspace is in development. If you want to get in touch, the contact routes below reach a person.',
  leadLinkText: 'register interest',

  generalHeading: 'General enquiries',

  privacyHeading: 'Privacy and data requests',
  /**
   * Both timeframes are transcribed from P0 `05` §10 and `06` §8 — they are
   * existing commitments, not new ones.
   */
  privacyBody:
    'To ask what we hold about you, to correct it, or to have it deleted, email us from the address you registered with. We will acknowledge within 5 working days and complete your request within 30 days.',
  privacyLinkText: 'Read the privacy notice',

  securityHeading: 'Security',
  securityBody:
    'If you believe you have found a security issue, email us and we will respond as quickly as we can.',

  locationHeading: 'Where we are',

  /** Blocked. Not rendered. */
  emailPlaceholder: '{{PRIVACY_EMAIL}}',
  /** Blocked. Not rendered. */
  locationBody: '{{LEGAL_ENTITY_NAME}}\n{{REGISTERED_ADDRESS}}',

  /** P1-J §8.3. 127 characters. */
  metaTitle: 'Contact — AI Workspace',
  metaDescription:
    'How to reach AI Workspace, and how to ask what personal data we hold, correct it, or have it deleted.',
  canonicalPath: '/contact',
} as const;

/* -------------------------------------------------------------------------- */
/* /privacy — P0 `06` Part B, via P1-J §9                                     */
/*                                                                            */
/* `[LEGAL]` markers are stripped, as `06` Part A requires. Sentences carrying */
/* a build-time placeholder are held but NOT rendered, because `04`'s header   */
/* note forbids a `{{...}}` reaching the browser and P1-J §9 repeats it.       */
/* Everything withheld is listed in WITHHELD_UNTIL_UNBLOCKED with its reason.  */
/* -------------------------------------------------------------------------- */

export const privacy = {
  heading: 'Privacy notice',
  lastUpdatedLabel: 'Last updated',

  intro:
    'This page explains what happens to the information you give us when you register interest in AI Workspace at aiworkspacehq.com.',

  /**
   * ⚠️ WITHHELD. `06` Part B's second intro line reads "This site is a single
   * page. It does not have accounts, does not sell anything, and does not track
   * you across the web."
   *
   * The first sentence becomes FACTUALLY FALSE the moment a second content
   * route ships — the identical defect P1-J §10 caught in the `04` §11 404
   * string and corrected. P1-J did not catch this one. Raised as a finding;
   * the sentence is not rendered until `06` is corrected.
   */
  introSinglePage:
    'This site is a single page. It does not have accounts, does not sell anything, and does not track you across the web.',

  sections: [
    { n: 1, heading: 'Who we are' },
    { n: 2, heading: 'What we collect' },
    { n: 3, heading: 'Cookies' },
    { n: 4, heading: 'Why we use it, and on what basis' },
    { n: 5, heading: 'How long we keep it' },
    { n: 6, heading: 'Who we share it with' },
    { n: 7, heading: 'Where your information is held' },
    { n: 8, heading: 'Your rights and how to use them' },
    { n: 9, heading: 'How we protect it' },
    { n: 10, heading: 'Children' },
    { n: 11, heading: 'Changes to this notice' },
    { n: 12, heading: 'Contact' },
  ],

  collectIntro: 'When you register interest, we collect what you type into the form:',
  collectItems: [
    'your work email address — required;',
    'your name, organization, role, and any description of what you are trying to solve — all optional, and only if you choose to provide them;',
    'a record that you ticked the consent box, the date and time you did so, and the exact wording you agreed to.',
  ],
  collectNot:
    'We do not collect your phone number, your postal address, your location, or any information about you from third parties.',
  collectLogs:
    'Our hosting provider keeps standard server logs, which include IP addresses, for security and reliability. We do not store your IP address alongside your form submission.',

  /** Binding commitment C-13, capitalized as a sentence here per `02` §2. */
  cookies:
    'We do not use tracking cookies on this site. We do not use advertising cookies, we do not use analytics cookies, and we do not share data with advertising networks.',

  whyPurpose:
    'We use the information you submit for one purpose: to contact you about AI Workspace early access.',
  whyNotElse:
    'We do not use it for anything else. We do not add you to a general newsletter. We do not use it to market other products.',
  whyBasis:
    'We rely on your consent, which you give by ticking the box on the form. You can withdraw it at any time — see section 8.',

  retention:
    'We keep your details until we have contacted you about early access, or for 24 months from your most recent submission, whichever comes first. After that we delete them.',
  retentionStub:
    'When we delete your details, we keep a minimal record that consent was given and later withdrawn or expired — a one-way scrambled version of your email address and the date — for 12 months, so that we can show we handled your data properly. This record cannot be used to contact you.',
  retentionLogs: 'Server logs are kept for 30 days.',

  shareNot:
    'We do not sell your information. We do not share it with advertisers. We do not share it with data brokers.',
  shareLegal: 'We may disclose information if we are legally required to.',

  rightsIntro: 'You can ask us to:',
  rightsItems: [
    'tell you what we hold about you — we will send you a copy;',
    'correct anything that is wrong;',
    'delete your details — we will remove them from our records and from the internal notification email that told us you registered;',
    'stop contacting you — we will remove you from the list.',
  ],
  rightsTimeframe:
    'We will acknowledge your request within 5 working days and complete it within 30 days.',
  rightsNoReason: 'You do not have to give a reason, and asking costs you nothing.',
  rightsComplain:
    'If you are unhappy with how we have handled your information, you can complain to the relevant data protection authority.',

  protectItems: [
    'The site is served only over HTTPS.',
    'Access to submissions is limited to the people who need it, protected by multi-factor authentication.',
    'We do not store your IP address with your submission.',
    'We collect as little as we can, so that there is as little as possible to protect.',
  ],
  protectDisclaimer: 'No system is perfectly secure, and we do not claim otherwise.',

  children:
    'This site is intended for people acting in a professional capacity. It is not directed at children, and we do not knowingly collect information from them.',

  changes:
    'If we change how we handle your information, we will update this page and change the date at the top. If the change is significant and we still hold your details, we will email you.',

  backLinkText: 'Go to the AI Workspace home page',

  metaTitle: 'Privacy notice — AI Workspace',
  canonicalPath: '/privacy',
} as const;

/* -------------------------------------------------------------------------- */
/* Withheld strings — held verbatim, deliberately not rendered                */
/* -------------------------------------------------------------------------- */
/* 12. About — `AWHQ-WEB-P2C` §2, §5                                          */
/* -------------------------------------------------------------------------- */

/**
 * `/about` — P2-C §2. **Four sections. One withheld.**
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ THE FIFTH SECTION IS NOT HERE, AND THAT IS THE SPECIFICATION.            │
 * │                                                                           │
 * │ P2-C §2.3 withholds "Who is behind this" — legal entity name, registered  │
 * │ address, founding date, founder name, location. Blocked by Open Item B,   │
 * │ by P1-E's finding that the operating entity's capacity is unevidenced,    │
 * │ and by 0 of 8 IP assets having evidenced ownership: naming an owner of AI │
 * │ Workspace would assert something no instrument supports.                  │
 * │                                                                           │
 * │ §2.3: "The section is omitted, not explained. No 'coming soon', no        │
 * │ placeholder, no acknowledgement that something is missing. Omitting       │
 * │ silently is correct; announcing an omission reveals internal state and    │
 * │ invites the question."                                                    │
 * │                                                                           │
 * │ So there is no key for it here, no heading, and no comment in the         │
 * │ rendered markup. A test asserts its absence.                              │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Outline: `h1` → `h2` ×4. No `h3`. No image, diagram, timeline or statistic.
 */
export const about = {
  /** P2-C §5 `about.h1`. */
  heading: 'About AI Workspace',

  /**
   * The lead reuses `shared.coreProposition` — one entry, referenced by `/`
   * and `/about`. Not restated here.
   */

  /** P2-C §5 `about.whyH2`. */
  whyHeading: 'Why this is being built',

  /**
   * [D] P0 `01` §2, condensed to a single paragraph. **Not** the five-point
   * list — that belongs to `/platform`.
   *
   * Contains "clean slate", which a naive substring term-check would flag for
   * `sla`. The check is whole-word, so it passes; P2-C §12.2 records this.
   */
  whyBody:
    'Organizations already run on dozens of systems, chosen over many years for good reasons. Most AI tools arrive assuming a clean slate, and ask for data to be moved or re-platformed before they become useful. AI Workspace starts from the opposite assumption: that those systems are staying, and the layer has to fit around them.',

  /** P2-C §5 `about.todayH2`. */
  todayHeading: 'Where this programme is today',

  /**
   * The stage disclosure opens this section — `shared.stageDisclosure`, not a
   * copy. P2-C UX-7: it sits in its own section with its own `h2`, not buried
   * in a footer line.
   */

  /** [V] P2-C §5 `about.todayBody`. A fact about the site, not the product. */
  todayBody:
    'This site exists before the product does. It is here to explain the problem and the approach, and to let people who recognize that problem tell us so.',

  /** P2-C §5 `about.claimsH2`. */
  claimsHeading: 'What this site will and will not claim',

  /**
   * [OP] P0 `04` §4, principle 5. No inline link to `/principles` — P2-C §5:
   * that would put a second exit in one sentence.
   */
  claimsLead:
    'Evidence before claims is one of the five principles, and it constrains this site more than any of the others.',

  /**
   * The three claim bullets. A real `<ul>` (P2-C A-2), not styled paragraphs.
   *
   * The middle entry is `shared.noPricePlan` — referenced, not duplicated.
   * The third must not be reworded to use `customers`, `clients` or `users`:
   * all three fail the whole-word term test, including inside a denial
   * (P2-C §5, §12.2).
   */
  claims: [
    'Where something is a design intention rather than something we can demonstrate, it is written as one.',
    shared.noPricePlan,
    'No organization is named here as having adopted AI Workspace, because none has.',
  ],

  /** P2-C §5 `about.contactH2`. */
  contactHeading: 'Getting in touch',

  /**
   * Two inline links: `register interest` → `/#interest`, `contact us` →
   * `/contact`. Both link texts are meaningful out of context (P2-C A-3).
   */
  contactBody: 'To register interest or get in touch, use the contact routes below.',

  /** The two link texts, split out so the sentence is never rebuilt by hand. */
  contactRegisterLinkText: 'register interest',
  contactContactLinkText: 'contact us',

  /** P2-C §7.1. */
  metaTitle: 'About — AI Workspace',
  metaDescription:
    'Why AI Workspace is being built, where the programme is today, and what this site will and will not claim while the product is still in development.',
  canonicalPath: '/about',
} as const;

/* -------------------------------------------------------------------------- */

/**
 * Every approved string this build holds but does not render, with the reason.
 *
 * The identifier field is `path`, not `key`: gitleaks' `generic-api-key` rule
 * matches a literal `key:` followed by a quoted string and flagged three of
 * these as secrets. `path` is the more accurate name anyway — each value is a
 * dotted path into this module — so the field was renamed rather than the
 * scanner allowlisted. Never weaken a secret scanner to fit a naming choice.
 *
 * This list is the honest alternative to two worse options: rendering a
 * `{{...}}` placeholder to the browser (forbidden by `04`'s header note and by
 * P1-J §8.4/§9), or editing an approved string to remove the placeholder
 * (forbidden by P-10 and P1-A §7.1).
 *
 * A test asserts none of these reaches rendered output.
 */
export const WITHHELD_UNTIL_UNBLOCKED = [
  {
    path: 'contact.emailPlaceholder',
    blockedBy: 'Open Item C — no mailbox exists',
    note: 'P1-J §8.1: publishing a non-existent address is worse than publishing none.',
  },
  {
    path: 'contact.locationBody',
    blockedBy: 'Open Item B, and P1-E B-F04 — no confirmed registered office',
    note: "P1-E flags the address of record as a care-of address at a director's residence; publishing it is a counsel question.",
  },
  {
    path: 'privacy.introSinglePage',
    blockedBy: 'Factually false at Phase 1',
    note: '"This site is a single page" stops being true the moment a second content route ships — the same defect P1-J §10 corrected in the 404 string, not yet corrected in `06`.',
  },
  {
    path: 'privacy.section1',
    blockedBy: 'Open Item B — entity and address are placeholders',
    note: 'Every sentence in `06` §1 carries {{LEGAL_ENTITY_NAME}}, {{REGISTERED_ADDRESS}} or {{PRIVACY_EMAIL}}.',
  },
  {
    path: 'privacy.section2.analytics',
    blockedBy: 'No analytics exists (P-06); no bot mitigation exists (P-08)',
    note: '`06` Part A: the notice must not describe processing the implementation does not perform. This build measures nothing and shows no bot check.',
  },
  {
    path: 'privacy.section6.processors',
    blockedBy: 'Open Item D — the processor set is not fixed',
    note: 'P1-B F-1: sending `06` §6 to counsel before Open Item D closes buys a review of the wrong provider list. No processor exists in this build.',
  },
  {
    path: 'privacy.section7',
    blockedBy: 'Open Item A — counsel',
    note: '`06` §7 and Part C item 2: "must not be published in this form". The heading renders; the body does not.',
  },
  {
    path: 'privacy.section8.email',
    blockedBy: 'Open Item C — no mailbox exists',
    note: 'The rights process is rendered; the address to use is not, because it does not exist.',
  },
  {
    path: 'privacy.section12',
    blockedBy: 'Open Items B and C',
    note: 'Entirely composed of {{PRIVACY_EMAIL}}, {{LEGAL_ENTITY_NAME}} and {{REGISTERED_ADDRESS}}.',
  },
  {
    path: 'privacy.lastUpdated',
    blockedBy: '{{LAST_UPDATED}} — set at publication',
    note: 'The label renders with no date, because there is no publication date. AG-4 is ungranted.',
  },
  {
    path: 'footer.entityLine / contactEmail / copyright',
    blockedBy: 'Open Items B and C; P-12',
    note: 'Unchanged from P1-G. The footer renders its links only.',
  },
] as const;

/* -------------------------------------------------------------------------- */
/* PROVISIONAL — SPECIFICATION GAPS. NOT APPROVED COPY.                       */
/* -------------------------------------------------------------------------- */

/**
 * ⚠️ Two strings the page cannot render without, which `04` does not specify.
 *
 * P1-A §10.3(1) and P0 `11` §13 both say the same thing: a gap is fixed in the
 * specification, not improvised in code. Neither string could be omitted
 * without breaking a different approved rule, so both are implemented here,
 * quarantined, and escalated rather than folded into the approved copy above.
 *
 * ─── GAP-01 · skip-link text ───────────────────────────────────────────────
 *   `03` §2 Block 0 makes the skip link Required and `03` §3 specifies its
 *   behaviour and target, but no document gives its text. A skip link with no
 *   accessible name is not a skip link. Omitting it fails `03` §2; inventing
 *   its wording into `04` would breach P-10. Provisional value below.
 *
 * ─── GAP-02 · 404 page title ───────────────────────────────────────────────
 *   `04` §1 gives `<title>` for home and privacy only. `04` §11 gives the 404
 *   heading and body but no title, and `08` SEO-01 requires a unique title per
 *   route. The provisional value composes the approved `04` §11 heading with
 *   the product name, following the exact pattern of the approved privacy
 *   title ("Privacy notice — AI Workspace").
 *
 *   No meta description is emitted on /404: `04` §1 specifies none, 404 is
 *   noindex, and composing one would be a third invention.
 *
 * REQUIRED FOUNDER ACT: ratify both strings into `04`, or supply replacements.
 * Until then they are recorded in HANDOFF.md as open escalations. The unit test
 * `copy.provisionalIsFrozen` fails if a third entry is added, so this cannot
 * become a quiet back door for unapproved copy.
 */
export const PROVISIONAL = {
  /** GAP-01 */
  skipLinkText: 'Skip to main content',
  /** GAP-02 */
  notFoundTitle: 'Page not found — AI Workspace',
} as const;

/* -------------------------------------------------------------------------- */
/* Enforcement metadata                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Dotted paths of every string that legitimately contains a `{{...}}` build-time
 * placeholder. The copy test asserts that this list is exactly the set of such
 * strings, and the e2e test asserts that none of them reaches rendered output.
 *
 * A new entry here is a signal that something is blocked on an open item — it
 * should be justified, not merely added to make a test pass.
 */
export const BUILD_TIME_PLACEHOLDER_KEYS = [
  'interest.successBody',
  'interest.formErrors.serverError',
  'footer.entityLine',
  'footer.contactEmail',
  'footer.copyright',
  // Phase 1 — every one is withheld from rendering, see WITHHELD_UNTIL_UNBLOCKED
  'contact.emailPlaceholder',
  'contact.locationBody',
] as const;

/**
 * Dotted paths of every string that legitimately contains a `%name%` runtime
 * placeholder. `04` §5.1 and §5.6 specify exactly these two and no others.
 */
export const RUNTIME_PLACEHOLDER_KEYS = [
  'interest.characterCounter',
  'interest.fieldErrors.fieldTooLong',
] as const;

export const copy = {
  about,
  meta,
  header,
  hero,
  principles,
  interest,
  footer,
  secondaryCta,
  openGraph,
  notFound,
  // Phase 1 — P1-J
  nav,
  platform,
  products,
  warrantProduct,
  warrantMcpProduct,
  experience,
  principlesPage,
  contact,
  privacy,
  // THREE-PROJECTS-ON-SITE (2026-08-19): in the aggregate so the prohibited-term
  // gate and M-9's approved-string set both see every /building string.
  building,
} as const;

export default copy;

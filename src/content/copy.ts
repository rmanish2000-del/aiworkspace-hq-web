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
/* 3. Hero — `04` §3                                                          */
/* -------------------------------------------------------------------------- */

export const hero = {
  /** Eyebrow. A `<p>`, not a heading — it carries no document-outline meaning. */
  eyebrow: 'Enterprise AI Operating Layer',

  /** The single `h1` on the page. */
  headline: 'The layer between your enterprise systems and your AI agents',

  supporting:
    'AI Workspace is designed to connect the enterprise systems you already run, understand how your organization actually works, and give AI agents a governed place to operate — without asking you to migrate the systems you already depend on.',

  /** Binding commitment C-11. */
  stageDisclosure: 'AI Workspace is in development. Early access is not yet open.',

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
    { href: '/platform', label: 'Platform' },
    { href: '/principles', label: 'Principles' },
    { href: '/contact', label: 'Contact' },
  ],
  /**
   * The fourth item, styled as the primary button and pointing at the form on
   * the home route. Its label is `interest.heading` — one entry, referenced.
   */
  registerInterestHref: '/#interest',
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
    'We publish no price, no availability date, and no forward plan, because none of those has been decided.',
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
  lead: 'AI Workspace is in development and early access is not yet open. If you want to hear from us when it does, the fastest route is to register interest.',
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
  principlesPage,
  contact,
  privacy,
} as const;

export default copy;

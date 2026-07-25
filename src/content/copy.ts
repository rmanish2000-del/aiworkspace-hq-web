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
  body: 'There is only one page here at the moment.',
  linkText: 'Go to the AI Workspace home page',
} as const;

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
} as const;

export default copy;

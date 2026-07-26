import { CANONICAL_ORIGIN, canonicalUrl } from './site';

/**
 * deferred-static.ts — three production files that are BUILT BUT NOT EMITTED.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ Each generator below is complete and tested. None has a route file, so     │
 * │ none reaches `dist/`. Creating the route is a one-line change once the     │
 * │ blocker clears — which is the point of scaffolding it now.                 │
 * │                                                                           │
 * │ The alternative — emitting each file with invented content — is worse in   │
 * │ a specific way for each of the three, set out below.                       │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Tests assert both halves: that the generators produce correct documents, and
 * that the corresponding URLs currently 404.
 */

/* -------------------------------------------------------------------------- */
/* security.txt — RFC 9116                                                    */
/* -------------------------------------------------------------------------- */

/**
 * ⛔ NOT EMITTED. Blocked on **Open Item C** — no mailbox exists.
 *
 * `08` SEC-14 requires `security.txt` "with the contact address and an expiry
 * date". RFC 9116 makes `Contact` mandatory: a security.txt without one is not
 * a valid security.txt, and a security.txt with an address that bounces is
 * worse than none — it tells a researcher who found a real vulnerability that
 * they have reported it when they have not.
 *
 * AWHQ-AUT-P1F P-13 blocks it for exactly this reason.
 *
 * @param contact  A `mailto:` or URL contact. Must be a mailbox that has been
 *                 tested to receive.
 * @param expires  ISO 8601. RFC 9116 requires it, and recommends under a year.
 */
export function securityTxt(contact: string, expires: Date): string {
  if (!contact) {
    throw new Error('security.txt requires a Contact field (RFC 9116 §2.5.3).');
  }

  return [
    `Contact: ${contact}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: en',
    `Canonical: ${canonicalUrl('/.well-known/security.txt')}`,
    '',
  ].join('\n');
}

/** How long a security.txt should claim to be valid. RFC 9116 recommends < 1y. */
export const SECURITY_TXT_VALIDITY_DAYS = 180;

/* -------------------------------------------------------------------------- */
/* humans.txt                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * ⛔ NOT EMITTED. Blocked on **approved copy**, and on a rule about people.
 *
 * humans.txt exists to credit the people who built a site. Every string it
 * would contain is unapproved:
 *
 *   - `04` §10: "Implementation must contain no string not listed here."
 *     humans.txt content appears nowhere in `04`.
 *   - P1-J §8.2 rules "no team names or photographs" off `/contact`. A file
 *     whose entire purpose is naming the team does not become acceptable by
 *     living at a different path.
 *   - Naming individuals publishes personal data, which needs a basis nobody
 *     has established.
 *
 * The generator therefore takes its content as an argument and invents nothing.
 * A humans.txt with no humans in it would be pointless, so this stays unemitted
 * until there is approved copy naming who to credit and confirmation they
 * consent to being named.
 */
export function humansTxt(
  entries: readonly { section: string; lines: readonly string[] }[],
): string {
  if (entries.length === 0) {
    throw new Error('humans.txt with no entries is not worth serving.');
  }

  return `${entries
    .map(({ section, lines }) => [`/* ${section.toUpperCase()} */`, ...lines].join('\n'))
    .join('\n\n')}\n`;
}

/* -------------------------------------------------------------------------- */
/* Feed / RSS                                                                 */
/* -------------------------------------------------------------------------- */

export interface FeedItem {
  readonly title: string;
  readonly url: string;
  readonly published: Date;
  readonly summary: string;
}

/**
 * ⛔ NOT EMITTED. Blocked on **there being nothing to syndicate.**
 *
 * A feed is a promise that new items will appear in it. P1-J §12 defers
 * `/research` because no approved research exists, and §13 defers `/docs`
 * because no approved platform specification exists. There is no blog. So an
 * empty feed would announce a publishing cadence that has not been decided —
 * and `02` §3 prohibits claims about dates and forward plans.
 *
 * P1-J §12 puts it well about a placeholder page, and it applies here: "a page
 * that says 'research will appear here' is a promise with a date attached in
 * the reader's mind."
 *
 * The generator refuses an empty feed rather than emitting one, so wiring a
 * route before there is content fails loudly instead of publishing a promise.
 */
export function atomFeed(items: readonly FeedItem[], updated: Date): string {
  if (items.length === 0) {
    throw new Error(
      'Refusing to build an empty feed: an empty feed promises a cadence that has not been decided.',
    );
  }

  const entries = items
    .map((item) =>
      [
        '  <entry>',
        `    <title>${escapeXml(item.title)}</title>`,
        `    <link href="${escapeXml(item.url)}"/>`,
        `    <id>${escapeXml(item.url)}</id>`,
        `    <updated>${item.published.toISOString()}</updated>`,
        `    <summary>${escapeXml(item.summary)}</summary>`,
        '  </entry>',
      ].join('\n'),
    )
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>AI Workspace</title>
  <link href="${CANONICAL_ORIGIN}/"/>
  <id>${CANONICAL_ORIGIN}/</id>
  <updated>${updated.toISOString()}</updated>
${entries}
</feed>
`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The URLs these generators would serve, and why each is currently absent.
 * A test asserts every one of them 404s.
 */
export const DEFERRED_URLS = [
  { url: '/.well-known/security.txt', blockedBy: 'Open Item C — no mailbox exists (P-13)' },
  { url: '/humans.txt', blockedBy: 'No approved copy; naming people needs consent and a basis' },
  { url: '/feed.xml', blockedBy: 'Nothing to syndicate — /research and /docs are deferred' },
  { url: '/rss.xml', blockedBy: 'Same as /feed.xml' },
] as const;

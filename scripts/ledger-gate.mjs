/**
 * ledger-gate.mjs — G-LEDGER (AWHQ-WEB-CC008 scope 3).
 *
 * The eight-check discipline as CI, applied to the BUILT wired routes:
 *   1. every substantive rendered sentence traces to exactly one ledger block
 *      (or to the approved copy.ts chrome) — an orphan string fails;
 *   2. tier <= evidence is enforced by src/lib/ledger.ts at build time (a
 *      violation cannot build; this gate re-asserts the file parses clean);
 *   3. every negative claim carries date + reverify (T-3) — re-checked here;
 *   4. the G-4 prohibited-term floor runs over the LEDGER FILES themselves;
 *   5. withheld blocks (CB-21, CB-74) do not render on their routes;
 *   6. structural labels (headings, eyebrows) are enumerated, not silent.
 *
 * Requires dist/ (npm run build). Exits non-zero on any failure.
 */
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const failures = [];
let checks = 0;
function assert(ok, label) {
  checks += 1;
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
  if (!ok) failures.push(label);
}

const WIRED = {
  '/': 'dist/index.html',
  '/trust': 'dist/trust.html',
  '/technology': 'dist/technology.html',
  '/what-we-havent-built': 'dist/what-we-havent-built.html',
  '/enterprise': 'dist/enterprise.html',
  '/security': 'dist/security.html',
  '/products': 'dist/products.html',
  '/products/warrant': 'dist/products/warrant.html',
  '/products/warrant-mcp': 'dist/products/warrant-mcp.html',
};

const ledgerDoc = parse(readFileSync('src/content/ledger/claims.yaml', 'utf8'));
const claims = ledgerDoc.claims;
// D2 — the rendered review stamp must equal the ledger's review record.
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const [reviewY, reviewM, reviewD] = (ledgerDoc.review?.last ?? '').split('-').map(Number);
const reviewStamp = `${reviewD} ${MONTHS[reviewM - 1]} ${reviewY}`;
const blocks = parse(readFileSync('src/content/ledger/blocks.yaml', 'utf8')).blocks;
const claimById = new Map(claims.map((claim) => [claim.id, claim]));

/* ---- 2 + 3: ledger discipline re-asserted -------------------------------- */

console.log('━━ Ledger file discipline');
assert(
  claims.length > 0 && blocks.length > 0,
  `ledger parses: ${claims.length} claims, ${blocks.length} blocks`,
);
for (const claim of claims.filter((candidate) => candidate.negative)) {
  assert(
    Boolean(claim.reverify?.cadence && claim.reverify?.last && claim.date),
    `T-3: negative claim ${claim.id} is dated with a re-verification cadence`,
  );
}
assert(
  blocks.every((block) => block.claim === null || claimById.has(block.claim)),
  'every block cites a ledger claim or is explicitly non-factual',
);

/* ---- 4: G-4 prohibited terms over the ledger files ------------------------ */

console.log('━━ G-4 over the ledger');
{
  const TERMS = [
    'customer',
    'customers',
    'client',
    'clients',
    'user',
    'users',
    'pilot',
    'pilots',
    'partner',
    'partners',
    'logo',
    'logos',
    'funding',
    'valuation',
    'roadmap',
    'SLA',
    'certified',
    'ProjectOS',
    'TradeOS',
    'EduOS',
    'UrjaOps',
    'seamless',
    'world-class',
  ];
  const PHRASES = ['AI Workspace HQ', 'Legal Engineering', 'case study', 'trusted by'];
  const ledgerText =
    readFileSync('src/content/ledger/claims.yaml', 'utf8') +
    readFileSync('src/content/ledger/blocks.yaml', 'utf8');
  const hits = [
    ...TERMS.filter((term) =>
      new RegExp(`(?<![\\p{L}\\p{N}])${term}(?![\\p{L}\\p{N}])`, 'iu').test(ledgerText),
    ),
    ...PHRASES.filter((phrase) => ledgerText.toLowerCase().includes(phrase.toLowerCase())),
  ];
  assert(
    hits.length === 0,
    `no prohibited term in the ledger files${hits.length ? ` — ${hits.join(', ')}` : ''}`,
  );
}

/* ---- 1 + 5 + 6: crawl the built routes ------------------------------------ */

console.log('━━ Rendered-string tracing (built HTML)');

/**
 * copy.ts chrome — every string literal in the approved copy module.
 * Comments are stripped first: an apostrophe inside a comment would shift
 * the quote pairing and silently swallow real literals.
 */
const copySource = readFileSync('src/content/copy.ts', 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/^[ \t]*\/\/.*$/gm, ' ');
const chrome = new Set(
  [...copySource.matchAll(/'((?:[^'\\\n]|\\.)+)'/g)]
    .map((match) => match[1].replace(/\\'/g, "'").trim())
    .filter((literal) => literal.length > 0),
);

/** Structural labels authored by the wired pages — enumerated, not silent. */
const LABELS = new Set([
  'AI Workspace',
  'Trust',
  'Technology',
  'The gap list',
  'For enterprise',
  'Security',
  'What we do not have',
  'What we can show you',
  'How we use AI',
  'The exit strategy came first',
  'The six technologies',
  'What we rejected',
  'How we decide',
  'A stated ceiling',
  'The list',
  'Why there are no dates here',
  'The questions',
  'Who decides',
  'The gate on this page',
  'What is true today',
  'Where this page stops',
  'Register interest',
  'Choose the authorization boundary',
  'Commerce',
  'Explore Warrant',
  'Agent tools',
  'Explore Warrant MCP',
  // Six technologies (FD-F2) — names and roles from CB-33's verified sentence.
  'PostgreSQL',
  'Data',
  'Node.js',
  'Application runtime',
  'Docker with Docker Compose',
  'Packaging and deployment',
  'Git',
  'Source control',
  'npm',
  'Dependency management',
  'Automated test and release pipeline',
  'Runs before anything ships',
  // Badge vocabulary + withheld notice + review anchors.
  'This statement is withheld until its verification completes. The gap is deliberate.',
  `Last reviewed ${reviewStamp}.`,
  `Last reviewed ${reviewStamp}. Reviewed every quarter.`,
]);

const blockCopies = blocks.filter((block) => !block.withheld).map((block) => block.copy);

function visibleText(html) {
  return html
    .replace(/^[\s\S]*?<body[^>]*>/, ' ') // head metadata is not rendered text
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0);
}

const orphanReport = [];
for (const [route, file] of Object.entries(WIRED)) {
  const lines = visibleText(readFileSync(file, 'utf8'));
  const orphans = lines.filter((line) => {
    if (chrome.has(line) || LABELS.has(line)) return false;
    if (/^(✓|→|◌|◆)?\s*(VERIFIED|APPROVED|UNDER DESIGN|GATED)( · \d{4}-\d{2}-\d{2})?$/.test(line))
      return false;
    if (blockCopies.some((copy) => copy === line || copy.includes(line) || line.includes(copy)))
      return false;
    if (line.length < 4) return false; // glyphs and separators
    return true;
  });
  for (const orphan of orphans) orphanReport.push(`${route}: "${orphan.slice(0, 90)}"`);
  assert(orphans.length === 0, `${route}: every rendered string traces (${lines.length} lines)`);
}
for (const orphan of orphanReport) console.log(`    ORPHAN ${orphan}`);

console.log('━━ Withheld blocks stay withheld');
{
  const c13 = 'We do not use tracking cookies on this site.';
  for (const route of ['/trust', '/security']) {
    const html = readFileSync(WIRED[route], 'utf8');
    assert(!html.includes(c13), `${route}: CB-21/CB-74 (C-13 sentence) does not render (CT-4)`);
  }
  const about = readFileSync('dist/about.html', 'utf8');
  assert(
    !/accountab/i.test(about.replace(/<script[\s\S]*?<\/script>/g, '')) || /withheld/i.test(about),
    '/about: the accountability block remains withheld or marked withheld (CT-5)',
  );
}

console.log(
  `\n${failures.length === 0 ? 'G-LEDGER PASS' : 'G-LEDGER FAILURES'} — ${checks} checks, ${failures.length} failed\n`,
);
if (failures.length > 0) process.exit(1);

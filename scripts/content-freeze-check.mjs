// PUBLISH-GUARDIAN-PAGES: the content freeze, enforced.
// The seven frozen routes' rendered visible text must hash to the values in
// docs/governance/CONTENT-FREEZE.json. A text change without a founder
// authorisation entry (and matching new hash) in that file fails the build.
// Runs against dist/ - the BUILT artifact, the one scans A/B/C passed on.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const freeze = JSON.parse(readFileSync('docs/governance/CONTENT-FREEZE.json', 'utf-8'));
// Founder ruling 2026-08-11 (Option A): the Guardian legal pages live under
// /warrant-guardian/*; the root /about /contact /privacy are AI Workspace
// pages governed by the copy module, not this freeze.
const FILES = {
  '/terms': 'dist/terms.html',
  '/privacy': 'dist/privacy.html',
  '/refunds': 'dist/refunds.html',
  '/delivery': 'dist/delivery.html',
  '/contact': 'dist/contact.html',
  '/about': 'dist/about.html',
  '/warrant-guardian/': 'dist/warrant-guardian/index.html',
};

const decode = (s) =>
  s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&mdash;', '—')
    .replaceAll('&nbsp;', ' ');

const visible = (path) =>
  decode(
    readFileSync(path, 'utf-8')
      .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim();

let failed = 0;
for (const [route, path] of Object.entries(FILES)) {
  const digest = createHash('sha256').update(visible(path)).digest('hex');
  if (digest !== freeze.routes[route]) {
    failed += 1;
    console.error(
      `CONTENT FREEZE VIOLATION ${route}: rendered text changed.\n` +
        `  frozen: ${freeze.routes[route]}\n  actual: ${digest}\n` +
        `  A change requires an explicit founder authorisation entry in ` +
        `docs/governance/CONTENT-FREEZE.json in the same commit.`,
    );
  }
}
if (failed) process.exit(1);
console.log('content freeze intact: 7/7 frozen routes unchanged');

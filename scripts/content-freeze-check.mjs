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
  '/warrant-guardian/terms': 'dist/warrant-guardian/terms.html',
  '/warrant-guardian/privacy': 'dist/warrant-guardian/privacy.html',
  '/warrant-guardian/refunds': 'dist/warrant-guardian/refunds.html',
  '/warrant-guardian/delivery': 'dist/warrant-guardian/delivery.html',
  '/warrant-guardian/contact': 'dist/warrant-guardian/contact.html',
  '/warrant-guardian/about': 'dist/warrant-guardian/about.html',
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

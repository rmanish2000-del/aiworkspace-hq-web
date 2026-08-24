#!/usr/bin/env node
/**
 * `npm run fleet` — the founder fleet dashboard, rendered locally
 * (FOUNDER-DASHBOARD-HTML, 2026-08-21).
 *
 * THE ACCESS BOUNDARY IS THE BIND ADDRESS, and it is deliberate.
 *
 * The assignment asks for an internal route with "the smallest existing-site
 * -compatible authentication boundary, or BLOCKED with the exact missing auth
 * capability". The site has no authentication capability of any kind: it is a
 * static Astro build with `output: 'static'`, no adapter, no middleware, no
 * session, no user store and no identity provider. Adding one means creating a
 * credential, which this assignment forbids in the same breath.
 *
 * So the boundary here is not a password on a public URL — it is that there is
 * no public URL. This process listens on 127.0.0.1 only, it is never deployed,
 * and `scripts/verify-release.mjs` fails the release if any trace of it reaches
 * the built artifact. That is a stronger boundary than a shared secret, and it
 * is the honest one: it costs the phone. The report says so in those words.
 *
 * Every request re-reads the Drive folder. There is no cache, so there is no
 * cached age to misreport.
 */
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderFleetPage } from './fleet/render.mjs';
import { buildView, readFleetSource, SOURCE_DIR, SOURCE_TITLE } from './fleet/source.mjs';

/** Loopback only. Not configurable: see the boundary note above. */
const HOST = '127.0.0.1';
const PORT = Number(process.env.AIWHQ_FLEET_PORT ?? 4390);

/** One read, one parse, one page. Shared by the server and `--once`. */
export function renderNow() {
  return renderFleetPage(buildView(readFleetSource(), new Date()));
}

function main() {
  if (process.argv.includes('--once')) {
    process.stdout.write(renderNow());
    return;
  }

  const server = createServer((request, response) => {
    if (request.url === '/favicon.ico') {
      response.writeHead(404).end();
      return;
    }
    let html;
    try {
      html = renderNow();
    } catch (error) {
      // The renderer is written not to throw; if it ever does, the reader still
      // gets a readable failure rather than a hung socket or a blank page.
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(`fleet dashboard renderer failed: ${error.message}\n`);
      return;
    }
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    });
    response.end(html);
  });

  server.listen(PORT, HOST, () => {
    process.stdout.write(
      `fleet dashboard: http://${HOST}:${PORT}\n` +
        `  source folder: ${SOURCE_DIR}\n` +
        `  source title:  ${SOURCE_TITLE}\n` +
        `  loopback only — not deployed, not reachable from another device\n`,
    );
  });
}

// Only when run as a command. Importing this module — as a test might, to
// exercise `renderNow` — must never open a socket.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}

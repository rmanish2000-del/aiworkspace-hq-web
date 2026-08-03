/**
 * hq-console — a local operator console for this repository.
 *
 * Zero dependencies. Serves a static UI and a read-only JSON API over the
 * repository's real state: PROJECT_STATE.md, the design tokens, the built
 * output in dist/, and git. Nothing is mocked, nothing is written, and the
 * server binds to the loopback interface only.
 *
 *   node tools/hq-console/server.mjs      # http://127.0.0.1:4400
 */
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..');
const PUBLIC_DIR = join(HERE, 'public');
const PORT = Number(process.env.HQ_PORT ?? 4400);
const HOST = '127.0.0.1';
const PREVIEW_ORIGIN = 'http://127.0.0.1:4321';

/* -------------------------------------------------------------------------- */
/* Small utilities                                                            */
/* -------------------------------------------------------------------------- */

function git(args) {
  return new Promise((resolvePromise, rejectPromise) => {
    execFile('git', args, { cwd: REPO_ROOT, timeout: 5000 }, (error, stdout, stderr) => {
      if (error) rejectPromise(new Error(stderr.trim() || error.message));
      else resolvePromise(stdout);
    });
  });
}

async function readRepoFile(relPath) {
  return readFile(join(REPO_ROOT, relPath), 'utf8');
}

/** Extracts one `## …` section of a markdown document. */
function mdSection(markdown, headingPattern) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^## /.test(line));
  return rest.slice(0, end === -1 ? rest.length : end).join('\n');
}

/** Strips the markdown emphasis this file uses inside table cells. */
function mdClean(cell) {
  return cell
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim();
}

/** Parses every pipe table in a block of markdown into arrays of rows. */
function mdTables(block) {
  const tables = [];
  let current = null;
  for (const line of block.split('\n')) {
    if (/^\s*\|/.test(line)) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => mdClean(cell));
      if (cells.every((cell) => /^[-\s:]*$/.test(cell))) continue; // separator row
      if (!current) {
        current = { header: cells, rows: [] };
        tables.push(current);
      } else {
        current.rows.push(cells);
      }
    } else if (current) {
      current = null;
    }
  }
  return tables;
}

/** Parses `--name: value;` custom properties out of a CSS block. */
function cssProps(block) {
  const props = {};
  const withoutComments = block.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of withoutComments.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    props[match[1]] = match[2].replace(/\s+/g, ' ').trim();
  }
  return props;
}

/** Extracts the body of the first balanced `{ … }` after `index`. */
function cssBlockAfter(css, index) {
  const open = css.indexOf('{', index);
  if (open === -1) return '';
  let depth = 1;
  for (let i = open + 1; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return '';
}

async function isPreviewLive() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 600);
  try {
    const response = await fetch(PREVIEW_ORIGIN + '/', { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------------------------------------------------- */
/* API handlers — every value below is read from the repository, live         */
/* -------------------------------------------------------------------------- */

async function apiSummary() {
  const pkg = JSON.parse(await readRepoFile('package.json'));
  const state = await readRepoFile('PROJECT_STATE.md');

  const headerField = (label) => {
    const match = state.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`));
    return match ? mdClean(match[1]) : null;
  };

  const lifecycleBlock = mdSection(state, /^## 1\. Lifecycle state/);
  const lifecycleTable = lifecycleBlock ? mdTables(lifecycleBlock)[0] : null;
  const currentRow = lifecycleTable?.rows.find((row) => /current/i.test(row[2] ?? ''));

  const [branch, log, status] = await Promise.all([
    git(['rev-parse', '--abbrev-ref', 'HEAD']),
    git(['log', '-1', '--pretty=format:%h%x1f%s%x1f%an%x1f%aI']),
    git(['status', '--porcelain']),
  ]);
  const [hash, subject, author, date] = log.split('\u001f');

  let dist = { built: false, files: 0, htmlFiles: 0, totalBytes: 0 };
  const distDir = join(REPO_ROOT, 'dist');
  if (existsSync(distDir)) {
    const entries = await readdir(distDir);
    let totalBytes = 0;
    let htmlFiles = 0;
    for (const entry of entries) {
      const info = await stat(join(distDir, entry));
      if (info.isFile()) {
        totalBytes += info.size;
        if (entry.endsWith('.html')) htmlFiles += 1;
      }
    }
    dist = { built: entries.length > 0, files: entries.length, htmlFiles, totalBytes };
  }

  return {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    specVersion: headerField('Specification version implemented'),
    authorization: headerField('Authorization operated under'),
    stateLastUpdated: headerField('Last updated'),
    lifecycle: currentRow ? { state: currentRow[1], status: currentRow[2] } : null,
    git: {
      branch: branch.trim(),
      dirtyCount: status.split('\n').filter((line) => line.trim() !== '').length,
      commit: { hash, subject, author, date },
    },
    dist,
    previewLive: await isPreviewLive(),
    previewOrigin: PREVIEW_ORIGIN,
  };
}

async function apiGovernance() {
  const state = await readRepoFile('PROJECT_STATE.md');

  const gatesBlock = mdSection(state, /^## 2\. Gates/);
  const gates = gatesBlock
    ? mdTables(gatesBlock)[0].rows.map(([gate, authorizes, gateState]) => ({
        gate,
        authorizes,
        state: gateState,
        granted: /granted/i.test(gateState ?? '') && !/not granted/i.test(gateState ?? ''),
      }))
    : [];

  const itemsBlock = mdSection(state, /^## 3\. Open items/);
  const openItems = itemsBlock
    ? mdTables(itemsBlock)[0].rows.map(([item, subject, itemState, blocks]) => ({
        item,
        subject,
        state: itemState,
        blocks,
        closed: /closed/i.test(itemState ?? '') && !/partially/i.test(itemState ?? ''),
        partial: /partially/i.test(itemState ?? ''),
      }))
    : [];

  return { gates, openItems };
}

async function apiQuality() {
  const state = await readRepoFile('PROJECT_STATE.md');

  const resultsBlock = mdSection(state, /^## 6\. Gate results/);
  const resultsTable = resultsBlock ? mdTables(resultsBlock)[0] : null;
  const gateResults = resultsTable
    ? resultsTable.rows.map(([gate, result]) => ({
        gate,
        result,
        pass: /pass/i.test(result ?? ''),
        deferred: /not run|runs in CI/i.test(result ?? ''),
      }))
    : [];

  const factsBlock = mdSection(state, /^## 5\. Verified facts/);
  const factsTable = factsBlock ? mdTables(factsBlock)[0] : null;
  const facts = factsTable
    ? factsTable.rows.map(([property, value, how]) => ({ property, value, how }))
    : [];

  return { gateResults, facts };
}

async function apiRoutes() {
  const pagesDir = join(REPO_ROOT, 'src', 'pages');
  const entries = (await readdir(pagesDir)).sort();

  const toRoute = (file) => {
    if (file === 'index.astro') return '/';
    if (file.endsWith('.astro')) return '/' + file.replace(/\.astro$/, '');
    if (file.endsWith('.ts')) return '/' + file.replace(/\.ts$/, '');
    return null;
  };
  const toDistFile = (route) => {
    if (route === '/') return 'index.html';
    if (/\.[a-z]+$/.test(route)) return route.slice(1);
    return route.slice(1) + '.html';
  };

  const routes = [];
  for (const file of entries) {
    const route = toRoute(file);
    if (!route) continue;
    const distFile = toDistFile(route);
    const distPath = join(REPO_ROOT, 'dist', distFile);
    const entry = {
      route,
      sourceFile: 'src/pages/' + file,
      distFile: 'dist/' + distFile,
      built: false,
      bytes: null,
      title: null,
      robots: null,
    };
    if (existsSync(distPath)) {
      const info = await stat(distPath);
      entry.built = true;
      entry.bytes = info.size;
      if (distFile.endsWith('.html')) {
        const html = await readFile(distPath, 'utf8');
        entry.title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
        entry.robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? null;
      }
    }
    routes.push(entry);
  }

  return { previewLive: await isPreviewLive(), previewOrigin: PREVIEW_ORIGIN, routes };
}

async function apiTokens() {
  const css = await readRepoFile('src/styles/tokens.css');

  const rootIndex = css.indexOf(':root');
  const light = cssProps(cssBlockAfter(css, rootIndex));

  const darkIndex = css.indexOf('@media (prefers-color-scheme: dark)');
  const darkBlock = darkIndex === -1 ? '' : cssBlockAfter(css, darkIndex);
  const dark = cssProps(darkBlock);

  return { source: 'src/styles/tokens.css', light, dark };
}

async function apiCommits() {
  const [branch, log] = await Promise.all([
    git(['rev-parse', '--abbrev-ref', 'HEAD']),
    git(['log', '-20', '--pretty=format:%h%x1f%s%x1f%an%x1f%aI']),
  ]);
  const commits = log
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const [hash, subject, author, date] = line.split('\u001f');
      return { hash, subject, author, date };
    });
  return { branch: branch.trim(), commits };
}

const API = {
  '/api/summary': apiSummary,
  '/api/governance': apiGovernance,
  '/api/quality': apiQuality,
  '/api/routes': apiRoutes,
  '/api/tokens': apiTokens,
  '/api/commits': apiCommits,
};

/* -------------------------------------------------------------------------- */
/* HTTP server                                                                */
/* -------------------------------------------------------------------------- */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(body);
}

async function serveStatic(response, urlPath) {
  const relative = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  const filePath = normalize(join(PUBLIC_DIR, relative));
  if (!filePath.startsWith(PUBLIC_DIR + sep) && filePath !== join(PUBLIC_DIR, 'index.html')) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }
  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    response.end(body);
  } catch {
    sendJson(response, 404, { error: 'Not found: ' + urlPath });
  }
}

const server = createServer(async (request, response) => {
  const urlPath = new URL(request.url ?? '/', 'http://' + HOST).pathname;
  const handler = API[urlPath];
  if (handler) {
    try {
      sendJson(response, 200, await handler());
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Internal error',
        endpoint: urlPath,
      });
    }
    return;
  }
  await serveStatic(response, urlPath);
});

server.listen(PORT, HOST, () => {
  console.log(`hq-console reading ${REPO_ROOT}`);
  console.log(`hq-console serving http://${HOST}:${PORT}`);
});

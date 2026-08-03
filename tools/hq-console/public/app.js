/**
 * hq-console frontend. Renders the read-only JSON API served by server.mjs.
 * No framework, no innerHTML, no mock data: every value on screen came from
 * the repository at request time.
 */

/* -------------------------------------------------------------------------- */
/* DOM helpers                                                                */
/* -------------------------------------------------------------------------- */

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'style') Object.assign(node.style, value);
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined) continue;
    node.append(child);
  }
  return node;
}

function replaceChildrenOf(container, ...nodes) {
  container.replaceChildren(...nodes);
}

/** Staggered enter animation — transform/opacity only. */
function animateIn(container) {
  const items = container.querySelectorAll('.enter');
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 30, 360)}ms`;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach((item) => item.classList.add('enter--in'));
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return '—';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function timeAgo(iso) {
  if (!iso) return '—';
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 90) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 36) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 45) return `${days} d ago`;
  return new Date(iso).toLocaleDateString();
}

/* -------------------------------------------------------------------------- */
/* Colour maths — WCAG contrast for the tokens view                           */
/* -------------------------------------------------------------------------- */

function parseHex(value) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((value ?? '').trim());
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  if (!a || !b) return null;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* -------------------------------------------------------------------------- */
/* Fetch + section lifecycle                                                  */
/* -------------------------------------------------------------------------- */

async function getJson(path) {
  const response = await fetch(path, { headers: { accept: 'application/json' } });
  let body = null;
  try {
    body = await response.json();
  } catch {
    /* non-JSON response body — fall through to the status error */
  }
  if (!response.ok) {
    throw new Error((body && body.error) || `${response.status} ${response.statusText}`);
  }
  return body;
}

function skeleton(count, tall = false) {
  const list = el('div', { class: 'skel-list', 'aria-hidden': 'true' });
  for (let i = 0; i < count; i += 1) {
    list.append(
      el('div', { class: `skel${tall ? ' skel--tall' : ''}${i % 3 === 2 ? ' skel--half' : ''}` }),
    );
  }
  return list;
}

function errorCard(sectionTitle, message, retry) {
  const button = el('button', { class: 'btn btn--primary', type: 'button', text: 'Retry' });
  button.addEventListener('click', retry);
  return el('div', { class: 'state-card state-card--error', role: 'alert' }, [
    el('p', { class: 'state-card__title', text: `Could not load ${sectionTitle}` }),
    el('p', { class: 'state-card__detail', text: message }),
    button,
  ]);
}

function emptyCard(title, detail) {
  return el('div', { class: 'state-card' }, [
    el('p', { class: 'state-card__title', text: title }),
    el('p', { class: 'state-card__detail', text: detail }),
  ]);
}

/* -------------------------------------------------------------------------- */
/* Renderers                                                                  */
/* -------------------------------------------------------------------------- */

function chip(text, kind) {
  return el('span', { class: `chip chip--${kind}`, text });
}

function stat(label, value, sub) {
  return el('div', { class: 'card stat enter' }, [
    el('p', { class: 'stat__label', text: label }),
    el('p', { class: 'stat__value', text: value }),
    sub ? el('p', { class: 'stat__sub', text: sub }) : null,
  ]);
}

function renderOverview(container, data) {
  const subtitle = document.getElementById('overview-sub');
  subtitle.textContent = data.authorization
    ? `Operating under ${data.authorization} · state recorded ${data.stateLastUpdated ?? 'n/a'}.`
    : '';

  const grid = el('div', { class: 'grid-stats' }, [
    stat('Version', `v${data.version}`, data.specVersion ?? undefined),
    stat('Lifecycle', data.lifecycle ? data.lifecycle.state : 'unknown', data.lifecycle?.status),
    stat(
      'Branch',
      data.git.branch,
      data.git.dirtyCount === 0
        ? 'working tree clean'
        : `${data.git.dirtyCount} uncommitted change(s)`,
    ),
    stat(
      'Last commit',
      data.git.commit.subject ?? '—',
      `${data.git.commit.hash ?? ''} · ${timeAgo(data.git.commit.date)} · ${data.git.commit.author ?? ''}`,
    ),
    stat(
      'Built output',
      data.dist.built ? `${data.dist.files} files` : 'not built',
      data.dist.built
        ? `${data.dist.htmlFiles} pages · ${formatBytes(data.dist.totalBytes)}`
        : 'run: npm run build',
    ),
    stat(
      'Site preview',
      data.previewLive ? 'Live' : 'Offline',
      data.previewLive ? data.previewOrigin : 'run: npm run preview',
    ),
  ]);
  replaceChildrenOf(container, grid);
  animateIn(container);
}

function renderGovernance(container, data) {
  const gates = el(
    'div',
    { class: 'grid-gates' },
    data.gates.map((gate) =>
      el('div', { class: 'card gate enter' }, [
        el('div', { class: 'gate__head' }, [
          el('span', { class: 'gate__id', text: gate.gate }),
          chip(gate.granted ? 'Granted' : 'Withheld', gate.granted ? 'ok' : 'warn'),
        ]),
        el('p', { class: 'gate__what', text: gate.authorizes }),
        el('p', { class: 'gate__state', text: gate.state }),
      ]),
    ),
  );

  const items = el(
    'ul',
    { class: 'rows' },
    data.openItems.map((item) =>
      el('li', { class: 'row enter' }, [
        el('span', { class: 'row__badge', text: item.item, 'aria-hidden': 'true' }),
        el('div', { class: 'row__main' }, [
          el('p', { class: 'row__title' }, [
            item.subject,
            chip(
              item.partial ? 'Partially closed' : item.closed ? 'Closed' : 'Open',
              item.partial ? 'warn' : item.closed ? 'ok' : 'danger',
            ),
          ]),
          el('p', { class: 'row__detail', text: `Blocks: ${item.blocks}` }),
        ]),
      ]),
    ),
  );

  replaceChildrenOf(
    container,
    gates,
    el('h3', { class: 'subhead', text: `Open items (${data.openItems.length})` }),
    items,
  );
  animateIn(container);
}

function renderRoutes(container, data) {
  if (data.routes.length === 0) {
    replaceChildrenOf(container, emptyCard('No routes found', 'src/pages/ contains no pages.'));
    return;
  }

  const header = el('tr', {}, [
    el('th', { scope: 'col', text: 'Route' }),
    el('th', { scope: 'col', text: 'Built' }),
    el('th', { scope: 'col', text: 'Indexing' }),
    el('th', { scope: 'col', text: 'Size' }),
    el('th', { scope: 'col', text: 'Title' }),
  ]);

  const rows = data.routes.map((route) => {
    const routeCell = data.previewLive
      ? el('a', {
          class: 'mono',
          href: data.previewOrigin + route.route,
          target: '_blank',
          rel: 'noopener',
          text: route.route,
        })
      : el('span', { class: 'mono', text: route.route });

    const robots =
      route.robots ?? (route.built && !route.distFile.endsWith('.html') ? 'n/a' : null);
    return el('tr', { class: 'enter' }, [
      el('td', { 'data-label': 'Route' }, routeCell),
      el(
        'td',
        { 'data-label': 'Built' },
        route.built ? chip('Built', 'ok') : chip('Missing', 'danger'),
      ),
      el(
        'td',
        { 'data-label': 'Indexing' },
        robots === null
          ? el('span', { text: '—' })
          : robots.includes('noindex')
            ? chip('noindex', 'warn')
            : robots === 'n/a'
              ? el('span', { text: '—' })
              : chip(robots, 'ok'),
      ),
      el('td', { 'data-label': 'Size', class: 'mono', text: formatBytes(route.bytes) }),
      el('td', { 'data-label': 'Title', text: route.title ?? route.sourceFile }),
    ]);
  });

  const table = el('table', { class: 'routes-table' }, [
    el('caption', {
      text: data.previewLive
        ? `Preview server live at ${data.previewOrigin} — route names link to it.`
        : 'Preview server offline (npm run preview) — routes shown from dist/ only.',
    }),
    el('thead', {}, header),
    el('tbody', {}, rows),
  ]);

  replaceChildrenOf(container, el('div', { class: 'routes-card' }, table));
  animateIn(container);
}

function renderTokens(container, data) {
  const colourKeys = Object.keys(data.light).filter((key) => parseHex(data.light[key]));
  // If a theme is missing its bg/fg token, contrastRatio returns null and the
  // ratio is simply not shown — no invented fallback colour.
  const lightBg = data.light['bg'];
  const darkBg = data.dark['bg'];
  const lightFg = data.light['fg'];
  const darkFg = data.dark['fg'];

  const colourRows = colourKeys.map((key) => {
    const lightValue = data.light[key];
    const darkValue = data.dark[key] ?? lightValue;
    // Surfaces are judged against the theme foreground, everything else
    // against the theme background — the pairing the page actually uses.
    const isSurface = key.startsWith('bg') || key === 'accent-fg';
    const lightRatio = contrastRatio(lightValue, isSurface ? lightFg : lightBg);
    const darkRatio = contrastRatio(darkValue, isSurface ? darkFg : darkBg);
    const ratioText = (ratio) => (ratio === null ? '' : `${ratio.toFixed(1)}:1`);
    return el('div', { class: 'card colorrow enter' }, [
      el('div', { class: 'colorrow__swatches' }, [
        el('span', {
          class: 'swatch',
          style: { backgroundColor: lightValue },
          title: `light: ${lightValue}`,
        }),
        el('span', {
          class: 'swatch',
          style: { backgroundColor: darkValue },
          title: `dark: ${darkValue}`,
        }),
      ]),
      el('div', {}, [
        el('p', { class: 'colorrow__name', text: `--${key}` }),
        el('p', { class: 'colorrow__meta' }, [
          el('span', { text: `${lightValue} · ${ratioText(lightRatio)}` }),
          el('span', { text: `${darkValue} · ${ratioText(darkRatio)}` }),
        ]),
      ]),
    ]);
  });

  const typeKeys = Object.keys(data.light).filter((key) => key.startsWith('type-'));
  const typeRows = typeKeys.map((key) =>
    el('div', { class: 'typerow enter' }, [
      el('span', {
        class: 'typerow__specimen',
        style: { fontSize: data.light[key] },
        'aria-hidden': 'true',
        text: 'Ag',
      }),
      el('span', { class: 'typerow__name', text: `--${key}` }),
      el('span', { class: 'typerow__value', text: data.light[key] }),
    ]),
  );

  const spaceKeys = Object.keys(data.light).filter((key) => key.startsWith('space-'));
  const spaceRows = spaceKeys.map((key) =>
    el('div', { class: 'spacerow enter' }, [
      el('span', { class: 'spacerow__name', text: `--${key}` }),
      el('span', {
        class: 'spacerow__bar',
        style: { width: data.light[key] },
        'aria-hidden': 'true',
      }),
      el('span', { class: 'spacerow__value', text: data.light[key] }),
    ]),
  );

  const motionKeys = Object.keys(data.light).filter(
    (key) => key.startsWith('duration-') || key.startsWith('ease'),
  );
  const motionRows = motionKeys.map((key) =>
    el('div', { class: 'motionrow enter' }, [
      el('span', { class: 'motionrow__name', text: `--${key}` }),
      el('span', { class: 'motionrow__value', text: data.light[key] }),
    ]),
  );

  const group = (title, note, child) =>
    el('div', { class: 'tokgroup' }, [
      el('h3', { class: 'subhead', text: title }),
      note ? el('p', { class: 'section__sub', text: note }) : null,
      child,
    ]);

  replaceChildrenOf(
    container,
    group(
      `Colour (${colourRows.length})`,
      'Swatch pairs show the light and dark value; ratios are computed contrast against the theme background.',
      el('div', { class: 'grid-colors' }, colourRows),
    ),
    group(
      `Type scale (${typeRows.length})`,
      'Specimens render at the actual token value.',
      el('div', { class: 'card' }, typeRows),
    ),
    group(`Spacing (${spaceRows.length})`, null, el('div', { class: 'card' }, spaceRows)),
    group(`Motion (${motionRows.length})`, null, el('div', { class: 'card' }, motionRows)),
  );
  animateIn(container);
}

function renderQuality(container, data) {
  const gates = el(
    'div',
    { class: 'grid-quality' },
    data.gateResults.map((gate) =>
      el('div', { class: 'card qgate enter' }, [
        el('div', { class: 'qgate__head' }, [
          el('span', { class: 'qgate__name', text: gate.gate }),
          chip(
            gate.pass ? 'pass' : gate.deferred ? 'in CI' : 'attention',
            gate.pass ? 'ok' : gate.deferred ? 'neutral' : 'warn',
          ),
        ]),
        el('p', { class: 'qgate__detail', text: gate.result }),
      ]),
    ),
  );

  const facts = el(
    'div',
    { class: 'card' },
    data.facts.map((fact) =>
      el('div', { class: 'fact enter' }, [
        el('span', { class: 'fact__prop', text: fact.property }),
        el('span', { class: 'fact__value', text: fact.value }),
        el('span', { class: 'fact__how', text: fact.how }),
      ]),
    ),
  );

  replaceChildrenOf(
    container,
    gates,
    el('h3', { class: 'subhead', text: 'Verified facts about the running system' }),
    facts,
  );
  animateIn(container);
}

function renderActivity(container, data) {
  const subtitle = document.getElementById('activity-sub');
  subtitle.textContent = `Last ${data.commits.length} commits on ${data.branch}.`;

  if (data.commits.length === 0) {
    replaceChildrenOf(container, emptyCard('No commits', 'git log returned nothing.'));
    return;
  }

  const list = el(
    'ol',
    { class: 'card', style: { padding: '0 var(--sp-4)' } },
    data.commits.map((commit) =>
      el('li', { class: 'commit enter' }, [
        el('span', { class: 'commit__hash', text: commit.hash }),
        el('div', { class: 'commit__main' }, [
          el('p', { class: 'commit__subject', text: commit.subject }),
          el('p', { class: 'commit__meta', text: `${commit.author} · ${timeAgo(commit.date)}` }),
        ]),
      ]),
    ),
  );
  replaceChildrenOf(container, list);
  animateIn(container);
}

/* -------------------------------------------------------------------------- */
/* Sections registry + load loop                                              */
/* -------------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'overview-body',
    title: 'overview',
    endpoint: '/api/summary',
    render: renderOverview,
    skel: 6,
  },
  {
    id: 'governance-body',
    title: 'governance',
    endpoint: '/api/governance',
    render: renderGovernance,
    skel: 5,
  },
  { id: 'routes-body', title: 'routes', endpoint: '/api/routes', render: renderRoutes, skel: 6 },
  {
    id: 'tokens-body',
    title: 'design tokens',
    endpoint: '/api/tokens',
    render: renderTokens,
    skel: 8,
  },
  {
    id: 'quality-body',
    title: 'quality',
    endpoint: '/api/quality',
    render: renderQuality,
    skel: 6,
  },
  {
    id: 'activity-body',
    title: 'activity',
    endpoint: '/api/commits',
    render: renderActivity,
    skel: 8,
  },
];

async function loadSection(section) {
  const container = document.getElementById(section.id);
  replaceChildrenOf(container, skeleton(section.skel, section.id === 'overview-body'));
  try {
    const data = await getJson(section.endpoint);
    section.render(container, data);
    return true;
  } catch (error) {
    replaceChildrenOf(
      container,
      errorCard(section.title, error instanceof Error ? error.message : String(error), () =>
        loadSection(section),
      ),
    );
    return false;
  }
}

const conn = document.getElementById('conn');
const connLabel = document.getElementById('conn-label');
const announce = document.getElementById('announce');

async function loadAll() {
  conn.dataset.state = 'loading';
  connLabel.textContent = 'Loading…';
  const results = await Promise.all(SECTIONS.map((section) => loadSection(section)));
  const failed = results.filter((ok) => !ok).length;
  if (failed === 0) {
    conn.dataset.state = 'live';
    connLabel.textContent = 'Live';
    announce.textContent = 'Console data refreshed.';
  } else {
    conn.dataset.state = 'error';
    connLabel.textContent = `${failed} section(s) failed`;
    announce.textContent = `Refresh finished with ${failed} failed section(s).`;
  }
}

/* -------------------------------------------------------------------------- */
/* Theme switching — system / light / dark, persisted, no flash               */
/* -------------------------------------------------------------------------- */

const THEME_ORDER = ['system', 'light', 'dark'];
const themeButton = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const systemDark = matchMedia('(prefers-color-scheme: dark)');

function currentMode() {
  return document.documentElement.dataset.themeMode ?? 'system';
}

function applyTheme(mode) {
  const dark = mode === 'dark' || (mode === 'system' && systemDark.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.themeMode = mode;
  themeLabel.textContent = mode[0].toUpperCase() + mode.slice(1);
  try {
    if (mode === 'system') localStorage.removeItem('hq-theme');
    else localStorage.setItem('hq-theme', mode);
  } catch {
    /* storage unavailable — theme still applies for this page */
  }
}

themeButton.addEventListener('click', () => {
  const next = THEME_ORDER[(THEME_ORDER.indexOf(currentMode()) + 1) % THEME_ORDER.length];
  applyTheme(next);
});
systemDark.addEventListener('change', () => {
  if (currentMode() === 'system') applyTheme('system');
});
applyTheme(currentMode());

/* -------------------------------------------------------------------------- */
/* Section nav highlight                                                      */
/* -------------------------------------------------------------------------- */

const navLinks = [...document.querySelectorAll('.sectionnav__link')];
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = `#${entry.target.id}`;
      for (const link of navLinks) {
        if (link.getAttribute('href') === id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    }
  },
  { rootMargin: '-30% 0px -60% 0px' },
);
document.querySelectorAll('main .section').forEach((section) => observer.observe(section));

/* -------------------------------------------------------------------------- */
/* Boot                                                                       */
/* -------------------------------------------------------------------------- */

document.getElementById('refresh').addEventListener('click', () => {
  loadAll();
});
loadAll();

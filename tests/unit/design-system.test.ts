import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import Button from '../../src/components/ui/Button.astro';
import Callout from '../../src/components/ui/Callout.astro';
import Container from '../../src/components/ui/Container.astro';
import Divider from '../../src/components/ui/Divider.astro';
import Footer from '../../src/components/ui/Footer.astro';
import Hero from '../../src/components/ui/Hero.astro';
import Link from '../../src/components/ui/Link.astro';
import Logo from '../../src/components/ui/Logo.astro';
import Navigation from '../../src/components/ui/Navigation.astro';
import Section from '../../src/components/ui/Section.astro';
import Stack from '../../src/components/ui/Stack.astro';
import { COMPONENT_NAMES, REMOVED_BY_P1J_CLEANUP } from '../../src/components/ui';

/**
 * The design system is tested by rendering each component in-process through
 * Astro's Container API.
 *
 * That is deliberate rather than merely convenient: P1-I prohibits a component
 * showcase page, so there is no route to point a browser at. Rendering to HTML
 * here gives full coverage without publishing anything.
 */

const SRC_DIR = resolve(process.cwd(), 'src');
const UI_DIR = join(SRC_DIR, 'components', 'ui');

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

type RenderOptions = Parameters<AstroContainer['renderToString']>[1];
type ComponentFactory = Parameters<AstroContainer['renderToString']>[0];

/**
 * Renders a component to an HTML string.
 *
 * The cast is the one concession to `tsc` running without the Astro language
 * tooling: the ambient `*.astro` declaration in `src/astro-modules.d.ts` cannot
 * name Astro's internal factory type, so imported components arrive loosely
 * typed. Confining the cast here keeps it to a single line instead of one at
 * every call site, and prop types are still checked where they matter — in
 * `.astro` files, by `astro check`.
 */
async function render(Component: unknown, options: RenderOptions = {}): Promise<string> {
  return container.renderToString(Component as ComponentFactory, options);
}

function walkFiles(dir: string, extensions: string[]): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walkFiles(full, extensions);
    return extensions.some((ext) => full.endsWith(ext)) ? [full] : [];
  });
}

/* -------------------------------------------------------------------------- */
/* Catalog integrity                                                          */
/* -------------------------------------------------------------------------- */

describe('catalog', () => {
  it('exports exactly the components that exist on disk', () => {
    const onDisk = readdirSync(UI_DIR)
      .filter((f) => f.endsWith('.astro'))
      .map((f) => f.replace('.astro', ''))
      .sort();

    expect(onDisk).toEqual([...COMPONENT_NAMES].sort());
  });

  it('documents every component in the catalog', () => {
    // A component that ships undocumented is a component nobody can use safely.
    const catalog = readFileSync(
      resolve(process.cwd(), 'docs/design-system/components.md'),
      'utf8',
    );

    const undocumented = COMPONENT_NAMES.filter(
      (name) => !new RegExp(`^#{2,3} \`?${name}\`?`, 'm').test(catalog),
    );

    expect(undocumented).toEqual([]);
  });

  it('gives every component a usage rule', () => {
    const rules = readFileSync(resolve(process.cwd(), 'docs/design-system/usage-rules.md'), 'utf8');
    const missing = COMPONENT_NAMES.filter((name) => !rules.includes(name));
    expect(missing).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */
/* Zero JavaScript                                                            */
/* -------------------------------------------------------------------------- */

describe('zero JavaScript', () => {
  it('ships no <script> in any design-system component source', () => {
    // `08` ARCH-06 and the P1-I constraint "add JavaScript unless essential".
    // None of these components needs a client runtime; a <script> appearing
    // here is the signal that one crept in.
    const offenders = walkFiles(UI_DIR, ['.astro'])
      .filter((file) => /<script[\s>]/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(UI_DIR, file));

    expect(offenders).toEqual([]);
  });

  it('renders no <script> tag from any component', async () => {
    const outputs = await Promise.all([
      render(Button, { slots: { default: 'Go' } }),
      render(Link, { props: { href: '/x' }, slots: { default: 'x' } }),
      render(Callout, { slots: { default: 'x' } }),
      render(Divider),
      render(Logo),
      render(Container, { slots: { default: 'x' } }),
      render(Stack, { slots: { default: 'x' } }),
      render(Section, { slots: { default: 'x' } }),
      render(Footer, { slots: { default: 'x' } }),
      render(Hero, { slots: { heading: '<h1>x</h1>' } }),
      render(Navigation, { props: { label: 'Main', items: [{ href: '/a', label: 'A' }] } }),
    ]);

    for (const html of outputs) {
      expect(html).not.toMatch(/<script/i);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

describe('Button', () => {
  it('renders a real <button> by default, with an explicit type', async () => {
    const html = await render(Button, { slots: { default: 'Register interest' } });
    expect(html).toMatch(/<button[^>]*class="[^"]*button/);
    expect(html).toMatch(/type="button"/);
    expect(html).toContain('Register interest');
  });

  it('renders an <a> when asked, and keeps its native link role', async () => {
    // `07` §6.5 — the hero CTA is a link styled as a button. Describing it as a
    // button in the accessibility tree would misdescribe where it goes.
    const html = await render(Button, {
      props: { as: 'a', href: '#interest' },
      slots: { default: 'Register interest' },
    });

    expect(html).toMatch(/<a[^>]*href="#interest"/);
    expect(html).not.toMatch(/role="button"/);
    // A link must never carry a button's `type`.
    expect(html).not.toMatch(/<a[^>]*\stype=/);
  });

  it('never emits href on a <button> or type on an <a>', async () => {
    const asButton = await render(Button, {
      props: { href: '/should-be-ignored' },
      slots: { default: 'x' },
    });
    expect(asButton).not.toContain('/should-be-ignored');
  });

  it('uses aria-disabled rather than the disabled attribute', async () => {
    // `07` §6.5 — "`aria-disabled` where the control must stay focusable".
    // A `disabled` attribute removes the control from the tab order entirely.
    const html = await render(Button, { props: { disabled: true }, slots: { default: 'x' } });
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toMatch(/\sdisabled(?![-\w])/);
  });

  it('supports an accessible name that supplements the visible label', async () => {
    const html = await render(Button, {
      props: { as: 'a', href: '#interest', 'aria-label': 'Register interest in AI Workspace' },
      slots: { default: 'Register interest' },
    });
    expect(html).toContain('aria-label="Register interest in AI Workspace"');
  });
});

/* -------------------------------------------------------------------------- */
/* Link                                                                       */
/* -------------------------------------------------------------------------- */

describe('Link', () => {
  it('renders an anchor with the given href', async () => {
    const html = await render(Link, { props: { href: '/privacy' }, slots: { default: 'Privacy' } });
    expect(html).toMatch(/<a[^>]*href="\/privacy"/);
    expect(html).toContain('Privacy');
  });

  it('adds rel but never target for an external destination', async () => {
    // Opening a new window unannounced is a WCAG 3.2.5 problem, and no approved
    // copy warns the reader it will happen.
    const html = await render(Link, {
      props: { href: 'https://example.com', external: true },
      slots: { default: 'x' },
    });
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('target=');
  });

  it('emits no whitespace inside the anchor', async () => {
    // An inline link with padding whitespace renders as "register interest ."
    // — a space before the punctuation, underlined. It reached /contact once.
    const html = await render(Link, {
      props: { href: '/x' },
      slots: { default: 'register interest' },
    });

    expect(html).toContain('>register interest</a>');
    expect(html).not.toMatch(/>\s+register interest/);
    expect(html).not.toMatch(/register interest\s+<\/a>/);
  });

  it('never emits a title attribute', async () => {
    // `08` HTML-07 — `title` must not be used to convey information.
    const html = await render(Link, { props: { href: '/x' }, slots: { default: 'x' } });
    expect(html).not.toMatch(/\stitle=/);
  });
});

/* -------------------------------------------------------------------------- */
/* Logo                                                                       */
/* -------------------------------------------------------------------------- */

describe('Logo', () => {
  it('renders the approved wordmark as plain text, not a link', async () => {
    // `03` §3 Block 1 — not a link at P0, and never an anchor to `#`.
    const html = await render(Logo);
    expect(html).toContain('AI Workspace');
    expect(html).toMatch(/<p[^>]*class="[^"]*wordmark/);
    expect(html).not.toMatch(/<a[^>]/);
  });

  it('takes no text prop — the wordmark comes from the copy module', async () => {
    // P1-A §7.1: no content authority. A caller must not be able to pass a
    // different string, so passing one must have no effect.
    const html = await render(Logo, { props: { text: 'Something Else' } as never });
    expect(html).toContain('AI Workspace');
    expect(html).not.toContain('Something Else');
  });

  it('contains no brand mark, monogram, or symbol', async () => {
    // P-15 — no logo, wordmark asset, or ™/® while IP ownership is unevidenced.
    const html = await render(Logo);
    expect(html).not.toMatch(/<svg/i);
    expect(html).not.toMatch(/<img/i);
    expect(html).not.toMatch(/[™®©]/);
  });

  it('becomes a link only when given a destination', async () => {
    const html = await render(Logo, { props: { href: '/' } });
    expect(html).toMatch(/<a[^>]*href="\/"/);
  });
});

/* -------------------------------------------------------------------------- */
/* Section, Container, Stack, Grid                                            */
/* -------------------------------------------------------------------------- */

describe('layout primitives', () => {
  it('Section is labelled by its heading when given one', async () => {
    // `03` §2 — a <section> becomes a landmark only with an accessible name.
    const html = await render(Section, {
      props: { headingId: 'principles-heading' },
      slots: { default: '<h2 id="principles-heading">x</h2>' },
    });
    expect(html).toContain('aria-labelledby="principles-heading"');
  });

  it('Section omits aria-labelledby when it has no heading', async () => {
    const html = await render(Section, { slots: { default: 'x' } });
    expect(html).not.toContain('aria-labelledby');
  });

  it('Container renders a div by default and can change element', async () => {
    const asDiv = await render(Container, { slots: { default: 'x' } });
    expect(asDiv).toMatch(/<div[^>]*class="[^"]*container/);

    const asHeader = await render(Container, { props: { as: 'header' }, slots: { default: 'x' } });
    expect(asHeader).toMatch(/<header[^>]*class="[^"]*container/);
  });

  it('Stack sets its gap from the canonical spacing scale', async () => {
    const html = await render(Stack, { props: { gap: 6 }, slots: { default: 'x' } });
    expect(html).toContain('--stack-gap: var(--space-6)');
  });
});

/* -------------------------------------------------------------------------- */
/* Callout, Card, Divider                                                     */
/* -------------------------------------------------------------------------- */

describe('surfaces', () => {
  it('Callout is never an alert', async () => {
    // `07` §6.9 reserves role="alert" for the error summary. A Callout that
    // interrupted the screen reader would be a different component.
    const html = await render(Callout, {
      props: { tone: 'danger' },
      slots: { default: 'x' },
    });
    expect(html).not.toContain('role="alert"');
    expect(html).not.toContain('aria-live');
  });

  it('Callout defaults to the neutral stage-disclosure tone', async () => {
    const html = await render(Callout, { slots: { default: 'x' } });
    expect(html).toMatch(/class="[^"]*callout--neutral/);
  });

  it('Divider can be hidden from assistive technology', async () => {
    const meaningful = await render(Divider);
    expect(meaningful).not.toContain('aria-hidden');

    const decorative = await render(Divider, { props: { decorative: true } });
    expect(decorative).toContain('aria-hidden="true"');
  });
});

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

describe('Navigation', () => {
  const items = [
    { href: '/a', label: 'A' },
    { href: '/b', label: 'B' },
  ];

  it('is a named landmark containing a list', async () => {
    const html = await render(Navigation, { props: { label: 'Main', items } });
    expect(html).toMatch(/<nav[^>]*aria-label="Main"/);
    expect(html).toMatch(/<ul/);
    expect((html.match(/<li/g) ?? []).length).toBe(2);
  });

  it('marks the current page with aria-current, not colour alone', async () => {
    const html = await render(Navigation, { props: { label: 'Main', items, current: '/b' } });
    expect((html.match(/aria-current="page"/g) ?? []).length).toBe(1);
    expect(html).toMatch(/href="\/b"[^>]*aria-current="page"/);
  });

  it('renders no menu, toggle, or expandable region', async () => {
    // `07` §7 — no modals, no menus, no carousels, no keyboard traps.
    const html = await render(Navigation, { props: { label: 'Main', items } });
    expect(html).not.toContain('aria-expanded');
    expect(html).not.toContain('role="menu"');
    expect(html).not.toContain('<button');
  });
});

/* -------------------------------------------------------------------------- */
/* P1-J §0 cleanup — the removed components must stay removed                 */
/* -------------------------------------------------------------------------- */

describe('P1-J cleanup', () => {
  it('has no file on disk for any removed component', () => {
    // CL-1 and CL-4: removal, not un-exporting. A build that imports one of
    // these must FAIL rather than silently fall back.
    const onDisk = readdirSync(UI_DIR).filter((f) => f.endsWith('.astro'));

    for (const name of REMOVED_BY_P1J_CLEANUP) {
      expect(onDisk, `${name}.astro is back on disk`).not.toContain(`${name}.astro`);
    }
  });

  it('renders no removed component from any page, layout, or component', () => {
    const consumers = [
      ...walkFiles(join(SRC_DIR, 'pages'), ['.astro']),
      ...walkFiles(join(SRC_DIR, 'layouts'), ['.astro']),
      ...readdirSync(join(SRC_DIR, 'components'))
        .filter((f) => f.endsWith('.astro'))
        .map((f) => join(SRC_DIR, 'components', f)),
    ];

    const violations: string[] = [];

    for (const file of consumers) {
      const source = readFileSync(file, 'utf8');
      // Strip comments: the components are named in explanatory prose.
      const code = source
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/^[ \t]*\/\/.*$/gm, ' ');

      for (const name of REMOVED_BY_P1J_CLEANUP) {
        if (new RegExp(`<${name}[\\s/>]`).test(code)) {
          violations.push(`${relative(SRC_DIR, file)} renders <${name}>`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('exports no elevation token, in CSS or in TypeScript', () => {
    // CL-2. P1-J §0: "Phase 1 pages use borders and background tokens for
    // separation, never shadow." P0 `07` defines no elevation scale at all.
    const tokensTs = readFileSync(resolve(process.cwd(), 'src/lib/tokens.ts'), 'utf8');
    const tokensCss = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

    expect(tokensTs).not.toMatch(/ELEVATION/);
    expect(tokensCss).not.toMatch(/--elevation/);
  });

  it('uses no box-shadow for separation in any component', () => {
    // The focus ring's inner ring on Button is the one permitted shadow, and it
    // is an accessibility indicator (`07` §6.5), not decoration.
    const offenders = readdirSync(UI_DIR)
      .filter((f) => f.endsWith('.astro'))
      .filter((f) => f !== 'Button.astro')
      .filter((f) => /box-shadow:\s*(?!none)/.test(readFileSync(join(UI_DIR, f), 'utf8')))
      .map((f) => f);

    expect(offenders).toEqual([]);
  });

  it('keeps every exported component real', () => {
    const onDisk = readdirSync(UI_DIR)
      .filter((f) => f.endsWith('.astro'))
      .map((f) => f.replace('.astro', ''))
      .sort();

    expect(onDisk).toEqual([...COMPONENT_NAMES].sort());
  });
});

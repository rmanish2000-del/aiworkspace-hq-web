/**
 * Ambient declaration for `.astro` imports.
 *
 * `tsc --noEmit` is one of the merge gates (`08` §14) and it runs without the
 * Astro language tooling, so it cannot resolve a `.astro` module on its own.
 * The unit tests import components directly in order to render them through the
 * Container API — which is how the design system is tested without a component
 * showcase page, as P1-I requires.
 *
 * The factory is typed loosely on purpose. Astro's real component type is
 * internal, and a hand-written approximation would be a second source of truth
 * that drifts. Prop types are checked where they matter — in `.astro` files, by
 * `astro check`, against each component's exported `Props` interface.
 */
declare module '*.astro' {
  const Component: (props: Record<string, unknown>) => unknown;
  export default Component;
}

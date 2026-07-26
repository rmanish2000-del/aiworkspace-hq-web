// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',

      // Guards for the standing prohibitions in AWHQ-AUT-P1F §8.
      // These are blunt instruments on purpose: they fail loudly rather than
      // letting an out-of-scope capability arrive quietly.
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'P-07 — no persistent storage in this scope.' },
        { name: 'sessionStorage', message: 'P-07 — no persistent storage in this scope.' },
        { name: 'fetch', message: 'MF-1 — no network call in this scope.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[property.name='cookie'][object.name='document']",
          message: 'C-13 is a binding public commitment: this site sets no cookie.',
        },
        {
          selector: "MemberExpression[property.name='innerHTML']",
          message: 'P0 `08` SEC-06 — no innerHTML.',
        },
      ],
    },
  },

  {
    files: ['tests/**/*.ts'],
    rules: {
      // Tests legitimately drive a browser and read pages.
      'no-restricted-globals': 'off',
      'no-console': 'off',
    },
  },

  {
    files: ['**/*.config.{js,mjs,ts}', 'scripts/**/*.{js,mjs}'],
    rules: {
      'no-console': 'off',
      /**
       * `no-restricted-globals` bans `fetch` because the PAGE must make no
       * network call (MF-1, and the zero-third-party-request budget in
       * `08` §8). Operator tooling is the opposite case: `check-headers.mjs`
       * exists precisely to query a deployment, and `08` §14 makes that check
       * a gate. Storage and cookies stay banned here — nothing under
       * `scripts/` has any business touching them.
       */
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'P-07 — no persistent storage in this scope.' },
        { name: 'sessionStorage', message: 'P-07 — no persistent storage in this scope.' },
      ],
    },
  },
);

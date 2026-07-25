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
    rules: { 'no-console': 'off' },
  },
);

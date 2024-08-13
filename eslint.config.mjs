import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    ignores: ['src/templates/**'],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
];

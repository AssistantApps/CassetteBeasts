import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  jsxA11y.flatConfigs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    ignores: ['src/templates/**'],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/alt-text': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
];

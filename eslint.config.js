import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      // Single-word names (Menu, Notifications) are registered/used across the
      // app; renaming them only to satisfy the rule isn't worth the churn
      'vue/multi-word-component-names': 'off',
    },
  },

  // Last: turns off the formatting rules that Prettier owns
  prettier,
];

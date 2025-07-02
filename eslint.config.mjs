import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  stylistic.configs.customize({
    braceStyle: '1tbs',
    semi: true,
  }),
  {
    ignores: ['./dist'],
  },
  {
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'error',
      'import/no-unresolved': ['error', { ignore: ['typescript-eslint', 'stremio-addon-sdk'] }],
      'import/order': ['error', { 'alphabetize': { order: 'asc', caseInsensitive: true }, 'named': { enabled: true }, 'newlines-between': 'never' }],
    },
  },
);

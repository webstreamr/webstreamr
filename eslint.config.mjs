import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  stylistic.configs.customize({
    braceStyle: '1tbs',
    semi: true,
  }),
  {
    ignores: ['./dist'],
  },
);

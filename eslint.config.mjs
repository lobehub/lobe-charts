import { defineConfig } from '@lobehub/lint';
import { restrictedImports } from '@lobehub/ui/eslint';

export default defineConfig(
  {
    ignores: [
      '**/node_modules',
      '**/coverage',
      '**/.coverage',
      '**/jest*',
      '**/_test_',
      '**/__test__',
      '**/dist',
      '**/es',
      '**/lib',
      '**/logs',
      '.react-router',
    ],
    react: true,
  },
  restrictedImports,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    rules: {
      'unicorn/no-anonymous-default-export': 'off',
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);

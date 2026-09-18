import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

import { name } from './package.json';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      [name]: path.resolve(root, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});

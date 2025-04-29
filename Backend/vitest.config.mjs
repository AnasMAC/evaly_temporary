// vitest.config.mjs
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.test.js',
      'tests/**/*.spec.js',
      '__tests__/**/*.test.js',
      '__tests__/**/*.spec.js',
    ],
    exclude: ['node_modules', 'dist'],
  },
});

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
    
    // Ajout de l'option sequence
    sequence: {
      enabled: true, // Exécute les fichiers de test les uns après les autres
    },
  },
});

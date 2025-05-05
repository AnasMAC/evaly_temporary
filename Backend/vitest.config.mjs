import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,           // permet d'utiliser describe/it sans import
    environment: 'node',     // environnement node (pas navigateur)
    include: [
      'tests/**/*.test.js',
      'tests/**/*.spec.js',
      '__tests__/**/*.test.js',
      '__tests__/**/*.spec.js',
    ],
    exclude: ['node_modules', 'dist'],

    // 🛠️ Configuration pour exécution sérieuse
    threads: false,          // ❌ désactive les threads (pas de tests en parallèle)
    isolate: true,           // ✅ chaque fichier est isolé dans son propre environnement

    sequence: {
      hooks: 'stack',        // ✅ exécute les hooks (beforeAll/afterAll) dans le bon ordre
      shuffle: false         // ✅ garde l’ordre naturel des fichiers (pas aléatoire)
    },

    testTimeout: 10000       // ⏱️ (optionnel) évite les erreurs si un test prend du temps
  },
});

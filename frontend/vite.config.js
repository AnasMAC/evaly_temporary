import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias pour le dossier src
    },
  },
  test: {
    environment: 'jsdom', // Utiliser jsdom pour simuler le DOM dans les tests
    globals: true,         // Permet d'utiliser `expect` sans l'importer dans les tests
    transformMode: {
      web: [/\.vue$/],     // Transformation des fichiers .vue
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
   server: {
    proxy: {
    '/api': 'http://localhost:3000',
     },
   },
})

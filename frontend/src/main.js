import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

// Create the app instance
import { useAuthStore } from '@/stores/authStore';

const app = createApp(App);

// Créer l'instance Pinia
const pinia = createPinia();
app.use(pinia);

// Vérifier l'authentification au démarrage de l'application
const authStore = useAuthStore();
authStore.checkAuth();  

// Initialize router
app.use(router)

// Mount the app
app.mount('#app')

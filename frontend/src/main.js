import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

// Create the app instance
const app = createApp(App)

// Initialize Pinia
const pinia = createPinia()
app.use(pinia)

// Initialize router
app.use(router)

// Mount the app
app.mount('#app')

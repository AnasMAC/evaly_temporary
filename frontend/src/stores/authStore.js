import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    // Obtenir l'utilisateur actuel
    currentUser: (state) => state.user,
    
    // Vérifier si l'utilisateur est authentifié
    isLoggedIn: (state) => state.isAuthenticated,
    
    // Obtenir l'erreur d'authentification
    authError: (state) => state.error
  },

  actions: {
    // Fonction de connexion
    async login(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          pwd: password
        });
        
        // Le backend stocke les tokens dans des cookies HttpOnly
        // Nous n'avons donc pas besoin de les gérer manuellement
        this.isAuthenticated = true;
        
        // Stocker un indicateur d'authentification dans le localStorage
        localStorage.setItem('isAuthenticated', 'true');
        
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.msg || 'Erreur de connexion';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    // Fonction de déconnexion
    async logout() {
      try {
        // Appel à l'API pour supprimer les cookies côté serveur
        await axios.post('http://localhost:3000/auth/logout');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        // Nettoyage côté client
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('isAuthenticated');
      }
    },
    
    // Vérifier si l'utilisateur est déjà connecté (au chargement de l'application)
    checkAuth() {
      // Vérifie si l'utilisateur a un indicateur d'authentification
      const isAuth = localStorage.getItem('isAuthenticated');
      
      if (isAuth === 'true') {
        this.isAuthenticated = true;
        // On pourrait faire une requête API pour récupérer les informations de l'utilisateur
        // si nécessaire
      }
    }
  }
}); 
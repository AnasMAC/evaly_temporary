// stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,  // Indicateur d'authentification
    cin: null,               // Stockage de l'ID utilisateur (cin)
    role: null,              // Stockage du rôle utilisateur
         
  }),

  actions: {
    // Action pour stocker l'utilisateur après la connexion
    async setUser(userData) {
      this.isAuthenticated = true;
      this.cin = userData.cin;
      this.role = userData.role;
     
      
      // Stocker les informations dans le localStorage (ou sessionStorage si nécessaire)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userCin', userData.cin); // Stocker le CIN
      localStorage.setItem('userRole', userData.role); // Stocker le rôle
    // Stocker le token
    },

    // Action pour se déconnecter
    async logout() {
      try {
        // Appel à l'API pour supprimer le cookie d'authentification côté serveur
        await axios.post('http://localhost:3000/auth/logout');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        // Nettoyage côté client
        this.isAuthenticated = false;
        this.cin = null;
        this.role = null;
        
        
        // Effacer les données stockées dans localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userCin');
        localStorage.removeItem('userRole');
        
      }
    },

    // Vérifier si l'utilisateur est déjà connecté (au chargement de l'application)
    checkAuth() {
      // Vérifie si l'utilisateur est authentifié
       const isAuth = localStorage.getItem('isAuthenticated');
      
      if (isAuth === 'true') {
        this.isAuthenticated = true; // fontion pour eviter la redirection dans login avec refreshement de la page 
        
        // Récupérer les informations stockées dans localStorage
        const storedCin = localStorage.getItem('userCin');
        const storedRole = localStorage.getItem('userRole');
      

        if (storedCin && storedRole ) {
          this.cin = storedCin;
          this.role = storedRole;
        }
      } 
    }
  } 
});

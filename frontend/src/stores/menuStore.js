import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    adminRoutes: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'fas fa-home',
      },
      {
        name: 'Étudiants',
        path: '/students',
        icon: 'fas fa-user-graduate',
      },
      {
        name: 'Enseignants',
        path: '/teachers',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        name: 'Professionnels',
        path: '/professionals',
        icon: 'fas fa-briefcase',
      },
      {
        name: 'Compétences',
        path: '/creercompetence',
        icon: 'fas fa-lightbulb',
      },
      {
        name: 'Cadres',
        path: '/cadres',
        icon: 'fas fa-project-diagram',
      },
      {
        name: 'Signalement',
        path: '/signalement',
        icon: 'fas fa-exclamation-circle',
      },
      {
        name: 'Mon profil',
        path: '/profile',
        icon: 'fas fa-user-circle',
      },
      {
        name: 'Déconnexion',
        path: '/logout',
        icon: 'fas fa-sign-out-alt',
      }
    ],
    currentUser: null,
    isAuthenticated: false
  }),

  getters: {
    // Obtenir les routes accessibles en fonction du rôle de l'utilisateur
    // Pour l'instant, on retourne toutes les routes admin
    accessibleRoutes: (state) => {
      return state.adminRoutes;
    },
    
    // Route active
    activeRoute: (state) => {
      const path = window.location.pathname;
      return state.adminRoutes.find(route => route.path === path) || state.adminRoutes[0];
    }
  },

  actions: {
    // Actions pour mettre à jour l'état
    setCurrentUser(user) {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    },
    
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
    }
  }
});
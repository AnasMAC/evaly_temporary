import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    adminRoutes: [
      {
        name: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'fas fa-home',
      },
      {
        name: 'Étudiants',
        path: '/admin/students',
        icon: 'fas fa-user-graduate',
      },
      {
        name: 'Enseignants',
        path: '/admin/teachers',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        name: 'Professionnels',
        path: '/admin/professionals',
        icon: 'fas fa-briefcase',
      },
      {
        name: 'Compétences',
        path: '/admin/create-competence',
        icon: 'fas fa-lightbulb',
      },
      {
        name: 'Cadres',
        path: '/admin/cadres',
        icon: 'fas fa-project-diagram',
      },
      {
        name: 'Signalement',
        path: '/admin/signalement',
        icon: 'fas fa-exclamation-circle',
      },
      {
        name: 'Mon profil',
        path: '/admin/profile',
        icon: 'fas fa-user-circle',
      },
      {
        name: 'Déconnexion',
        path: '/admin/logout',
        icon: 'fas fa-sign-out-alt',
      }
    ],
    accessibleRoutes: [],  // accessibleRoutes est maintenant dans l'état
    currentUser: null,
    isAuthenticated: false
  }),

  getters: {
    // Route active
    activeRoute: (state) => {
      const path = window.location.pathname;
      return state.accessibleRoutes.find(route => route.path === path) || state.accessibleRoutes[0];
    }
  },

  actions: {
    // Action pour définir l'utilisateur courant et mettre à jour les routes accessibles
    setCurrentUser(user) {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      if (user) {
        this.setLinksByRole(user.role); // Mettre à jour les routes en fonction du rôle
      }
    },

    // Action pour mettre à jour les routes accessibles en fonction du rôle
    setLinksByRole(role) {
      if (role === 'administrateur') {
        this.accessibleRoutes = this.adminRoutes;
      } else if (role === 'enseignant') {
        this.accessibleRoutes = [
          { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-home' },
          { name: 'Students', path: '/admin/students', icon: 'fas fa-user-graduate' },
          { name: 'Profile', path: '/admin/profile', icon: 'fas fa-user-circle' },
          { name: 'Logout', path: '/admin/logout', icon: 'fas fa-sign-out-alt' },
        ];
      } else if (role === 'etudiant') {
        this.accessibleRoutes = [
          { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-home' },
          { name: 'Challenges', path: '/admin/challenges', icon: 'fas fa-trophy' },
          { name: 'Profile', path: '/admin/profile', icon: 'fas fa-user-circle' },
          { name: 'Logout', path: '/admin/logout', icon: 'fas fa-sign-out-alt' },
        ];
      } else if (role === 'tuteur') {
        this.accessibleRoutes = [
          { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-home' },
          { name: 'Stagiaires', path: '/admin/stagiaires', icon: 'fas fa-users' },
          { name: 'Profile', path: '/admin/profile', icon: 'fas fa-user-circle' },
          { name: 'Logout', path: '/admin/logout', icon: 'fas fa-sign-out-alt' },
        ];
      } else {
        this.accessibleRoutes = [];
      }
    },

    // Action pour la déconnexion
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.accessibleRoutes = []; // Effacer les routes lors de la déconnexion
    }
  }
});

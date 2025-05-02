import { createRouter, createWebHistory } from 'vue-router'
import { useMenuStore } from '../stores/menuStore'
import { useAuthStore } from '../stores/authStore' // Assurez-vous d'avoir ce store pour l'authentification
// User CRUD views
import StudentsView from '../views/user_crud/StudentsView.vue'
import TeachersView from '../views/user_crud/TeachersView.vue'
import ProfessionalsView from '../views/user_crud/ProfessionalsView.vue'
import ProfileView from '../views/user_crud/ProfileView.vue'
import CompetencesView from '../views/user_crud/CompetencesView.vue'
// Cadre CRUD views
import ajouteretudiant from '../views/cadre_crud/ajouteretudiant.vue'
import ajoutercompetence from '../views/cadre_crud/ajoutercompetence.vue'
import creercompetence from '../views/cadre_crud/creercompetence.vue'
import gestioncadres from '../views/cadre_crud/gestioncadres.vue'
// Auth
import AuthContainer from '../components/auth/AuthContainer.vue'
import MainLayout from '../components/layout/MainLayout.vue'

// Dashboard placeholder
const Dashboard = {
  template: '<div>Tableau de bord (à implémenter)</div>'
}
// Signalement placeholder
const Signalement = {
  template: '<div>Page de signalement (à implémenter)</div>'
}

// Ajouter une fonction pour vérifier l'authentification
const isAuthenticated = () => {
  const authStore = useAuthStore();
  return authStore.isAuthenticated;
};

// Ajouter une route pour la page de connexion
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: AuthContainer,
  },
  {
    path: '/',
    redirect: '/login',
  },
  { path: '/:pathMatch(.*)*', 
    redirect: '/login'
 },
  {
    path: '/admin',
    name: 'Admin',
    component: MainLayout,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/login');
      }
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'students',
        name: 'Students',
        component: StudentsView,
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: TeachersView,
      },
      {
        path: 'professionals',
        name: 'Professionals',
        component: ProfessionalsView,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
      },
      {
        path: '/add-student/:id',
        name: 'AddStudent',
        component: ajouteretudiant,
      },
      {
        path: '/add-competence/:id',
        name: 'AddCompetence',
        component: ajoutercompetence,
      },
      {
        path: 'create-competence',
        name: 'CreateCompetence',
        component: creercompetence,
      },
      {
        path: 'cadres',
        name: 'Cadres',
        component: gestioncadres,
      },
      {
        path: 'signalement',
        name: 'Signalement',
        component: Signalement,
      },
      {
        path: '/admin/logout',
        name: 'Logout',
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore()
          authStore.logout()           // vide le localStorage + cookies
            .then(() => next('/login')) // puis redirige
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
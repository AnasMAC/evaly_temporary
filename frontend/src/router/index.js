import { createRouter, createWebHistory } from 'vue-router'
import { useMenuStore } from '../stores/menuStore'
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

// Dashboard placeholder
const Dashboard = {
  template: '<div>Tableau de bord (à implémenter)</div>'
}
// Signalement placeholder
const Signalement = {
  template: '<div>Page de signalement (à implémenter)</div>'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/dashboard', name: 'dashboard', component: Dashboard },
    { path: '/students', name: 'students', component: StudentsView },
    { path: '/teachers', name: 'teachers', component: TeachersView },
    { path: '/professionals', name: 'professionals', component: ProfessionalsView },
    { path: '/cadres', name: 'GestionCadres', component: gestioncadres },
    { path: '/signalement', name: 'signalement', component: Signalement },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/ajouteretudiant/:id', name: 'ajouteretudiant', component: ajouteretudiant },
    { path: '/creercompetence', name: 'creercompetence', component: creercompetence },
    { path: '/ajoutercompetence/:id', name: 'ajoutercompetence', component: ajoutercompetence },
    {path: '/logout', name: 'logout',
      beforeEnter: (to, from, next) => {
        const menuStore = useMenuStore();
        menuStore.logout();
        alert('Déconnexion...');
        next('/login');
      }
    }
  ]
})

export default router
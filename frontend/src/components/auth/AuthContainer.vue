<template>
  <div class="grid grid-cols-[55%_45%] h-screen font-sans relative overflow-hidden animate-slide-whole-page">
    <img
      :src="logo"
      alt="Evaly Logo"
      class="absolute top-0.5 left-4 w-32 h-auto z-50"
    />
    <div class="bg-gray-100 flex flex-col justify-center items-center p-8">
      <img
        :src="illustration"
        alt="Illustration"
        class="w-full max-w-[660px] mt-2 -ml-12"
      />
    </div>
    <div
      class="bg-[#2f4db5] shadow-[-12px_0_32px_-2px_rgba(0,0,0,0.3)] text-white flex flex-col h-full animate-fade-in-right"
    >
      <div class="flex-1 flex flex-col justify-center items-center px-8 relative">
        <div class="w-full max-w-md absolute top-16">
          <h1 class="text-4xl font-bold mb-2 text-center">Bienvenue !</h1>
          <p class="text-center text-gray-200 text-lg">
            Votre espace Evaly vous attend
          </p>
        </div>
        
        <div class="w-full max-w-md mt-44">
          <!-- Formulaire de connexion -->
          <LoginForm 
            v-if="currentView === 'login'" 
            @handleLoginSuccess="handleLoginSuccess" 
            @forgot-password="currentView = 'forgotPassword'" 
          />
          
          <!-- Formulaire de mot de passe oublié -->
          <ForgotPasswordForm 
            v-if="currentView === 'forgotPassword'" 
            @back-to-login="currentView = 'login'" 
            @code-sent="handleCodeSent" 
          />
          
          <!-- Formulaire de vérification du code -->
          <VerifyCodeForm 
            v-if="currentView === 'verifyCode'" 
            :email="resetEmail" 
            @back="currentView = 'forgotPassword'" 
            @code-verified="handleCodeVerified" 
          />
          
          <!-- Formulaire de réinitialisation du mot de passe -->
          <ResetPasswordForm 
            v-if="currentView === 'resetPassword'" 
            :email="resetEmail" 
            :code="verificationCode" 
            @back="currentView = 'verifyCode'" 
            @reset-success="currentView = 'resetSuccess'" 
          />
          
          <!-- Message de succès de réinitialisation -->
          <ResetSuccessMessage 
            v-if="currentView === 'resetSuccess'" 
            @back-to-login="currentView = 'login'" 
          />
        </div>
      </div>
      
      <div class="flex justify-between text-xs text-white opacity-70 px-6 mb-4">
        <span>Terms of use</span>
        <span>Privacy Policy</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useMenuStore } from '../../stores/menuStore';
import { onMounted } from 'vue';

// Importation des composants
import LoginForm from './LoginForm.vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import VerifyCodeForm from './VerifyCodeForm.vue';
import ResetPasswordForm from './ResetPasswordForm.vue';
import ResetSuccessMessage from './ResetSuccessMessage.vue';

import logo from '../../assets/logo.png';
import illustration from '../../assets/image.png';

// États
const currentView = ref('login'); // 'login', 'forgotPassword', 'verifyCode', 'resetPassword', 'resetSuccess'
const resetEmail = ref('');
const verificationCode = ref('');

const router = useRouter();
const authStore = useAuthStore();
const menuStore = useMenuStore();

const roleLanding = {
  admin:      '/admin/dashboard',
  enseignant: '/admin/students',
  etudiant:   '/admin/challenges',
  tuteur:     '/admin/stagiaires'
};

// Fonction pour gérer le succès de la connexion
const handleLoginSuccess = (responseData) => {
  // Vérifier si la réponse contient un rôle
  if (!responseData || !responseData.role) {
    console.error('Réponse invalide, aucun rôle trouvé');
    return;
  }

  // 1) Stocker l'état d'authentification
  authStore.isAuthenticated = true;
  // Ici, vous pouvez décider de stocker un token ou tout autre détail nécessaire


// Stocker les informations dans le store
authStore.setUser({
  cin: responseData.cin,
  role: responseData.role,
});
  // 2) Construire le menu selon le rôle
  menuStore.setLinksByRole(responseData.role);

  // 3) Rediriger vers la page correspondante en fonction du rôle
  const roleLanding = {
    administrateur:      '/admin/dashboard',
    enseignant: '/admin/students',
    etudiant:   '/admin/challenges',
    tuteur:     '/admin/stagiaires',
  };

  const target = roleLanding[responseData.role] || '/login';  // Si le rôle n'est pas trouvé, redirige vers /login
  router.push(target);
};

// Vérifier au chargement si déjà logué (cookie HttpOnly)
onMounted(async () => {
  if (authStore.checkAuth && await authStore.fetchUser) {
    const me = await authStore.fetchUser();
    if (me) {
      menuStore.setLinksByRole(me.role);
      router.push(roleLanding[me.role] || '/admin/dashboard');
    }
  }
});

// Fonction pour gérer l'envoi du code
const handleCodeSent = (email) => {
  resetEmail.value = email;
  currentView.value = 'verifyCode';
};

// Fonction pour gérer la vérification du code
const handleCodeVerified = (code) => {
  verificationCode.value = code;
  currentView.value = 'resetPassword';
};
</script>

<style scoped>
@keyframes slide-whole-page {
  from {
    transform: translateX(-60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in-right {
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-whole-page {
  animation: slide-whole-page 1s ease-in-out;
}
.animate-fade-in-right {
  animation: fade-in-right 1s ease-in-out;
}
</style> 
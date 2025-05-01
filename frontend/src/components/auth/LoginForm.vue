<template>
  <form @submit.prevent="handleLogin" class="space-y-6">
    <div>
      <label for="email" class="block mb-2 text-sm font-medium">E-mail</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="Entrez votre e-mail"
        required
        :class="{'border-red-500': emailError}"
        class="w-full px-4 py-3 rounded-xl bg-white text-black text-base shadow-[0_4px_0_0_#f79009] border border-[#f79009] outline-none transition"
      />
      <div v-if="emailError" class="text-red-300 text-sm mt-1">E-mail invalide</div>
    </div>
    <div>
      <label for="password" class="block mb-2 text-sm font-medium">Mot de passe</label>
      <input
        id="password"
        v-model="pwd"
        type="password"
        placeholder="Mot de passe"
        required
        :class="{'border-red-500': pwdError}"
        class="w-full px-4 py-3 rounded-xl bg-white text-black text-base shadow-[0_4px_0_0_#f79009] border border-[#f79009] outline-none transition"
      />
      <div v-if="pwdError" class="text-red-300 text-sm mt-1">Le mot de passe est requis</div>
    </div>

    <div class="text-right text-sm">
      <a href="#" @click.prevent="$emit('forgotPassword')" class="text-white hover:underline">
        Mot de passe oublié ?
      </a>
    </div>
    <div class="flex justify-center mt-6">
      <button
        type="submit"
        class="py-[9px] px-[28px] bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold text-sm rounded-full shadow-[0_6px_0_0_#d35400] transition hover:scale-105"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </div>
    
    <div v-if="error" class="text-red-300 text-sm text-center mt-4">
      {{ error }}
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Importer le router de Vue

// Pour donner autorisation de stocker le token dans les cookies
axios.defaults.withCredentials = true;

// Variables de formulaire
const email = ref('');
const pwd = ref('');
const isLoading = ref(false);
const error = ref('');
const emailError = ref(false); // Ajouter une erreur pour l'email
const pwdError = ref(false);   // Ajouter une erreur pour le mot de passe

// Utiliser le router pour rediriger
const router = useRouter();

// Émission d'événements au composant parent
const emit = defineEmits(['handleLoginSuccess', 'forgotPassword']);

// Fonction de connexion
const handleLogin = async () => {
  // Reset des erreurs
  emailError.value = false;
  pwdError.value = false;
  error.value = '';
  
  // Validation côté client
  if (!validateEmail(email.value)) {
    emailError.value = true;
    return;
  }

  if (!pwd.value) {
    pwdError.value = true;
    return;
  }

  try {
    isLoading.value = true;
    
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: email.value,
      pwd: pwd.value
    });

    // Enregistrer les données du rôle dans la réponse
    const userRole = response.data.role;  // Le rôle renvoyé par le backend
    console.log(userRole)
    // Émettre l'événement de connexion réussie
    emit('handleLoginSuccess', response.data);

    

  } catch (err) {
    console.error('Erreur de connexion:', err);
    error.value = 'Identifiants invalides. Veuillez réessayer.';
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour valider l'email (expression régulière simple)
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};
</script>

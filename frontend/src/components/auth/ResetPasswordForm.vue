<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- New Password Input -->
    <div>
      <label for="newPassword" class="block mb-2 text-sm font-medium">
        Nouveau mot de passe
      </label>
      <input
        id="newPassword"
        v-model="pwd"
        type="password"
        placeholder="Entrez votre nouveau mot de passe"
        required
        class="w-full px-4 py-3 rounded-xl bg-white text-black text-base shadow-[0_4px_0_0_#f79009] border border-[#f79009] outline-none transition"
      />
    </div>
    
    <!-- Confirm Password Input -->
    <div>
      <label for="confirmPassword" class="block mb-2 text-sm font-medium">
        Confirmez le mot de passe
      </label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        placeholder="Confirmez votre mot de passe"
        required
        class="w-full px-4 py-3 rounded-xl bg-white text-black text-base shadow-[0_4px_0_0_#f79009] border border-[#f79009] outline-none transition"
      />
    </div>
    
    <!-- Password Error Message -->
    <div v-if="passwordError" class="text-red-300 text-sm">
      {{ passwordError }}
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-center mt-6 gap-4">
      <button
        type="button"
        @click="$emit('back')"
        class="py-[9px] px-[28px] bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm rounded-full shadow-[0_6px_0_0_#4a5568] transition hover:scale-105"
      >
        Retour
      </button>
      <button
        type="submit"
        class="py-[9px] px-[28px] bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold text-sm rounded-full shadow-[0_6px_0_0_#d35400] transition hover:scale-105"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
      </button>
    </div>
    
    <!-- General Error Message -->
    <div v-if="error && !passwordError" class="text-red-300 text-sm text-center mt-4">
      {{ error }}
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Props
const props = defineProps({
  email: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    required: true
  }
});

// Variables du formulaire
const pwd = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');
const passwordError = ref('');

// Émission d'événements
const emit = defineEmits(['back', 'resetSuccess']);

// Fonction pour réinitialiser le mot de passe
const handleSubmit = async () => {
  // Vérifier que les mots de passe correspondent
  if (pwd.value !== confirmPassword.value) {
    passwordError.value = 'Les mots de passe ne correspondent pas';
    return;
  }
  
  // Vérifier la complexité du mot de passe
  if (pwd.value.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères';
    return;
  }

  try {
    // Reset errors and start loading
    passwordError.value = '';
    error.value = '';
    isLoading.value = true;
    
    // API call to reset the password
    const response = await axios.post('http://localhost:3000/auth/resetPassword', {

      pwd: pwd.value
    });
    
    // Handle success - emit event to notify reset success
    emit('resetSuccess');
    
    // Clear the form fields
    pwd.value = '';
    confirmPassword.value = '';
    
  } catch (err) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', err);
    // Display the error message from the API response
    if (err.response && err.response.data) {
      error.value = err.response.data.message || 'Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.';
    } else {
      error.value = 'Erreur serveur. Veuillez réessayer plus tard.';
    }
  } finally {
    // Stop loading
    isLoading.value = false;
  }
};
</script>

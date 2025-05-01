<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label
        for="resetEmail"
        class="block mb-2 text-sm font-medium"
      >
        E-mail
      </label>
      <input
        id="resetEmail"
        v-model="email"
        type="email"
        placeholder="Entrez votre e-mail"
        required
        class="w-full px-4 py-3 rounded-xl bg-white text-black text-base shadow-[0_4px_0_0_#f79009] border border-[#f79009] outline-none transition"
      />
    </div>
    
    <div class="flex justify-center mt-6 gap-4">
      <button
        type="button"
        @click="$emit('backToLogin')"
        class="py-[9px] px-[28px] bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm rounded-full shadow-[0_6px_0_0_#4a5568] transition hover:scale-105"
      >
        Retour
      </button>
      <button
        type="submit"
        class="py-[9px] px-[28px] bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold text-sm rounded-full shadow-[0_6px_0_0_#d35400] transition hover:scale-105 `"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Envoi en cours...' : 'Envoyer le code' }}
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



// Variables du formulaire
const email = ref('');
const isLoading = ref(false);
const error = ref('');

// Émission d'événements
const emit = defineEmits(['backToLogin', 'codeSent']);

// Fonction pour demander un code de réinitialisation
const handleSubmit = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    
    await axios.post('http://localhost:3000/auth/sendcode', {
      email: email.value
    });
    
    // Émettre l'événement pour passer à l'étape de vérification du code
    emit('codeSent', email.value);
    
  } catch (err) {
    console.error('Erreur lors de la demande du code:', err);
    error.value = 'Impossible d\'envoyer le code. Veuillez vérifier votre e-mail.';
  } finally {
    isLoading.value = false;
  }
};
</script> 
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="verificationCode" class="block mb-2 text-sm font-medium">
        Code de vérification
      </label>
      <input
        id="verificationCode"
        v-model="verificationCode"
        type="text"
        placeholder="Entrez le code reçu"
        required
        class="w-full px-4 py-3 rounded-xl bg-white text-black text-base shadow-[0_4px_0_0_#f79009] border border-[#f79009] outline-none transition"
      />
    </div>

    <div class="text-center text-sm">
      <p class="text-gray-200 mb-2">
        Un code a été envoyé à l'adresse {{ email }}
      </p>
      <a href="#" @click.prevent="resendCode" class="text-white hover:underline">
        Renvoyer le code
      </a>
    </div>

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
        {{ isLoading ? 'Vérification...' : 'Vérifier le code' }}
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

// Props
const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

// Variables du formulaire
const verificationCode = ref('');
const isLoading = ref(false);
const error = ref('');
const isResending = ref(false);

// Émission d'événements
const emit = defineEmits(['back', 'codeVerified']);

// Fonction pour vérifier le code
const handleSubmit = async () => {
  try {
    error.value = '';
    isLoading.value = true;

    await axios.post('http://localhost:3000/auth/submitcode', {
      email: props.email,
      verificationCode: verificationCode.value
    });

    emit('codeVerified', verificationCode.value); // Proceed after code is verified
  } catch (err) {
    error.value = err.response?.data?.message || 'Code invalide. Veuillez réessayer.';
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour renvoyer le code
const resendCode = async () => {
  try {
    isResending.value = true;
    error.value = '';

    const response = await axios.post('http://localhost:3000/auth/sendcode', {
      email: props.email
    });

    error.value = 'Un nouveau code a été envoyé à votre adresse email.';
  } catch (err) {
    error.value = err.response?.data?.message || 'Impossible de renvoyer le code. Veuillez réessayer plus tard.';
  } finally {
    isResending.value = false;
  }
};
</script>

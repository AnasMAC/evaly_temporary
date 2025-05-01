<template>
  <div class="text-center">
    <div class="bg-green-600 bg-opacity-20 p-6 rounded-xl mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <h2 class="text-2xl font-bold mb-2">Mot de passe réinitialisé!</h2>
      <p class="text-gray-200">
        Votre mot de passe a été mis à jour avec succès.
      </p>
    </div>
    
    <button
      @click="$emit('backToLogin')"
      class="py-[9px] px-[28px] bg-[#ff6a00] hover:bg-[#e65c00] text-white font-bold text-sm rounded-full shadow-[0_6px_0_0_#d35400] transition hover:scale-105"
    >
      Revenir à la connexion
    </button>
  </div>
</template>

<script setup>
// Émission d'événements
const emit = defineEmits(['backToLogin']);
</script> 
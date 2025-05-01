<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();

// Vérifier si l'utilisateur est déjà connecté au chargement de l'application
onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import MainLayout from './components/layout/MainLayout.vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();

// Vérifier si l'utilisateur est déjà connecté au chargement de l'application
onMounted(() => {
  authStore.checkAuth();
});
</script>

<style>
/* Styles globaux */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}
</style>

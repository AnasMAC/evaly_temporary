<template>
  <header class="bg-[#33488E] text-white py-3 px-6 shadow-md">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
      
      <div class="flex items-center space-x-4">
        <!-- Notification icon -->
        <div class="relative">
          <button class="p-1 rounded-full hover:bg-blue-700 focus:outline-none" @click="toggleNotifications" ref="bellBtn">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 animate-fade-in" ref="dropdown">
            <div class="p-4 border-b border-gray-100 font-semibold text-[#33488E]">Notifications</div>
            <div class="p-4 text-sm text-gray-500">Aucune notification pour le moment.</div>
          </div>
        </div>
        
        <!-- User profile -->
        <div class="flex items-center">
          <div 
            class="w-9 h-9 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-blue-800"
          >
            <i class="fas fa-user"></i>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../../stores/menuStore';

const route = useRoute();
const menuStore = useMenuStore();

// Titre de la page calculé dynamiquement en fonction de la route active dans le store
const pageTitle = computed(() => {
  const path = route.path;
  const activeRoute = menuStore.adminRoutes.find(r => r.path === path);
  return activeRoute ? activeRoute.name : 'Overview';
});

const showNotifications = ref(false);
const bellBtn = ref(null);
const dropdown = ref(null);

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
}

function handleClickOutside(event) {
  if (
    showNotifications.value &&
    dropdown.value &&
    !dropdown.value.contains(event.target) &&
    bellBtn.value &&
    !bellBtn.value.contains(event.target)
  ) {
    showNotifications.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.18s ease;
}
</style>
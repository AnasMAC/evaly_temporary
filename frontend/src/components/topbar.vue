<template>
  <header class="bg-[#33488E] text-white py-3 px-6 shadow-md">
    <div class="flex justify-between items-center">
      
      <!-- Titre dynamique -->
      <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>

      <!-- Notifications + Profil -->
      <div class="flex items-center space-x-6">

        <!-- Cloche de notifications -->
        <div class="relative">
          <button @click="toggleNotifications" ref="bellBtn" class="relative p-1 rounded-full hover:bg-blue-700 focus:outline-none">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- Dropdown notifications -->
          <div
            v-if="showNotifications"
            ref="dropdown"
            class="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 animate-fade-in"
          >
            <div class="p-4 border-b border-gray-100 font-semibold text-[#33488E]">Notifications</div>
            <div class="p-4 text-sm text-gray-500">Aucune notification pour le moment.</div>
          </div>
        </div>

        <!-- Infos Utilisateur -->
        <div class="flex items-center space-x-3">
          <!-- Photo de profil -->
          <img
            :src="userStore.photo"
            alt="avatar"
            class="w-9 h-9 rounded-full object-cover border-2 border-white"
          />

          <!-- Nom et rôle -->
          <div class="leading-[1.2]">
            <div class="font-semibold text-sm">
              {{ userStore.nom || '...' }}
            </div>
            <div class="text-xs text-white opacity-80 lowercase">
              {{ userStore.role || 'admin' }}
            </div>
          </div>
        </div>

      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const menuStore = useMenuStore()
const userStore = useUserStore()

// Titre de page dynamique
const pageTitle = computed(() => {
  const path = route.path
  const active = menuStore.adminRoutes.find(r => r.path === path)
  return active ? active.name : 'Overview'
})

// Notifications
const showNotifications = ref(false)
const bellBtn = ref(null)
const dropdown = ref(null)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const handleClickOutside = (event) => {
  if (
    showNotifications.value &&
    dropdown.value &&
    !dropdown.value.contains(event.target) &&
    bellBtn.value &&
    !bellBtn.value.contains(event.target)
  ) {
    showNotifications.value = false
  }
}

onMounted(() => {
  userStore.fetchUserData()   // Charger nom, role, photo depuis l'API
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>

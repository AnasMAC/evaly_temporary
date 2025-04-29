<template>
  <div class="sidebar bg-white h-screen w-48 shadow-md flex flex-col items-start">
    <div class="logo-container flex items-center justify-start w-full pl-4 pb-2 pt-0">
      <img src="@/assets/logo.png" alt="Evaly" class="w-full max-w-[168px] mt-2" />
    </div>
    
    <nav class="flex-1 w-full">
      <ul class="space-y-1">
        <li v-for="route in menuStore.accessibleRoutes" :key="route.path">
          <router-link :to="route.path" class="sidebar-link">
            <i :class="[route.icon, 'mr-3']"></i>
            <span>{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useMenuStore } from '../../stores/menuStore';

// Utiliser le store Pinia pour la gestion du menu
const menuStore = useMenuStore();
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #eaeaea;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #6b7280;
  transition: all 0.3s;
  position: relative;
}

.sidebar-link:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.router-link-active {
  color: #E3873A;
  font-weight: 500;
  background-color: rgba(227, 135, 58, 0.1);
}

.router-link-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  width: 7px;
  background-color: #E3873A;
  border-radius: 5px;
  transition: all 0.3s;
}

.router-link-active:hover {
  background-color: rgba(227, 135, 58, 0.15);
  color: #E3873A;
}
</style>
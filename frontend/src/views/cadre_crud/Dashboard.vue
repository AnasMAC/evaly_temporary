<template>
  <div class="dashboard-container bg-gray-50 p-8">
    <!-- En-tête avec statistiques générales -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
      <p class="text-gray-500">Vue d'ensemble des activités et statistiques</p>
    </header>

    <!-- Vue globale sur les utilisateurs -->
    <div class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
        <span class="inline-block w-1 h-6 bg-blue-500 rounded mr-3"></span>
        Vue globale des utilisateurs
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Carte Étudiants -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-500 mb-1">Étudiants</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats.etudiants || 0 }}</p>
            </div>
            <div class="rounded-full bg-blue-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Carte Enseignants -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-500 mb-1">Enseignants</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats.enseignants || 0 }}</p>
            </div>
            <div class="rounded-full bg-green-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Carte Professionnels -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-purple-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-500 mb-1">Professionnels</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats.professionnels || 0 }}</p>
            </div>
            <div class="rounded-full bg-purple-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue globale sur les cadres actuels -->
    <div class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
        <span class="inline-block w-1 h-6 bg-indigo-500 rounded mr-3"></span>
        Vue globale des cadres actuels
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Carte Modules -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-indigo-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-indigo-500 mb-1">Modules</p>
              <p class="text-3xl font-bold text-gray-800">{{ cadres.nbrModule?.[0]?.count || 0 }}</p>
            </div>
            <div class="rounded-full bg-indigo-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Carte Projets -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-teal-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-teal-500 mb-1">Projets</p>
              <p class="text-3xl font-bold text-gray-800">{{ cadres.nbrProjet?.[0]?.count || 0 }}</p>
            </div>
            <div class="rounded-full bg-teal-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Carte Stages -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-pink-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-pink-500 mb-1">Stages</p>
              <p class="text-3xl font-bold text-gray-800">{{ cadres.nbrStage[0].count || 0 }}</p>
            </div>
            <div class="rounded-full bg-pink-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section graphique et alertes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Graphique nombre d'utilisateurs -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
          <span class="inline-block w-1 h-6 bg-blue-500 rounded mr-3"></span>
          Nombre d'utilisateurs actuels
        </h2>
        <div class="flex items-center justify-center mb-4 relative">
          <div class="w-full flex justify-center">
            <div class="relative w-64 h-64 flex items-center justify-center">
              <doughnut-chart v-if="chartDataReady" :chartData="totalCounterData" :options="counterOptions" class="h-64 w-64" />
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p class="text-5xl font-bold text-gray-800">{{ stats.total || 0 }}</p>
                <p class="text-sm text-gray-500 mt-1">le nombre total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertes récentes -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
          <span class="inline-block w-1 h-6 bg-red-500 rounded mr-3"></span>
          Alertes récentes
        </h2>
        <div class="space-y-4">
          <!-- Alerte 1 -->
          <div class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center mb-2">
              <div class="rounded-full h-10 w-10 flex items-center justify-center bg-red-100 mr-3">
                <div class="h-4 w-4 bg-red-500 rounded-full"></div>
              </div>
              <p class="font-medium text-gray-800">{{ alerts[0]?.title || 'Alerte 1' }}</p>
            </div>
            <p class="text-sm text-gray-600 ml-13">{{ alerts[0]?.description || 'Professeur' }}</p>
            <button class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center">
              Afficher le détail
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Alerte 2 -->
          <div class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center mb-2">
              <div class="rounded-full h-10 w-10 flex items-center justify-center bg-blue-100 mr-3">
                <div class="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
              <p class="font-medium text-gray-800">{{ alerts[1]?.title || 'Alerte 2' }}</p>
            </div>
            <p class="text-sm text-gray-600 ml-13">{{ alerts[1]?.description || 'Professeur' }}</p>
            <button class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center">
              Afficher le détail
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Alerte 3 -->
          <div class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center mb-2">
              <div class="rounded-full h-10 w-10 flex items-center justify-center bg-yellow-100 mr-3">
                <div class="h-4 w-4 bg-yellow-500 rounded-full"></div>
              </div>
              <p class="font-medium text-gray-800">{{ alerts[2]?.title || 'Alerte 3' }}</p>
            </div>
            <p class="text-sm text-gray-600 ml-13">{{ alerts[2]?.description || 'Tuteur' }}</p>
            <button class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center">
              Afficher le détail
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { useAuthStore } from '@/stores/authStore';

Chart.register(...registerables);

export default {
  name: 'Dashboard',
  components: {
    DoughnutChart
  },
  setup() {
    const userName = ref('Admin');
    const stats = ref({
      etudiants: 0,
      enseignants: 0,
      professionnels: 0,
      total: 0
    });
    const cadres = ref({
      nbrModule: [{ count: 0 }],
      nbrProjet: [{ count: 0 }],
      nbrStage: [{ count: 0 }]
    });
    const alerts = ref([]);
    const chartDataReady = ref(false);
    const loading = ref(true);
    const error = ref(null);
    const authStore = useAuthStore();
    const administrateurId = ref(authStore.cin);
    console.log('Administrateur ID:', administrateurId.value); // Affiche l'ID de l'administrateur connecté
    

    const chartData = computed(() => {
      return {
        labels: ['Étudiants', 'Enseignants', 'Professionnels'],
        datasets: [
          {
            data: [stats.value.etudiants, stats.value.enseignants, stats.value.professionnels],
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
            borderWidth: 0,
            hoverOffset: 15
          }
        ]
      };
    });

    const totalCounterData = computed(() => {
      return {
        labels: ['Portion remplie', 'Portion vide'],
        datasets: [
          {
            data: [stats.value.total || 0, Math.max(0, 1000 - (stats.value.total || 0))],
            backgroundColor: ['#3b82f6', '#fef3c7'],
            borderWidth: 0,
            circumference: 270,
            rotation: 225
          }
        ]
      };
    });

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    };

    const counterOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '85%',
      plugins: {
        legend: {
          display: false
        }
      }
    };

    onMounted(async () => {
      try {
        loading.value = true;
        
        // 1. Récupération des statistiques utilisateurs
        const userResponse = await axios.get(`http://localhost:3000/adminProfil/Utilisateurs/${administrateurId.value}/`);
        if (userResponse.data) {
          stats.value = {
            etudiants: userResponse.data.etudiants || 0,
            enseignants: userResponse.data.enseignants || 0,
            professionnels: userResponse.data.professionnels || 0,
            total: userResponse.data.total || 0
          };
        }

        // 2. Récupération des statistiques cadres
        const cadresResponse = await axios.get('http://localhost:3000/api/statcadres');
        if (cadresResponse.data) {
          cadres.value = cadresResponse.data;
        }

        // // 3. Récupération des alertes
        // const alertsResponse = await axios.get('http://localhost:3000/api/alertes');
        // if (alertsResponse.data) {
        //   alerts.value = alertsResponse.data;
        // }

        chartDataReady.value = true;
      } catch (err) {
        console.error('Erreur API:', err);
        error.value = 'Erreur lors du chargement des données';
      } finally {
        loading.value = false;
      }
    });

    return {
      userName,
      stats,
      cadres,
      alerts,
      chartData,
      totalCounterData,
      chartOptions,
      counterOptions,
      chartDataReady,
      loading,
      error
    };
  }
};
</script>
<style scoped>
.dashboard-container {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}

/* Animation de transition pour les cartes */
.rounded-xl {
  transition: all 0.3s ease;
}

/* Polices améliorées */
h1, h2, p {
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
}
</style>
<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-8 text-center" style="color:#33488E">Gestionnaire des Professionnels</h1>
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4" style="color:#33488E">Ajouter un Professionnel</h2>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block font-medium mb-1">CIN</label>
            <input v-model="professional.cin" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="CIN" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Nom</label>
            <input v-model="professional.nom" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Nom" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Prénom</label>
            <input v-model="professional.prenom" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Prénom" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Email</label>
            <input v-model="professional.email" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Email" type="email" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Entreprise</label>
            <input v-model="professional.nomEntreprise" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Entreprise" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Domaine d'activité</label>
            <input v-model="professional.domaineActivite" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Domaine d'activité" required />
          </div>
          
          <div class="md:col-span-3 flex justify-center mt-4">
            <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium">
              {{ isEditing ? 'Modifier' : 'Enregistrer' }}
            </button>
            <button v-if="isEditing" type="button" class="ml-2 bg-[#33488E] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#2a3a73]" @click="cancelEdit">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des professionnels -->
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" :style="{ color: '#33488E' }">Liste des professionnels créés</h2>
        
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom et Prénom</th>
              <th class="px-6 py-3 text-left uppercase font-medium w-24">CIN</th>
              <th class="px-6 py-3 text-left uppercase font-medium w-64">Email</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Entreprise</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Domaine</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(professionnel, idx) in professionnels" :key="professionnel.cin"
                :class="[(idx % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ professionnel.nom }} {{ professionnel.prenom }}</td>
              <td class="px-6 py-4 w-24">{{ professionnel.cin }}</td>
              <td class="px-6 py-4 w-64">{{ professionnel.email }}</td>
              <td class="px-6 py-4">{{ professionnel.nomEntreprise }}</td>
              <td class="px-6 py-4">{{ professionnel.domaineActivite }}</td>
              <td class="px-6 py-4">
                <button class="text-[#33488E] font-medium hover:text-[#2a3a73] mr-4" @click="editProfessional(professionnel)">EDIT</button>
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="confirmDelete(professionnel.cin)">DELETE</button>
              </td>
            </tr>
            <tr v-if="professionnels.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">Aucun professionnel trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
const professionnels = ref([]);
const professional = ref({ 
  cin: '', 
  nom: '', 
  prenom: '', 
  email: '', 
  nomEntreprise: '', 
  domaineActivite: '',
  role: 'professionnel' 
});
const isEditing = ref(false);
const authStore = useAuthStore();
const administrateurId = ref(authStore.cin);  // À remplacer par l'ID de l'administrateur connecté

const fetchProfessionals = async () => {
  try {
    const response = await axios.get(`/api/professionnels/${administrateurId.value}`);
    professionnels.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des professionnels:", error);
  }
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/professionnels/${administrateurId.value}`, professional.value);
    } else {
      await axios.post(`/api/professionnels/${administrateurId.value}`, professional.value);
    }
    fetchProfessionals();
    resetForm();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du professionnel:", error);
  }
};

const editProfessional = (professionnel) => {
  professional.value = { ...professionnel };
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  professional.value = { 
    cin: '', 
    nom: '', 
    prenom: '', 
    email: '', 
    nomEntreprise: '', 
    domaineActivite: '',
    role: 'professionnel' 
  };
  isEditing.value = false;
};

const confirmDelete = (cin) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce professionnel ?")) {
    deleteProfessional(cin);
  }
};

const deleteProfessional = async (cin) => {
  try {
    await axios.delete(`/api/professionnels/${administrateurId.value}/${cin}`);
    fetchProfessionals();
  } catch (error) {
    console.error("Erreur lors de la suppression du professionnel:", error);
  }
};

onMounted(fetchProfessionals);
</script>

<style scoped>
h2 {
  color: #33488E;
}

input {
  border-radius: 0.5rem;

}

input:focus {
  border-color: #E3873A;
  outline: none;
  box-shadow: 0 0 0 1px #E3873A;
}

.btn-orange {
  background-color: #E3873A;
  color: white;
  transition: box-shadow 0.2s, transform 0.2s;
}
.btn-orange:hover {
  box-shadow: 0 4px 18px rgba(227, 135, 58, 0.18);
  transform: translateY(-2px);
  background-color: #e67e3a;
}

.bg-\[\#FFF7F0\] { background-color: #FFF7F0; }
.bg-\[\#F7F7F7\] { background-color: #F7F7F7; }
.border-b { border-bottom-width: 1px; }
.border-\[\#444\] { border-bottom-color: #444; }
</style>
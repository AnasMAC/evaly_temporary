<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-8 text-center" style="color:#33488E">Gestionnaire des Enseignants</h1>
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4" style="color:#33488E">Ajouter un Enseignant</h2>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block font-medium mb-1">CIN</label>
            <input v-model="teacher.cin" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="CIN" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Nom</label>
            <input v-model="teacher.nom" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Nom" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Prénom</label>
            <input v-model="teacher.prenom" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Prénom" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Email</label>
            <input v-model="teacher.email" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Email" type="email" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Département</label>
            <input v-model="teacher.departement" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Département" required />
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

      <!-- Liste des enseignants -->
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" :style="{ color: '#33488E' }">Liste des enseignants créés</h2>
        
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom et Prénom</th>
              <th class="px-6 py-3 text-left uppercase font-medium ">CIN</th>
              <th class="px-6 py-3 text-left uppercase font-medium ">Email</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Département</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(enseignant, idx) in enseignants" :key="enseignant.cin"
                :class="[(idx % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ enseignant.nom }} {{ enseignant.prenom }}</td>
              <td class="px-6 py-4">{{ enseignant.cin }}</td>
              <td class="px-6 py-4">{{ enseignant.email }}</td>
              <td class="px-6 py-4">{{ enseignant.departement }}</td>
              <td class="px-6 py-4">
                <button class="text-[#33488E] font-medium hover:text-[#2a3a73] mr-4" @click="editTeacher(enseignant)">EDIT</button>
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="confirmDelete(enseignant.cin)">DELETE</button>
              </td>
            </tr>
            <tr v-if="enseignants.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">Aucun enseignant trouvé</td>
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

const enseignants = ref([]);
const teacher = ref({ cin: '', nom: '', prenom: '', email: '', departement: '', role: 'enseignant' });
const isEditing = ref(false);
const administrateurId = ref('admin123'); // À remplacer par l'ID de l'administrateur connecté

const fetchTeachers = async () => {
  try {
    const response = await axios.get(`/api/enseignants/${administrateurId.value}`);
    enseignants.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des enseignants:", error);
  }
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/enseignants/${administrateurId.value}`, teacher.value);
    } else {
      await axios.post(`/api/enseignants/${administrateurId.value}`, teacher.value);
    }
    fetchTeachers();
    resetForm();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'enseignant:", error);
  }
};

const editTeacher = (enseignant) => {
  teacher.value = { ...enseignant };
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  teacher.value = { cin: '', nom: '', prenom: '', email: '', departement: '', role: 'enseignant' };
  isEditing.value = false;
};

const confirmDelete = (cin) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
    deleteTeacher(cin);
  }
};

const deleteTeacher = async (cin) => {
  try {
    await axios.delete(`/api/enseignants/${administrateurId.value}/${cin}`);
    fetchTeachers();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'enseignant:", error);
  }
};

onMounted(fetchTeachers);
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
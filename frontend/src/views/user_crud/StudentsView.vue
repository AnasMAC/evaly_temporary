<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-8 text-center" style="color:#33488E">Gestionnaire des Étudiants</h1>
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4" style="color:#33488E">Ajouter un Étudiant</h2>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block font-medium mb-1">CIN</label>
            <input v-model="student.cin" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="CIN" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Nom</label>
            <input v-model="student.nom" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Nom" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Prénom</label>
            <input v-model="student.prenom" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Prénom" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Email</label>
            <input v-model="student.email" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Email" type="email" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Promotion</label>
            <input v-model="student.promotion" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Promotion" required />
          </div>
          
          <div>
            <label class="block font-medium mb-1">Filière</label>
            <select v-model="student.filiere" class="w-full p-2 border border-gray-300 rounded-lg">
              <option disabled value="">Choisir une filière</option>
              <option value="GINF">GINF</option>
              <option value="CSI">CSI</option>
              <option value="GIND">GIND</option>
              <option value="GSR">GSR</option>
              <option value="G2EI">G2EI</option>
              <option value="GSEA">GSEA</option>
            </select>
          </div>
        </form>

        <div class="md:col-span-3 flex justify-center mt-4">
          <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium">
            {{ isEditing ? 'Modifier' : 'Enregistrer' }}
          </button>
          <button v-if="isEditing" type="button" class="ml-2 bg-[#33488E] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#2a3a73]" @click="cancelEdit">
            Annuler
          </button>
        </div>
      </div>

      <!-- Liste des étudiants -->
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" :style="{ color: '#33488E' }">Liste des étudiants créés</h2>
        
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom et Prénom</th>
              <th class="px-6 py-3 text-left uppercase font-medium w-24">CIN</th>
              <th class="px-6 py-3 text-left uppercase font-medium w-64">Email</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Filière</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(etudiant, idx) in etudiants" :key="etudiant.cin"
                :class="[(idx % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ etudiant.nom }} {{ etudiant.prenom }}</td>
              <td class="px-6 py-4 w-24">{{ etudiant.cin }}</td>
              <td class="px-6 py-4 w-64">{{ etudiant.email }}</td>
              <td class="px-6 py-4">{{ etudiant.filiere }}</td>
              <td class="px-6 py-4">
                <button class="text-[#33488E] font-medium hover:text-[#2a3a73] mr-4" @click="editStudent(etudiant)">EDIT</button>
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="confirmDelete(etudiant.cin)">DELETE</button>
              </td>
            </tr>
            <tr v-if="etudiants.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">Aucun étudiant trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Définir l'objet student avec reactive
const student = reactive({
  cin: '',
  nom: '',
  prenom: '',
  email: '',
  promotion: '',
  filiere: '',
  role: 'etudiant'
});

const etudiants = ref([]);
const isEditing = ref(false);
const authStore = useAuthStore();
const administrateurId = ref(authStore.cin);
console.log(authStore.cin); // Affiche l'ID de l'administrateur connecté

// Accéder aux données du store
const fetchStudents = async () => {
  try {
    const response = await axios.get(`/api/etudiants/${administrateurId.value}`);
    etudiants.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
  }
};

const handleSubmit = async () => {
  console.log('Formulaire soumis'); // Vérifier si la méthode est appelée
  try {
    if (isEditing.value) {
      console.log('Modification de l\'étudiant');
      await axios.put(`/api/etudiants/${administrateurId.value}`, student);
    } else {
      console.log('Ajout d\'un nouvel étudiant');
      await axios.post(`/api/etudiants/${administrateurId.value}`, student);
    }
    fetchStudents(); // Récupérer les étudiants après soumission
    resetForm(); // Réinitialiser le formulaire
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'étudiant:", error);
  }
};

const editStudent = (etudiant) => {
  student.cin = etudiant.cin;
  student.nom = etudiant.nom;
  student.prenom = etudiant.prenom;
  student.email = etudiant.email;
  student.promotion = etudiant.promotion;
  student.filiere = etudiant.filiere;
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  student.cin = '';
  student.nom = '';
  student.prenom = '';
  student.email = '';
  student.promotion = '';
  student.filiere = '';
  isEditing.value = false;
};

const confirmDelete = (cin) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
    deleteStudent(cin);
  }
};

const deleteStudent = async (cin) => {
  try {
    await axios.delete(`/api/etudiants/${administrateurId.value}/${cin}`);
    fetchStudents(); // Rafraîchir la liste après suppression
  } catch (error) {
    console.error("Erreur lors de la suppression de l'étudiant:", error);
  }
};

onMounted(fetchStudents); // Charger les étudiants lors du montage du composant
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

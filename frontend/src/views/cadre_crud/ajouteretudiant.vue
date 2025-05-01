<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center" style="color:#33488E">{{ nomCadre }}</h1>
      <p class="text-center text-sm text-gray-600 mb-8">Ajouter vos étudiants à ce cadre</p>
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <form @submit.prevent="ajouterEtudiant" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block font-medium mb-1">CIN</label>
            <input v-model="formEtudiant.cin" placeholder="CIN de l'étudiant" required class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="col-span-2 flex items-end">
            <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium w-full">Ajouter</button>
          </div>
        </form>
      </div>
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" style="color:#33488E">Liste des étudiants ajoutés</h2>
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom et Prénom</th>
              <th class="px-6 py-3 text-left uppercase font-medium">CIN</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Email</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Filière</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="etudiant in etudiants" :key="etudiant.id" :class="[(etudiants.indexOf(etudiant) % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4 flex items-center gap-2">
                <img :src="etudiant.photo" alt="avatar" class="w-8 h-8 rounded-full" />
                {{ etudiant.nom }}
              </td>
              <td class="px-6 py-4">{{ etudiant.cin }}</td>
              <td class="px-6 py-4">{{ etudiant.email }}</td>
              <td class="px-6 py-4">{{ etudiant.filiere }}</td>
              <td class="px-6 py-4">
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="supprimerEtudiant(etudiant.id)">DELETE</button>
              </td>
            </tr>
            <tr v-if="etudiants.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">Aucun étudiant ajouté</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Récupérer ID du cadre depuis l'URL
const route = useRoute()
const idCadre = route.params.idCadre

// Variables
const nomCadre = ref('')
const formEtudiant = ref({ cin: '' })
const etudiants = ref([])

// Charger le nom du cadre via API
const chargerNomCadre = async () => {
  try {
    const response = await axios.get(`/api/cadre/${idCadre}`)
    nomCadre.value = response.data.nom
  } catch (error) {
    console.error('Erreur API:', error)
    alert("Erreur lors de la récupération du cadre.")
  }
}

// Ajouter un étudiant
const ajouterEtudiant = async () => {
  const cin = formEtudiant.value.cin.trim().toUpperCase()
  if (!cin) {
    alert("CIN est requis.")
    return
  }

  try {
    // 1. Vérifier si l'étudiant existe
    const response = await axios.get(`/api/student/cin/${cin}`)
    const data = response.data

    // 2. Vérifier si déjà ajouté
    const existe = etudiants.value.find(e => e.cin === data.cin)
    if (existe) {
      alert("Cet étudiant est déjà ajouté.")
      return
    }

    // 3. Associer étudiant au cadre avec API POST
    await axios.post(`/api/cadre/${idCadre}/etudiant/${data.id}`)

    // 4. Ajouter dans le tableau après succès
    const nouvelEtudiant = {
      id: data.id,
      nom: `${data.nom} ${data.prenom || ''}`,
      cin: data.cin,
      email: data.email,
      filiere: data.filiere || 'Non précisé',
      photo: data.photo || '/src/assets/profile.jpg'
    }
    etudiants.value.push(nouvelEtudiant)
    formEtudiant.value.cin = ''

  } catch (error) {
    if (error.response && error.response.status === 404) {
      alert("Cet étudiant n'existe pas dans notre base de données.")
    } else {
      console.error('Erreur API:', error)
      alert("Erreur de connexion au serveur.")
    }
  }
}

// Supprimer un étudiant
const supprimerEtudiant = async (idEtudiant) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) return

  try {
    await axios.delete(`/api/cadre/${idCadre}/etudiant/${idEtudiant}`)
    etudiants.value = etudiants.value.filter(e => e.id !== idEtudiant)
  } catch (error) {
    console.error('Erreur API suppression:', error)
    alert("Erreur lors de la suppression de l'étudiant.")
  }
}

// Charger au démarrage
onMounted(() => {
  chargerNomCadre()
})
</script>

<style scoped>
h1, h2 {
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
table button {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
}
</style>

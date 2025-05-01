<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center" style="color:#33488E">{{ nomCadre }}</h1>
      <p class="text-center text-sm text-gray-600 mb-8">Ajouter des compétences à ce cadre</p>
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <form @submit.prevent="ajouterCompetence" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block font-medium mb-1">Nom</label>
            <input v-model="formCompetence.nom" placeholder="Nom de la compétence" required class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">Catégorie</label>
            <input v-model="formCompetence.categorie" placeholder="Catégorie" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">Indicateur 1</label>
            <input v-model="formCompetence.ind1" placeholder="Indicateur 1" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">Indicateur 2</label>
            <input v-model="formCompetence.ind2" placeholder="Indicateur 2" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">Indicateur 3</label>
            <input v-model="formCompetence.ind3" placeholder="Indicateur 3" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="col-span-3 flex justify-center mt-4">
            <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium">Ajouter</button>
          </div>
        </form>
      </div>
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" style="color:#33488E">Liste des compétences ajoutées</h2>
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Catégorie</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Indicateur 1</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Indicateur 2</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Indicateur 3</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="competence in competences" :key="competence.id_competence" :class="[(competences.indexOf(competence) % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ competence.nom }}</td>
              <td class="px-6 py-4">{{ competence.categorie }}</td>
              <td class="px-6 py-4">{{ competence.ind1 }}</td>
              <td class="px-6 py-4">{{ competence.ind2 }}</td>
              <td class="px-6 py-4">{{ competence.ind3 }}</td>
              <td class="px-6 py-4">
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="supprimerCompetence(competence.id_competence)">DELETE</button>
              </td>
            </tr>
            <tr v-if="competences.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">Aucune compétence ajoutée</td>
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
const competences = ref([])
const formCompetence = ref({ nom: '' })

// Charger le nom du cadre
const chargerNomCadre = async () => {
  try {
    const response = await axios.get(`/api/cadre/${idCadre}`)
    nomCadre.value = response.data.nom
  } catch (error) {
    console.error('Erreur API cadre:', error)
    alert("Erreur lors de la récupération du cadre.")
  }
}

// Ajouter une compétence
const ajouterCompetence = async () => {
  const nom = formCompetence.value.nom.trim()
  if (!nom) {
    alert("Le nom de la compétence est requis.")
    return
  }

  try {
    const response = await axios.post(`/api/cadre/${idCadre}`, {
      competence: nom,
      categorie: "Informatique" // Peut être fixe ou dynamique
    })

    const nouvelleCompetence = {
      id_competence: response.data.id_competence,
      nom: response.data.nom,
      categorie: response.data.categorie,
      ind1: response.data.ind1 || '',
      ind2: response.data.ind2 || '',
      ind3: response.data.ind3 || ''
    }
    competences.value.push(nouvelleCompetence)
    formCompetence.value.nom = ''

  } catch (error) {
    console.error('Erreur ajout compétence:', error)
    alert("Erreur lors de l'ajout de la compétence.")
  }
}

// Supprimer une compétence
const supprimerCompetence = async (competenceId) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) return

  try {
    await axios.delete(`/api/cadre/${idCadre}/competence/${competenceId}`)
    competences.value = competences.value.filter(c => c.id_competence !== competenceId)
  } catch (error) {
    console.error('Erreur suppression compétence:', error)
    alert("Erreur lors de la suppression de la compétence.")
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

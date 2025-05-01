<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-8 text-center" style="color:#33488E">Gestionnaire des Compétences</h1>
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4" style="color:#33488E">Ajouter une Compétence</h2>
        <form @submit.prevent="modeEdition ? modifierCompetence() : ajouterCompetence()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block font-medium mb-1">Nom</label>
            <input v-model="form.Nom" placeholder="Nom de la compétence" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Catégorie</label>
            <input v-model="form.Categorie" placeholder="Catégorie" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Type</label>
            <input v-model="form.Description" placeholder="Type" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Indicateur 1</label>
            <input v-model="form.ind1" placeholder="Indicateur 1" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">Indicateur 2</label>
            <input v-model="form.ind2" placeholder="Indicateur 2" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">Indicateur 3</label>
            <input v-model="form.ind3" placeholder="Indicateur 3" class="w-full p-2 border border-gray-300 rounded-lg"  />
          </div>
          <div class="col-span-3 flex justify-center mt-4">
            <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium">{{ modeEdition ? 'Mettre à jour' : 'Enregistrer' }}</button>
          </div>
        </form>
      </div>
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" style="color:#33488E">Liste des Compétences créées</h2>
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Catégorie</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Type</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Indicateur 1</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Indicateur 2</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Indicateur 3</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in competences" :key="item.id" :class="[(competences.indexOf(item) % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ item.Nom }}</td>
              <td class="px-6 py-4">{{ item.Categorie }}</td>
              <td class="px-6 py-4">{{ item.Description }}</td>
              <td class="px-6 py-4">{{ item.ind1 }}</td>
              <td class="px-6 py-4">{{ item.ind2 }}</td>
              <td class="px-6 py-4">{{ item.ind3 }}</td>
              <td class="px-6 py-4">
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="remplirFormulaire(item)">EDIT</button> /
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="supprimerCompetence(item.id)">DELETE</button>
              </td>
            </tr>
            <tr v-if="competences.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">Aucune compétence créée</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({ Nom: '', Categorie: '', Description: '', ind1: '', ind2: '', ind3: '' })
const competences = ref([])
const modeEdition = ref(false)
const idEnCours = ref(null)

const chargerCompetences = async () => {
  try {
    const res = await axios.get('/api/competence')
    if (Array.isArray(res.data)) {
      competences.value = res.data
    } else {
      competences.value = []
    }
  } catch (error) {
    console.error('Erreur chargement compétences:', error)
    competences.value = []
  }
}

const ajouterCompetence = async () => {
  try {
    const res = await axios.post('/api/competence', form.value)
    competences.value.push(res.data)
    resetFormulaire()
  } catch (error) {
    console.error('Erreur ajout compétence:', error)
  }
}

const modifierCompetence = async () => {
  try {
    const res = await axios.put(`/api/competence/${idEnCours.value}`, form.value)
    const index = competences.value.findIndex(c => c.id === idEnCours.value)
    if (index !== -1) competences.value[index] = res.data
    resetFormulaire()
  } catch (error) {
    console.error('Erreur modification compétence:', error)
  }
}

const supprimerCompetence = async (id) => {
  try {
    await axios.delete(`/api/competence/${id}`)
    competences.value = competences.value.filter(c => c.id !== id)
    if (id === idEnCours.value) resetFormulaire()
  } catch (error) {
    console.error('Erreur suppression compétence:', error)
  }
}

const remplirFormulaire = (competence) => {
  form.value = { ...competence }
  idEnCours.value = competence.id
  modeEdition.value = true
}

const resetFormulaire = () => {
  form.value = { nom: '', categorie: '', description: '', ind1: '', ind2: '', ind3: '' }
  idEnCours.value = null
  modeEdition.value = false
}

onMounted(() => {
  chargerCompetences()
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
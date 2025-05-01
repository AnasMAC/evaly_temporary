<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-8 text-center" style="color:#33488E">Gestionnaire des Cadres</h1>
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4" style="color:#33488E">Ajouter un Cadre</h2>
        <form @submit.prevent="modeEdition ? modifierCadre() : ajouterCadre()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block font-medium mb-1">Nom</label>
            <input v-model="form.nom" placeholder="Nom du cadre" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Type</label>
            <select v-model="form.type" class="w-full p-2 border border-gray-300 rounded-lg" required>
              <option disabled value="">Type</option>
              <option value="Cours">Cours</option>
              <option value="Projet">Projet</option>
              <option value="Stage">Stage</option>
            </select>
          </div>
          <div>
            <label class="block font-medium mb-1">Fréquence d'évaluation</label>
            <input v-model="form.frequence" placeholder="Fréquence d'évaluation" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Date début</label>
            <input v-model="form.dateDebut" type="date" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Date fin</label>
            <input v-model="form.dateFin" type="date" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block font-medium mb-1">Encadrant / Enseignant / Tuteur</label>
            <input v-model="form.encadrant" placeholder="Encadrant / Enseignant / Tuteur" class="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          <div class="col-span-3 flex justify-center mt-4">
            <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium">{{ modeEdition ? 'Mettre à jour' : 'Enregistrer' }}</button>
          </div>
        </form>
      </div>
      <!-- Tableau -->
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b" style="color:#33488E">Liste des Cadres créés</h2>
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 text-left uppercase font-medium">Nom</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Fréquence</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Type</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Date début - fin</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Ajout</th>
              <th class="px-6 py-3 text-left uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cadre in cadres" :key="cadre.id" :class="[(cadres.indexOf(cadre) % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ cadre.nom }}</td>
              <td class="px-6 py-4">{{ cadre.frequence }}</td>
              <td class="px-6 py-4">{{ cadre.type }}</td>
              <td class="px-6 py-4">{{ cadre.dateDebut }} jusqu'à {{ cadre.dateFin }}</td>
              <td class="px-6 py-4 text-green-600 space-x-2">
                <router-link :to="`/ajoutercompetence/${cadre.id}`">compétences</router-link> /
                <router-link :to="`/ajouteretudiant/${cadre.id}`">étudiants</router-link>
              </td>
              <td class="px-6 py-4 text-blue-600 space-x-2">
                <button @click="remplirFormulaire(cadre)" class="text-[#E3873A] font-medium hover:text-[#e67e3a]">EDIT</button> /
                <button @click="supprimerCadre(cadre.id)" class="text-[#E3873A] font-medium hover:text-[#e67e3a]">DELETE</button>
              </td>
            </tr>
            <tr v-if="cadres.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">Aucun cadre créé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  nom: '',
  frequence: '',
  type: '',
  dateDebut: '',
  dateFin: '',
  encadrant: ''
})

const cadres = ref([]) // Commence vide
const modeEdition = ref(false)
const idEnCours = ref(null)

// Ajouter un cadre
const ajouterCadre = async () => {
  try {
    const res = await axios.post('/api/cadre/', form.value)
    cadres.value.push(res.data) // Ajouter uniquement après succès
    resetFormulaire()
  } catch (err) {
    console.error('Erreur ajout cadre', err)
  }
}

// Modifier un cadre
const modifierCadre = async () => {
  try {
    const res = await axios.put(`/api/cadre/${idEnCours.value}`, form.value)
    const index = cadres.value.findIndex(c => c.id === idEnCours.value)
    if (index !== -1) {
      cadres.value[index] = res.data
    }
    resetFormulaire()
  } catch (err) {
    console.error('Erreur modification cadre', err)
  }
}

// Supprimer un cadre
const supprimerCadre = async (id) => {
  try {
    await axios.delete(`/api/cadre/${id}`)
    cadres.value = cadres.value.filter(cadre => cadre.id !== id)
    if (id === idEnCours.value) resetFormulaire()
  } catch (err) {
    console.error('Erreur suppression cadre', err)
  }
}

// Remplir pour édition
const remplirFormulaire = (cadre) => {
  form.value = { ...cadre }
  idEnCours.value = cadre.id
  modeEdition.value = true
}

// Reset
const resetFormulaire = () => {
  form.value = {
    nom: '',
    frequence: '',
    type: '',
    dateDebut: '',
    dateFin: '',
    encadrant: ''
  }
  modeEdition.value = false
  idEnCours.value = null
}
</script>

<style scoped>
h1, h2 {
  color: #33488E;
}
input, select {
  border-radius: 0.5rem;
}
input:focus, select:focus {
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

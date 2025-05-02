<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

const form = ref({
  nom: '', frequence: '', type: '', dateDebut: '', dateFin: '',
  description: '', id_Enseignant: ''
})

const cadres = ref([])
const modeEdition = ref(false)
const idEnCours = ref(null)

const chargerCadres = async () => {
  try {
    const res = await api.get('/cadre')
    cadres.value = res.data
  } catch (err) {
    console.error('Erreur chargement cadres', err.response?.data || err)
  }
}

const ajouterCadre = async () => {
  try {
    const payload = {
      Nom: form.value.nom,
      Frequence_evaluation: form.value.frequence,
      Date_debut: form.value.dateDebut,
      Date_fin: form.value.dateFin,
      Type: form.value.type,
      Description: form.value.description,
      id_Enseignant: form.value.id_Enseignant || null,
      id_Professionnel: null
    }
    const res = await api.post('/cadre', payload)
    cadres.value.push(res.data)
    resetFormulaire()
  } catch (err) {
    console.error('Erreur ajout cadre', err.response?.data || err)
  }
}

const modifierCadre = async () => {
  try {
    const payload = {
      Nom: form.value.nom,
      Frequence_evaluation: form.value.frequence,
      Date_debut: form.value.dateDebut,
      Date_fin: form.value.dateFin,
      Type: form.value.type,
      Description: form.value.description,
      id_Enseignant: form.value.id_Enseignant || null,
      id_Professionnel: null
    }
    const res = await api.put(`/cadre/${idEnCours.value}`, payload)
    const index = cadres.value.findIndex(c => c.id_cadre === idEnCours.value)
    if (index !== -1) cadres.value[index] = res.data
    resetFormulaire()
  } catch (err) {
    console.error('Erreur modification cadre', err.response?.data || err)
  }
}

const supprimerCadre = async (id) => {
  try {
    await api.delete(`/cadre/${id}`)
    cadres.value = cadres.value.filter(cadre => cadre.id_cadre !== id)
    if (id === idEnCours.value) resetFormulaire()
  } catch (err) {
    console.error('Erreur suppression cadre', err.response?.data || err)
  }
}

const remplirFormulaire = (cadre) => {
  form.value = {
    nom: cadre.Nom,
    frequence: cadre.Frequence_evaluation,
    type: cadre.Type,
    dateDebut: cadre.Date_debut,
    dateFin: cadre.Date_fin,
    description: cadre.Description,
    id_Enseignant: cadre.superviseurs?.[0]?.id || ''
  }
  idEnCours.value = cadre.id_cadre
  modeEdition.value = true
}

const resetFormulaire = () => {
  form.value = {
    nom: '', frequence: '', type: '', dateDebut: '', dateFin: '',
    description: '', id_Enseignant: ''
  }
  modeEdition.value = false
  idEnCours.value = null
}

onMounted(() => {
  chargerCadres()
})
</script>

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
            <label class="block font-medium mb-1">Description</label>
            <input v-model="form.description" placeholder="Description" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block font-medium mb-1">ID Enseignant</label>
            <input v-model="form.id_Enseignant" placeholder="ID de l'enseignant" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="col-span-3 flex justify-center mt-4">
            <button type="submit" class="btn-orange py-2 px-8 rounded-lg font-medium">{{ modeEdition ? 'Mettre à jour' : 'Enregistrer' }}</button>
          </div>
        </form>
      </div>
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
            <tr v-for="cadre in cadres" :key="cadre.id_cadre" :class="[(cadres.indexOf(cadre) % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']">
              <td class="px-6 py-4">{{ cadre.Nom }}</td>
              <td class="px-6 py-4">{{ cadre.Frequence_evaluation }}</td>
              <td class="px-6 py-4">{{ cadre.Type }}</td>
              <td class="px-6 py-4">{{ cadre.Date_debut }} jusqu'à {{ cadre.Date_fin }}</td>
              <td class="px-6 py-4 text-green-600 space-x-2">
                <router-link :to="`/add-competence/${cadre.id_cadre}`">compétences</router-link> /
                <router-link :to="`/add-student/${cadre.id_cadre}`">étudiants</router-link>
              </td>
              <td class="px-6 py-4 text-blue-600 space-x-2">
                <button @click="remplirFormulaire(cadre)" class="text-[#E3873A] font-medium hover:text-[#e67e3a]">EDIT</button> /
                <button @click="supprimerCadre(cadre.id_cadre)" class="text-[#E3873A] font-medium hover:text-[#e67e3a]">DELETE</button>
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
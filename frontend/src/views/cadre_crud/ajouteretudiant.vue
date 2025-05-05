<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center text-[#33488E]">{{ nomCadre }}</h1>
      <p class="text-center text-sm text-gray-600 mb-8">Ajouter vos étudiants à ce cadre</p>

      <!-- Formulaire d'ajout -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <form @submit.prevent="ajouterEtudiant" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block font-medium mb-1">CIN</label>
            <input
              v-model="formEtudiant.cin"
              placeholder="CIN de l'étudiant"
              required
              class="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div class="col-span-2 flex items-end">
            <button
              type="submit"
              :disabled="isLoading"
              class="btn-orange py-2 px-8 rounded-lg font-medium w-full flex justify-center items-center"
            >
              <span v-if="isLoading" class="loader mr-2"></span>
              <span>{{ isLoading ? 'Ajout...' : 'Ajouter' }}</span>
            </button>
          </div>
        </form>
        <p v-if="message" :class="{'text-green-600': isSuccess, 'text-red-600': !isSuccess}" class="mt-4 text-sm font-medium text-center">
          {{ message }}
        </p>
      </div>

      <!-- Liste des étudiants -->
      <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold p-6 border-b text-[#33488E]">Liste des étudiants ajoutés</h2>
        <table class="min-w-full">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-6 py-3 uppercase font-medium">Nom et Prénom</th>
              <th class="px-6 py-3 uppercase font-medium">CIN</th>
              <th class="px-6 py-3 uppercase font-medium">EMAIL</th>
              <th class="px-6 py-3 uppercase font-medium">FILIÈRE</th>
              <th class="px-6 py-3 uppercase font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="etudiant in etudiants"
              :key="etudiant.cin"
              :class="[(etudiants.indexOf(etudiant) % 2 === 0 ? 'bg-[#FFF7F0]' : 'bg-[#F7F7F7]'), 'border-b', 'border-[#444]']"
            >
              <td class="px-6 py-4 flex items-center gap-2">
                <img :src="etudiant.photo" alt="avatar" class="w-8 h-8 rounded-full" />
                {{ etudiant.nom }} {{ etudiant.prenom }}
              </td>
              <td class="px-6 py-4">{{ etudiant.cin }}</td>
              <td class="px-6 py-4">{{ etudiant.email }}</td>
              <td class="px-6 py-4">{{ etudiant.filiere }}</td>
              <td class="px-6 py-4">
                <button class="text-[#E3873A] font-medium hover:text-[#e67e3a]" @click="supprimerEtudiant(etudiant.cin)">
                  DELETE
                </button>
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

const route = useRoute()
const idCadre = route.params.id
const nomCadre = ref('')
const formEtudiant = ref({ cin: '' })
const etudiants = ref([])
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(true)

// Récupère les infos du cadre + les participants
const chargerCadreEtEtudiants = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/cadre/${idCadre}`)
    const data = response.data

    nomCadre.value = data.Nom || 'Nom du cadre inconnu'

    if (Array.isArray(data.participants)) {
      etudiants.value = data.participants.map(p => ({
        cin: p.cin,
        nom: p.base.nom,
        prenom:p.base.prenom, // nom inconnu
        email: p.base.email,  // non disponible
        filiere: p.filiere || 'Non précisé',
        photo: '/src/assets/profile.jpg'
      }))
    }
  } catch (error) {
    console.error('Erreur chargement cadre :', error)
    message.value = "Erreur lors du chargement du cadre."
    isSuccess.value = false
  }
}

// Ajout d’un étudiant
const ajouterEtudiant = async () => {
  const cin = formEtudiant.value.cin.trim()
  if (!cin) {
    message.value = "CIN est requis."
    isSuccess.value = false
    return
  }

  if (etudiants.value.find(e => e.cin === cin)) {
    message.value = "Cet étudiant est déjà dans le cadre."
    isSuccess.value = false
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    console.log("Ajout étudiant avec CIN :", cin)
    await axios.post(`http://localhost:3000/api/cadre/${idCadre}/etudiant/${cin}`)

    // Recharge la liste après ajout
    await chargerCadreEtEtudiants()

    formEtudiant.value.cin = ''
    message.value = "Étudiant ajouté avec succès."
    isSuccess.value = true
  } catch (error) {
    console.error("Erreur ajout :", error)
    message.value = "Erreur lors de l'ajout."
    isSuccess.value = false
  } finally {
    isLoading.value = false
  }
}

// Suppression
const supprimerEtudiant = async (cin) => {
  if (!confirm("Confirmer la suppression ?")) return

  try {
    await axios.delete(`http://localhost:3000/api/cadre/${idCadre}/etudiant/${cin}`)
    await chargerCadreEtEtudiants()
    message.value = "Étudiant supprimé avec succès."
    isSuccess.value = true
  } catch (error) {
    console.error("Erreur suppression :", error)
    message.value = "Erreur lors de la suppression."
    isSuccess.value = false
  }
}

// Initialisation au montage
onMounted(() => {
  console.log("Chargement du cadre ID:", idCadre)
  chargerCadreEtEtudiants()
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
.btn-orange:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-orange:hover:enabled {
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
  font-weight: 500;
  cursor: pointer;
}
.loader {
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
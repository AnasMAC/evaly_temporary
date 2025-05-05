<template>
  <div class="flex min-h-screen">
    <div class="flex flex-col flex-1 bg-[#f1f5f9]">
      <main class="flex-1 font-sans pl-4 pt-2">
        <div class="max-w-7xl ml-8">
          <!-- Titre principal -->
          <h1 class="text-3xl font-bold text-center text-[#333B69] mt-8 mb-8">{{ nomCadre }}</h1>
          <p class="text-center text-sm text-gray-600 mb-8">Ajouter des compétences à ce cadre</p>

          <!-- Formulaire d'ajout de compétence -->
          <div class="bg-white p-6 rounded shadow mb-8 max-w-2xl mx-auto">
            <form @submit.prevent="ajouterCompetence" class="grid grid-cols-2 gap-4 items-end">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom </label>
                <input 
                  v-model="formCompetence.nom" 
                  placeholder="Nom de la compétence" 
                  required 
                  class="border p-2 rounded w-full" />
              </div>
              <div class="col-span-1">
                <button 
                  type="submit" 
                  class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded w-full">
                  Ajouter
                </button>
              </div>
            </form>
          </div>

          <!-- Tableau des compétences ajoutées -->
          <div class="bg-white rounded shadow max-w-7xl ml-8 mr-8">
            <h2 class="text-xl font-semibold p-4 border-b">Liste des compétences ajoutées</h2>
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-left">
                <tr>
                  <th class="p-3">Nom</th>
                  <th class="p-3">Catégorie</th>
                  <th class="p-3">Indicateur 1</th>
                  <th class="p-3">Indicateur 2</th>
                  <th class="p-3">Indicateur 3</th>
                  <th class="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="competence in competences" :key="competence.id" class="border-t">
                  <td class="p-3">{{ competence.nom }}</td>
                  <td class="p-3">{{ competence.categorie }}</td>
                  <td class="p-3">{{ competence.ind1 }}</td>
                  <td class="p-3">{{ competence.ind2 }}</td>
                  <td class="p-3">{{ competence.ind3 }}</td>
                  <td class="p-3 text-blue-600">
                    <button @click="supprimerCompetence(competence.id)">DELETE</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
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
const competences = ref([])
const formCompetence = ref({ nom: '' })

// Charger cadre + compétences
const chargerCadreEtCompetences = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/cadre/${idCadre}`)
    const data = response.data
    nomCadre.value = data.Nom || 'Nom du cadre inconnu'

    if (Array.isArray(data.competences)) {
      competences.value = data.competences.map((comp) => {
        const indics = comp.indicateurs || []
        return {
          id: indics[0]?.id_competence ?? null, // Récupère l'id depuis le 1er indicateur
          nom: comp.Nom,
          categorie: comp.Categorie,
          ind1: indics[0]?.indicateur || '',
          ind2: indics[1]?.indicateur || '',
          ind3: indics[2]?.indicateur || ''
        }
      }).filter(c => c.id !== null) // Ne garde que les compétences valides
    }
  } catch (error) {
    console.error('Erreur API cadre:', error)
    alert("Erreur lors de la récupération du cadre.")
  }
}

// Ajouter compétence
const ajouterCompetence = async () => {
  const nom = formCompetence.value.nom.trim()
  if (!nom) {
    alert("Le nom de la compétence est requis.")
    return
  }

  try {
    await axios.post(`http://localhost:3000/api/cadre/${idCadre}`, {
      competence: nom,
      categorie: "Soft Skills"
    })
    formCompetence.value.nom = ''
    await chargerCadreEtCompetences()
  } catch (error) {
    console.error('Erreur ajout compétence:', error)
    alert("Erreur lors de l'ajout de la compétence.")
  }
}

// Supprimer compétence
const supprimerCompetence = async (idComp) => {
  if (!idComp) return alert("ID de compétence invalide.")
  if (!confirm("Confirmer la suppression ?")) return

  try {
    await axios.delete(`http://localhost:3000/api/cadre/${idCadre}/competence/${idComp}`)
    await chargerCadreEtCompetences()
  } catch (error) {
    console.error('Erreur suppression compétence:', error)
    alert("Erreur lors de la suppression.")
  }
}

onMounted(() => {
  chargerCadreEtCompetences()
})
</script>

<style scoped>
table button {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
}
input:focus, select:focus {
  outline: none;
  border-color: #2563eb;
}
</style>
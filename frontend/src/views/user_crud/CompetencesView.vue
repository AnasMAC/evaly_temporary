<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-8 text-center" style="color:#33488E">Gestionnaire des Compétences</h1>
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold mb-4" style="color:#33488E">Ajouter une Compétence</h2>
        <p class="text-gray-700">Gérez ici vos compétences, certifications ou projets scolaires.</p>
      </div>
      <div class="md:col-span-3 flex justify-center mt-4">
        <button type="submit" class="btn-orange py-2 px-6 rounded-lg font-medium">
          {{ isEditing ? 'Modifier' : 'Enregistrer' }}
        </button>
        <button v-if="isEditing" type="button" class="ml-2 bg-[#33488E] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#2a3a73]" @click="cancelEdit">
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Ajoutez ici la logique de gestion des compétences si besoin
</script>

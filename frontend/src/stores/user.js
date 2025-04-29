// src/stores/user.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    nom: '',                // vide au début
    role: 'admin',               // vide au début
    photo: localStorage.getItem('userPhoto') || new URL('@/assets/profile.jpg', import.meta.url).href
  }),

  actions: {
    // Charger les infos de l'admin depuis l'API
    async fetchUserData() {
      try {
        const response = await axios.get('/api/admin/me')
        this.nom = response.data.nom
    
        this.photo = response.data.photo || new URL('@/assets/profile.jpg', import.meta.url).href
      } catch (error) {
        console.error('Erreur chargement admin:', error)
      }
    },

    // Modifier la photo localement
    updatePhoto(nouvellePhoto) {
      this.photo = nouvellePhoto
      localStorage.setItem('userPhoto', nouvellePhoto)
    }
  }
})

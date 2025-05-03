<template>
  <div class="profil-container">
    <div class="profil-header">
      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Profil Administrateur</h1>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Erreur! </strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    
    <div v-else class="profil-content bg-white rounded-lg p-6 shadow-md">
      <!-- Section photo de profil et email -->
      <div class="flex items-center mb-8">
        <div class="profile-image mr-5">
          <div class="relative">
            <img 
              :src="userProfile.photoUrl || '/api/placeholder/80/80'" 
              alt="Photo de profil" 
              class="w-20 h-20 rounded-full object-cover border-2 border-orange-400"
            />
            <!-- Suppression du bouton d'édition de la photo de profil -->
          </div>
        </div>
        <div class="user-info">
          <h2 class="text-xl font-medium text-gray-800">{{ userProfile.prenom }}</h2>
          <p class="text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ userProfile.email }}
          </p>
        </div>
        <div class="ml-auto">
          <button class="text-gray-400 hover:text-orange-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Section informations personnelles -->
      <div class="bg-gray-50 p-5 rounded-lg mb-8">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Informations personnelles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              type="text" 
              v-model="userProfile.nom"
              placeholder="Votre nom" 
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input 
              type="text" 
              v-model="userProfile.prenom"
              placeholder="Votre prénom" 
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              v-model="userProfile.email"
              placeholder="Votre email" 
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="userProfile.role"
                placeholder="administrateur" 
                class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                disabled
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Suppression du bouton d'enregistrement pour les infos personnelles -->
      </div>

      <!-- Section mot de passe - reste inchangée -->
      <div class="password-section bg-gray-50 p-5 rounded-lg">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Sécurité</h3>
        
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h4 class="font-medium text-gray-800">Mot de passe</h4>
            <p class="text-sm text-gray-500">Dernière modification: il y a 3 mois</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <div class="relative">
              <input 
                :type="passwordVisibility.old ? 'text' : 'password'" 
                v-model="passwords.old"
                placeholder="••••••••" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
              />
              <div 
                class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                @click="togglePasswordVisibility('old')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="passwordVisibility.old" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div class="relative">
              <input 
                :type="passwordVisibility.new ? 'text' : 'password'" 
                v-model="passwords.new"
                placeholder="••••••••" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
              />
              <div 
                class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                @click="togglePasswordVisibility('new')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="passwordVisibility.new" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmez votre mot de passe</label>
            <div class="relative">
              <input 
                :type="passwordVisibility.confirm ? 'text' : 'password'" 
                v-model="passwords.confirm"
                placeholder="••••••••" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
              />
              <div 
                class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                @click="togglePasswordVisibility('confirm')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="passwordVisibility.confirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              @click="updatePassword"
              class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'ProfilAdministrateur',
  data() {
    return {
      userProfile: {
        nom: '',
        prenom: '',
        email: '',
        role: 'administrateur',
        photoUrl: null
      },
      passwords: {
        old: '',
        new: '',
        confirm: ''
      },
      passwordVisibility: {
        old: false,
        new: false,
        confirm: false
      },
      loading: true,
      error: null,
      administrateurId: null
    }
  },
  async created() {
    try {
      // Récupérer l'ID de l'administrateur depuis le store d'authentification
      const authStore = useAuthStore();
      this.administrateurId = authStore.cin;
      
      if (!this.administrateurId) {
        this.error = "ID administrateur non trouvé";
        this.loading = false;
        return;
      }
      
      const response = await axios.get(`http://localhost:3000/adminProfil/${this.administrateurId}`);
      this.userProfile = {
        ...response.data,
        photoUrl: response.data.photoUrl || null
      };
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      this.error = error.response?.data?.message || "Erreur lors de la récupération des données";
      this.loading = false;
    }
  },
  methods: {
    togglePasswordVisibility(field) {
      this.passwordVisibility[field] = !this.passwordVisibility[field];
    },
    // Nous gardons la méthode updateProfile mais elle ne sera plus utilisée puisque le bouton a été supprimé
    async updateProfile() {
      try {
        if (!this.administrateurId) {
          this.$toast?.error("ID administrateur non trouvé") || alert("ID administrateur non trouvé");
          return;
        }
        
        await axios.patch(`http://localhost:3000/adminProfil/${this.administrateurId}`, {
          nom: this.userProfile.nom,
          prenom: this.userProfile.prenom,
          email: this.userProfile.email
        });
        
        this.$toast?.success("Profil mis à jour avec succès") || alert("Profil mis à jour avec succès");
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.$toast?.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil") || 
          alert(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
      }
    },
    async updatePassword() {
      try {
        // Validation des champs
        if (!this.passwords.old) {
          this.$toast?.error("Veuillez saisir votre mot de passe actuel") || 
            alert("Veuillez saisir votre mot de passe actuel");
          return;
        }
        
        if (this.passwords.new !== this.passwords.confirm) {
          this.$toast?.error("Les nouveaux mots de passe ne correspondent pas") || 
            alert("Les nouveaux mots de passe ne correspondent pas");
          return;
        }
        
        if (this.passwords.new.length < 6) {
          this.$toast?.error("Le nouveau mot de passe doit contenir au moins 6 caractères") || 
            alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
          return;
        }
        
        if (!this.administrateurId) {
          this.$toast?.error("ID administrateur non trouvé") || alert("ID administrateur non trouvé");
          return;
        }
        console.log(this.administrateurId)
        // Appel à l'API pour changer le mot de passe
        await axios.patch(`http://localhost:3000/adminProfil/changepwd/${this.administrateurId}`, {
          oldPwd: this.passwords.old,
          newPwd: this.passwords.new,
          confirmPwd: this.passwords.confirm
        });
        
        // Réinitialiser les champs
        this.passwords.old = '';
        this.passwords.new = '';
        this.passwords.confirm = '';
        
        this.$toast?.success("Mot de passe mis à jour avec succès") || alert("Mot de passe mis à jour avec succès");
      } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        this.$toast?.error(error.response?.data?.msg || "Erreur lors de la mise à jour du mot de passe") || 
          alert(error.response?.data?.msg || "Erreur lors de la mise à jour du mot de passe");
      }
    }
  }
}
</script>

<style scoped>
.profil-container {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.profil-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
</style>
import { mount } from '@vue/test-utils'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ResetPasswordForm from '../src/components/auth/ResetPasswordForm.vue'
import axios from 'axios'

// Mock axios pour éviter les appels réels
vi.mock('axios')

describe('ResetPasswordForm.vue', () => {
  const email = 'test@mail.com'
  const verificationCode = '123456'

  beforeEach(() => {
    vi.resetAllMocks()  // Réinitialiser les mocks avant chaque test
  })

  it('affiche le champ mot de passe et confirmation', () => {
    const wrapper = mount(ResetPasswordForm, {
      props: { email, verificationCode }
    })

    // Vérifie que les champs de mot de passe et de confirmation existent
    expect(wrapper.find('#newPassword').exists()).toBe(true)
    expect(wrapper.find('#confirmPassword').exists()).toBe(true)

    // Vérifie que le bouton "Réinitialiser le mot de passe" existe
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    const wrapper = mount(ResetPasswordForm, {
      props: { email, verificationCode }
    })

    // Remplir les champs de mot de passe avec des valeurs différentes
    await wrapper.find('#newPassword').setValue('password123')
    await wrapper.find('#confirmPassword').setValue('password124')

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')

    // Vérifie que l'erreur est affichée
    expect(wrapper.text()).toContain('Les mots de passe ne correspondent pas')
  })

  it('devrait afficher une erreur si le mot de passe est trop court', async () => {
    const wrapper = mount(ResetPasswordForm, {
      props: { email, verificationCode }
    })

    // Remplir les champs avec un mot de passe trop court
    await wrapper.find('#newPassword').setValue('123')
    await wrapper.find('#confirmPassword').setValue('123')

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')

    // Vérifie que l'erreur est affichée
    expect(wrapper.text()).toContain('Le mot de passe doit contenir au moins 8 caractères')
  })

  it('devrait soumettre le formulaire et appeler l\'API de réinitialisation', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Mot de passe réinitialisé' } })

    const wrapper = mount(ResetPasswordForm, {
      props: { email, verificationCode }
    })

    // Remplir les champs de mot de passe
    await wrapper.find('#newPassword').setValue('newpassword123')
    await wrapper.find('#confirmPassword').setValue('newpassword123')

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')

    // Vérifie que l'API a été appelée avec les bonnes données
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/auth/resetPassword', {
      pwd: 'newpassword123'
    })

    // Vérifie que l'événement "resetSuccess" a été émis
    expect(wrapper.emitted('resetSuccess')).toBeTruthy()
  })

  it('devrait afficher une erreur si l\'API échoue', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Erreur serveur' } } })

    const wrapper = mount(ResetPasswordForm, {
      props: { email, verificationCode }
    })

    // Remplir les champs de mot de passe
    await wrapper.find('#newPassword').setValue('newpassword123')
    await wrapper.find('#confirmPassword').setValue('newpassword123')

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')

    // Vérifie que l'erreur est affichée
    expect(wrapper.text()).toContain('Nouveau mot de passe  Confirmez le mot de passe  Retour Réinitialiser le mot de passeErreur serveur')
  })

  it('devrait émettre un événement "back" lorsqu\'on clique sur le bouton Retour', async () => {
    const wrapper = mount(ResetPasswordForm, {
      props: { email, verificationCode }
    })

    // Cliquer sur le bouton Retour
    await wrapper.find('button[type="button"]').trigger('click')

    // Vérifie que l'événement "back" a été émis
    expect(wrapper.emitted('back')).toBeTruthy()
  })
})

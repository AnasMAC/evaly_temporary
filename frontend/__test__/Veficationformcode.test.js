import { mount } from '@vue/test-utils'
import VerifyCodeForm from '../src/components/auth/VerifyCodeForm.vue'
import axios from 'axios'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Simuler axios
vi.mock('axios')

describe('VerificationCode.vue', () => {

  const email = 'test@mail.com'

  beforeEach(() => {
    vi.resetAllMocks()  // Réinitialiser les mocks avant chaque test
  })

  it('affiche le champ de code de vérification et le bouton de soumission', () => {
    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Vérifie que le champ de saisie de code de vérification existe
    expect(wrapper.find('#verificationCode').exists()).toBe(true)

    // Vérifie que le bouton de soumission existe
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('devrait remplir le champ de code de vérification', async () => {
    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Remplir le champ de code de vérification
    await wrapper.find('#verificationCode').setValue('123456')

    // Vérifie que la valeur du champ est correcte
    expect(wrapper.vm.verificationCode).toBe('123456')
  })

  it('devrait soumettre le code et appeler la fonction handleSubmit', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Code vérifié avec succès' } })

    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Remplir le champ de code
    await wrapper.find('#verificationCode').setValue('123456')

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')

    // Vérifie que l'API a été appelée avec les bons paramètres
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/auth/submitcode',
      { email: email, verificationCode: '123456' }
    )

    // Vérifie que l'événement "codeVerified" a bien été émis
    expect(wrapper.emitted('codeVerified')).toBeTruthy()
    expect(wrapper.emitted('codeVerified')[0]).toEqual(['123456'])
  })

  it('devrait afficher un message d\'erreur si le code est invalide', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Code invalide' } } })

    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Remplir le champ de code
    await wrapper.find('#verificationCode').setValue('wrongcode')

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')

    // Vérifie que l'erreur est affichée
    expect(wrapper.text()).toContain('Code de vérification  Un code a été envoyé à l\'adresse test@mail.com Renvoyer le code  Retour Vérifier le codeCode invalide')
  })

  it('devrait renvoyer un nouveau code lorsqu\'on clique sur "Renvoyer le code"', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Code renvoyé' } })

    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Cliquer sur le lien pour renvoyer le code
    await wrapper.find('a').trigger('click')

    // Vérifie que l'API a été appelée pour renvoyer le code
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/auth/sendcode',
      { email: email }
    )

    // Vérifie que l'erreur contient le message de succès
    expect(wrapper.text()).toContain('Un nouveau code a été envoyé à votre adresse email.')
  })

  it('devrait afficher un message d\'erreur si le renvoi du code échoue', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Impossible de renvoyer le code' } } })

    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Cliquer sur le lien pour renvoyer le code
    await wrapper.find('a').trigger('click')

    // Vérifie que l'erreur est affichée
    expect(wrapper.text()).toContain('Code de vérification  Un code a été envoyé à l\'adresse test@mail.com Renvoyer le code  Retour Vérifier le codeImpossible de renvoyer le code')
  })


  it('devrait émettre un événement "back" lorsqu\'on clique sur le bouton Retour', async () => {
    const wrapper = mount(VerifyCodeForm, {
      props: { email }
    })

    // Cliquer sur le bouton Retour
    await wrapper.find('button[type="button"]').trigger('click')

    // Vérifie que l'événement "back" a été émis
    expect(wrapper.emitted('back')).toBeTruthy()
  })
})

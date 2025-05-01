import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ForgotPasswordForm from '../src/components/auth/ForgotPasswordForm.vue'
import axios from 'axios'



vi.mock('axios');  



// Décrire les tests
describe('ForgotPasswordForm.vue', () => {
  it('affiche le champ email et les boutons', () => {
    const wrapper = mount(ForgotPasswordForm)

    expect(wrapper.find('#resetEmail').exists()).toBe(true)

    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    expect(wrapper.find('button[type="button"]').exists()).toBe(true) // ca C'est la button de retour 

  })
  it('envoie une requête et émet codeSent si l\'email est valide', async () => {
    axios.post.mockResolvedValue({}) 
  
    const wrapper = mount(ForgotPasswordForm)
  
    // Remplir le champ email
    await wrapper.find('#resetEmail').setValue('test@mail.com')
  
    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')
  
    // Vérifier que l'API a été appelée avec l'email
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/auth/sendcode', 
      { email: 'test@mail.com' }
    )
  
    // Vérifier que l'événement "codeSent" a bien été émis
    expect(wrapper.emitted('codeSent')).toBeTruthy()
  })
  it('affiche une erreur si l\'envoi du code échoue', async () => {
    axios.post.mockRejectedValue(new Error('Erreur serveur'))
  
    const wrapper = mount(ForgotPasswordForm);
  
    // Remplir le champ email
    await wrapper.find('#resetEmail').setValue('test@mail.com')
  
    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent')
  
    // Vérifier que le message d'erreur est affiché
    expect(wrapper.text()).toContain('Impossible d\'envoyer le code. Veuillez vérifier votre e-mail.')
  })
  it('émet backToLogin au clic sur le bouton Retour', async () => {
    const wrapper = mount(ForgotPasswordForm)
  
    // Simuler un clic sur le bouton "Retour"
    await wrapper.find('button[type="button"]').trigger('click')
  
    // Vérifier que l'événement "backToLogin" a été émis
    expect(wrapper.emitted('backToLogin')).toBeTruthy()
  })
  
  
})


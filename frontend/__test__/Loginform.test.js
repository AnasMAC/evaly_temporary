import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from '../src/components/auth/LoginForm.vue'
import axios from 'axios'

// Fake axios post
vi.mock('axios')

describe('LoginForm.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('affiche les champs email et mot de passe', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('affiche une erreur si email est invalide', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('#email').setValue('invalid-email')
    await wrapper.find('#password').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('E-mail invalide')
  })

  it('affiche une erreur si le mot de passe est vide', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('#email').setValue('test@mail.com')
    await wrapper.find('#password').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Le mot de passe est requis')
  })

  it('émet loginSuccess si le login est bon', async () => {
    axios.post.mockResolvedValue({ data:{ msg:'connexion reussite'} });

    const wrapper = mount(LoginForm)

    await wrapper.find('#email').setValue('user@mail.com')
    await wrapper.find('#password').setValue('validpass')
    await wrapper.find('form').trigger('submit.prevent')

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/auth/login',
      { email: 'user@mail.com', pwd: 'validpass' }
    )

    expect(wrapper.emitted('loginSuccess')).toBeTruthy()
  })

  it('affiche un message d’erreur si l’API échoue', async () => {
    axios.post.mockRejectedValue(new Error('Erreur serveur'))

    const wrapper = mount(LoginForm)
    await wrapper.find('#email').setValue('fail@mail.com')
    await wrapper.find('#password').setValue('wrongpass')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Identifiants invalides')
  })

  it('émet forgotPassword au clic sur le lien', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted('forgotPassword')).toBeTruthy()
  })
})

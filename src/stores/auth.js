import { defineStore } from 'pinia'
import repo from '@/services/repo'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    me: null,
    ready: false,
  }),
  getters: {
    isAuthed: (state) => !!state.me,
    role: (state) => (state.me ? state.me.role : 'viewer'),
    isSuper: (state) => state.me?.role === 'superadmin',
    canWrite: (state) => state.me && (state.me.role === 'superadmin' || state.me.role === 'editor'),
  },
  actions: {
    async init() {
      this.me = await repo.getSession()
      this.ready = true
    },
    async login(username, password) {
      this.me = await repo.login({ username, password })
      return this.me
    },
    async logout() {
      await repo.logout()
      this.me = null
    },
  },
})

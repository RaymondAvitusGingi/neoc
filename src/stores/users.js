import { defineStore } from 'pinia'
import repo from '@/services/repo'

export const useUsersStore = defineStore('users', {
  state: () => ({
    list: [],
    loaded: false,
  }),
  getters: {
    activeSuperAdmins: (state) => state.list.filter((u) => u.active && u.role === 'superadmin').length,
  },
  actions: {
    async load() {
      this.list = await repo.listUsers()
      this.loaded = true
    },
    async create(payload) {
      await repo.createUser(payload)
      await this.load()
    },
    async setPassword(id, password) {
      const result = await repo.setUserPassword(id, password)
      await this.load()
      return result
    },
    async updateRole(id, role) {
      await repo.updateUserRole(id, role)
      await this.load()
    },
    async toggleActive(id) {
      await repo.toggleUserActive(id)
      await this.load()
    },
    async remove(id) {
      await repo.deleteUser(id)
      await this.load()
    },
  },
})

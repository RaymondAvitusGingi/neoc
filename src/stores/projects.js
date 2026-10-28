import { defineStore } from 'pinia'
import repo from '@/services/repo'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    list: [],
    loaded: false,
    filter: 'All',
  }),
  getters: {
    categories: (state) => ['All', ...new Set(state.list.map((p) => p.service).filter(Boolean))],
    filtered: (state) => (state.filter === 'All' ? state.list : state.list.filter((p) => p.service === state.filter)),
  },
  actions: {
    async load() {
      this.list = await repo.listProjects()
      this.loaded = true
      if (!this.categories.includes(this.filter)) this.filter = 'All'
    },
    setFilter(value) {
      this.filter = value
    },
    async create(payload) {
      await repo.createProject(payload)
      await this.load()
    },
    async remove(id) {
      await repo.deleteProject(id)
      await this.load()
    },
    byId(id) {
      return this.list.find((p) => p.id === id) || null
    },
  },
})

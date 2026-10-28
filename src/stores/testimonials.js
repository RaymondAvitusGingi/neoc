import { defineStore } from 'pinia'
import repo from '@/services/repo'

export const useTestimonialsStore = defineStore('testimonials', {
  state: () => ({
    list: [],
    loaded: false,
    editingId: null,
  }),
  getters: {
    shown: (state) => state.list.filter((t) => t.visible).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    sorted: (state) => state.list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
  },
  actions: {
    async load() {
      this.list = await repo.listTestimonials()
      this.loaded = true
    },
    async save(payload) {
      await repo.upsertTestimonial(payload)
      await this.load()
      this.editingId = null
    },
    async toggleVisible(id) {
      await repo.toggleTestimonialVisible(id)
      await this.load()
    },
    async remove(id) {
      await repo.deleteTestimonial(id)
      await this.load()
    },
    edit(id) {
      this.editingId = id
    },
    cancelEdit() {
      this.editingId = null
    },
  },
})

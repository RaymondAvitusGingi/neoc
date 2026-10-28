import { defineStore } from 'pinia'
import repo from '@/services/repo'

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    list: [],
    loaded: false,
  }),
  getters: {
    unreadCount: (state) => state.list.filter((m) => !m.read).length,
  },
  actions: {
    async load() {
      this.list = await repo.listMessages()
      this.loaded = true
    },
    async send(payload) {
      await repo.createMessage(payload)
    },
    async markRead(key, read) {
      await repo.setMessageRead(key, read)
      await this.load()
    },
    async remove(key) {
      await repo.deleteMessage(key)
      await this.load()
    },
  },
})

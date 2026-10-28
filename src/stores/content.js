import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import repo from '@/services/repo'
import { cloneDefaults } from '@/services/defaults'

// Vue's reactive Proxy can't go through structuredClone directly — unwrap first.
function deepClone(value) {
  return JSON.parse(JSON.stringify(toRaw(value)))
}

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}
function setPath(obj, path, value) {
  const keys = path.split('.')
  let node = obj
  for (let i = 0; i < keys.length - 1; i++) node = node[keys[i]]
  node[keys.at(-1)] = value
}

export const useContentStore = defineStore('content', {
  state: () => ({
    content: cloneDefaults(),
    draft: null,
    dirty: false,
    loading: true,
  }),
  getters: {
    isDraftOpen: (state) => state.draft !== null,
  },
  actions: {
    async load() {
      this.loading = true
      this.content = await repo.getContent()
      this.loading = false
    },
    beginDraft() {
      if (!this.draft) this.draft = deepClone(this.content)
    },
    getField(path) {
      this.beginDraft()
      return getPath(this.draft, path)
    },
    setField(path, value) {
      this.beginDraft()
      setPath(this.draft, path, value)
      this.dirty = true
    },
    addListItem(key, item = { t: '', d: '' }) {
      this.beginDraft()
      this.draft[key].push(item)
      this.dirty = true
    },
    removeListItem(key, index) {
      this.beginDraft()
      this.draft[key].splice(index, 1)
      this.dirty = true
    },
    moveListItem(key, index, dir) {
      this.beginDraft()
      const list = this.draft[key]
      const target = index + dir
      if (target < 0 || target >= list.length) return
      ;[list[index], list[target]] = [list[target], list[index]]
      this.dirty = true
    },
    markDirty() {
      this.dirty = true
    },
    discard() {
      this.draft = deepClone(this.content)
      this.dirty = false
    },
    async restoreDefaults() {
      this.content = await repo.restoreDefaults()
      this.draft = deepClone(this.content)
      this.dirty = false
    },
    async save(publishedBy) {
      if (!this.draft) return
      this.content = await repo.saveContent(this.draft, publishedBy)
      this.draft = deepClone(this.content)
      this.dirty = false
    },
  },
})

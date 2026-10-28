<script setup>
import { onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useContentStore } from '@/stores/content'
import { FIBERS, fiber } from '@/services/defaults'
import SaveBar from '@/components/SaveBar.vue'

const content = useContentStore()
onMounted(() => content.beginDraft())

function move(i, dir) {
  const list = content.draft.services
  const target = i + dir
  if (target < 0 || target >= list.length) return
  ;[list[i], list[target]] = [list[target], list[i]]
  content.markDirty()
}
function add() {
  content.draft.services.push({
    title: 'New service',
    fiber: content.draft.services.length % 12,
    summary: '',
    items: [],
    isVisible: true,
  })
  content.markDirty()
}
function remove(i) {
  content.draft.services.splice(i, 1)
  content.markDirty()
}
function setItemsText(service, text) {
  service.items = text.split('\n')
  content.markDirty()
}
function toggleVisible(service) {
  const visibleCount = content.draft.services.filter((s) => s.isVisible !== false).length
  if (service.isVisible !== false && visibleCount <= 1) {
    toast.error('At least one service must stay visible.')
    return
  }
  service.isVisible = service.isVisible === false
  content.markDirty()
}
</script>

<template>
  <template v-if="content.draft">
    <div class="ed-list">
      <div v-for="(s, i) in content.draft.services" :key="i" class="ed-row">
        <div class="ed-top">
          <span class="idx">
            <span class="fiber-dot" :style="{ background: fiber(s.fiber)[1], display: 'inline-block', verticalAlign: '-1px', marginRight: '6px' }"></span>
            F{{ String(i + 1).padStart(2, '0') }} · {{ fiber(s.fiber)[0] }}
          </span>
          <button class="icon-btn pressable" type="button" :disabled="i === 0" aria-label="Move up" @click="move(i, -1)">↑</button>
          <button class="icon-btn pressable" type="button" :disabled="i === content.draft.services.length - 1" aria-label="Move down" @click="move(i, 1)">↓</button>
          <button class="icon-btn pressable" type="button" aria-label="Remove service" @click="remove(i)">✕</button>
        </div>
        <div class="fields">
          <label class="f">
            Service name
            <input v-model="s.title" @input="content.markDirty()" />
          </label>
          <label class="f">
            Fibre colour
            <select :value="s.fiber" @change="s.fiber = Number($event.target.value); content.markDirty()">
              <option v-for="(f, k) in FIBERS" :key="f[0]" :value="k">{{ k + 1 }} · {{ f[0] }}</option>
            </select>
          </label>
          <label class="f full">
            Short summary
            <textarea v-model="s.summary" rows="2" @input="content.markDirty()"></textarea>
          </label>
          <label class="f full">
            Capabilities (one per line)
            <textarea :value="s.items.join('\n')" rows="5" @change="setItemsText(s, $event.target.value)"></textarea>
          </label>
          <label class="chk full">
            <input type="checkbox" :checked="s.isVisible !== false" @change="toggleVisible(s)" />
            Show this service on the public website
          </label>
        </div>
      </div>
    </div>
    <button class="btn btn-ghost pressable" style="margin-top:14px" type="button" @click="add">+ Add service</button>
  </template>
  <SaveBar />
</template>

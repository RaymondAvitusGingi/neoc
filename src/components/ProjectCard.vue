<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { fiber } from '@/services/defaults'
import { fmtMonth } from '@/services/text'

const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['open'])

const content = useContentStore()
const serviceFiber = computed(() => {
  const idx = content.content.services.findIndex((s) => s.title === props.project.service)
  return idx < 0 ? null : fiber(content.content.services[idx].fiber)
})
const cover = computed(() => props.project.images?.[0] || null)
</script>

<template>
  <button class="proj pressable" type="button" @click="emit('open', project)">
    <div class="proj-img">
      <img v-if="cover" :src="cover" :alt="project.title" loading="lazy" />
      <div v-else class="ph">No photo</div>
      <span v-if="project.images?.length > 1" class="count">{{ project.images.length }} photos</span>
    </div>
    <div class="proj-body">
      <span v-if="project.service" class="port-tag">
        <span v-if="serviceFiber" class="fiber-dot" :style="{ background: serviceFiber[1] }"></span>{{ project.service }}
      </span>
      <h3>{{ project.title }}</h3>
      <div class="proj-meta">
        <span v-if="project.client">{{ project.client }}</span>
        <span v-if="project.location">{{ project.location }}</span>
        <span v-if="project.date">{{ fmtMonth(project.date) }}</span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { fiber } from '@/services/defaults'
import { slugify } from '@/services/text'
import { useContentStore } from '@/stores/content'

const props = defineProps({
  service: { type: Object, required: true },
  index: { type: Number, required: true },
  linkOnly: { type: Boolean, default: false },
})

const content = useContentStore()
const color = computed(() => fiber(props.service.fiber)[1])
const name = computed(() => fiber(props.service.fiber)[0])
const tag = computed(() => `F${String(props.index + 1).padStart(2, '0')} · ${name.value}`)
const anchor = computed(() => slugify(props.service.title))
const image = computed(() => (props.service.id ? content.serviceImages[props.service.id] : null))
</script>

<template>
  <component
    :is="linkOnly ? 'router-link' : 'article'"
    :to="linkOnly ? { path: '/services', hash: `#${anchor}` } : undefined"
    :id="linkOnly ? undefined : anchor"
    class="port"
  >
    <img v-if="image" :src="image" :alt="service.title" loading="lazy" class="port-img" />
    <span class="port-tag"><span class="fiber-dot" :style="{ background: color }"></span>{{ tag }}</span>
    <h3>{{ service.title }}</h3>
    <p>{{ service.summary }}</p>
    <ul v-if="!linkOnly">
      <li v-for="item in service.items.filter(Boolean)" :key="item">{{ item }}</li>
    </ul>
    <span v-else class="more">{{ service.items.length }} capabilities →</span>
  </component>
</template>

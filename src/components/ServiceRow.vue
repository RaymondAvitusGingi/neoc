<script setup>
import { computed } from 'vue'
import { fiber } from '@/services/defaults'
import { slugify } from '@/services/text'
import { useContentStore } from '@/stores/content'

const props = defineProps({
  service: { type: Object, required: true },
  index: { type: Number, required: true },
})

const content = useContentStore()
const color = computed(() => fiber(props.service.fiber)[1])
const anchor = computed(() => slugify(props.service.title))
const highlights = computed(() => props.service.items.filter(Boolean).slice(0, 3))
const image = computed(() => (props.service.id ? content.serviceImages[props.service.id] : null))
</script>

<template>
  <article class="service-row">
    <div class="service-row-media" :style="{ '--tile': color }">
      <img v-if="image" :src="image" :alt="service.title" loading="lazy" />
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <circle cx="7" cy="7" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none" />
        <path d="M11 7h6M11 17h6" />
      </svg>
    </div>
    <div class="service-row-body">
      <span class="port-tag"><span class="fiber-dot" :style="{ background: color }"></span>F{{ String(index + 1).padStart(2, '0') }} · {{ fiber(service.fiber)[0] }}</span>
      <h3>{{ service.title }}</h3>
      <p>{{ service.summary }}</p>
      <ul class="check-list v">
        <li v-for="item in highlights" :key="item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          {{ item }}
        </li>
      </ul>
      <router-link class="btn btn-primary btn-pill pressable" :to="{ path: '/services', hash: `#${anchor}` }">
        Use this service
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
      </router-link>
    </div>
  </article>
</template>

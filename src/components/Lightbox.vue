<script setup>
import { computed, ref, watch } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { fmtMonth } from '@/services/text'
import { useTestimonialsStore } from '@/stores/testimonials'
import TestimonialCard from './TestimonialCard.vue'

const props = defineProps({
  project: { type: Object, default: null },
  startIndex: { type: Number, default: 0 },
})
const emit = defineEmits(['close'])

const testimonials = useTestimonialsStore()
const index = ref(props.startIndex)
watch(() => props.project, () => { index.value = props.startIndex })

const images = computed(() => props.project?.images || [])
const current = computed(() => images.value[index.value] || null)
const relatedTestimonials = computed(() =>
  testimonials.shown.filter((t) => t.jobId === props.project?.id)
)

function go(delta) {
  if (!images.value.length) return
  index.value = (index.value + delta + images.value.length) % images.value.length
}

onKeyStroke('Escape', () => props.project && emit('close'))
onKeyStroke('ArrowLeft', () => props.project && go(-1))
onKeyStroke('ArrowRight', () => props.project && go(1))

function onBackdrop(e) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="project" class="lb" role="dialog" aria-modal="true" :aria-label="project.title" @mousedown="onBackdrop">
        <div class="lb-box">
          <div class="lb-stage">
            <img v-if="current" :src="current" :alt="`${project.title} photo ${index + 1}`" />
            <div v-else class="ph">No photo</div>
            <button v-if="images.length > 1" class="lb-nav lb-prev" type="button" aria-label="Previous photo" @click="go(-1)">‹</button>
            <button v-if="images.length > 1" class="lb-nav lb-next" type="button" aria-label="Next photo" @click="go(1)">›</button>
          </div>
          <div class="lb-info">
            <button class="btn btn-ghost btn-sm lb-close pressable" type="button" @click="emit('close')">Close ✕</button>
            <span v-if="project.service" class="eyebrow">{{ project.service }}</span>
            <h3>{{ project.title }}</h3>
            <dl class="spec" style="color:var(--ink)">
              <template v-if="project.client"><dt style="color:var(--muted)">Client</dt><dd>{{ project.client }}</dd></template>
              <template v-if="project.location"><dt style="color:var(--muted)">Location</dt><dd>{{ project.location }}</dd></template>
              <template v-if="project.date"><dt style="color:var(--muted)">Completed</dt><dd>{{ fmtMonth(project.date) }}</dd></template>
            </dl>
            <div v-if="project.description" class="prose" style="color:var(--muted);font-size:15px">
              <p v-for="(p, i) in project.description.split(/\n\s*\n/)" :key="i">{{ p }}</p>
            </div>
            <TestimonialCard v-for="t in relatedTestimonials" :key="t.id" :testimonial="t" />
            <template v-if="images.length > 1">
              <div class="lb-thumbs">
                <button
                  v-for="(img, i) in images"
                  :key="i"
                  :class="{ on: i === index }"
                  type="button"
                  :aria-label="`Photo ${i + 1}`"
                  @click="index = i"
                >
                  <img :src="img" alt="" />
                </button>
              </div>
              <span class="note mono">Photo {{ index + 1 }} of {{ images.length }}</span>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

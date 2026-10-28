<script setup>
import { computed } from 'vue'
import { initials } from '@/services/text'
import { useProjectsStore } from '@/stores/projects'

const props = defineProps({
  testimonial: { type: Object, required: true },
  showJobLink: { type: Boolean, default: false },
})
const emit = defineEmits(['openJob'])

const projects = useProjectsStore()
const job = computed(() => (props.testimonial.jobId ? projects.byId(props.testimonial.jobId) : null))
const who = computed(() => [props.testimonial.role, props.testimonial.company].filter(Boolean).join(', '))
const rating = computed(() => Number(props.testimonial.rating) || 0)
</script>

<template>
  <figure class="testi">
    <span v-if="rating" class="stars" role="img" :aria-label="`${rating} out of 5 stars`">
      <template v-for="n in 5" :key="n">{{ n <= rating ? '★' : '☆' }}</template>
    </span>
    <blockquote>{{ testimonial.quote }}</blockquote>
    <figcaption>
      <span class="avatar" aria-hidden="true">{{ initials(testimonial.name) }}</span>
      <span style="min-width:0">
        <strong>{{ testimonial.name }}</strong>
        <span v-if="who" class="note" style="display:block">{{ who }}</span>
      </span>
    </figcaption>
    <button v-if="showJobLink && job" class="testi-job" type="button" @click="emit('openJob', job)">
      Job: {{ job.title }} →
    </button>
  </figure>
</template>

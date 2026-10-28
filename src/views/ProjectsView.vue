<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ProjectCard.vue'
import Lightbox from '@/components/Lightbox.vue'

const projects = useProjectsStore()
const route = useRoute()
const router = useRouter()
const lightboxProject = ref(null)

onMounted(async () => {
  await projects.load()
  if (route.query.job) {
    const found = projects.byId(route.query.job)
    if (found) lightboxProject.value = found
  }
})

function open(project) {
  lightboxProject.value = project
  router.replace({ query: { ...route.query, job: project.id } })
}
function close() {
  lightboxProject.value = null
  const { job, ...rest } = route.query
  router.replace({ query: rest })
}
</script>

<template>
  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Our Jobs</span><h2>Jobs we have completed.</h2></div>
        <p>Network, data centre, power and security installations delivered by the NEOC team. Select a job to see its photos and details.</p>
      </div>

      <template v-if="projects.list.length">
        <div class="filters" role="group" aria-label="Filter jobs by service">
          <button
            v-for="cat in projects.categories"
            :key="cat"
            type="button"
            class="pressable"
            :class="{ on: projects.filter === cat }"
            @click="projects.setFilter(cat)"
          >
            {{ cat }}{{ cat === 'All' ? ` (${projects.list.length})` : '' }}
          </button>
        </div>
        <div class="proj-grid">
          <ProjectCard
            v-for="(p, i) in projects.filtered"
            :key="p.id"
            class="stagger-item"
            :style="{ animationDelay: `${Math.min(i, 8) * 40}ms` }"
            :project="p"
            @open="open"
          />
        </div>
      </template>
      <div v-else class="empty">No jobs have been posted yet. Jobs posted from the admin dashboard appear here straight away.</div>

      <div class="cta-band" style="margin-top:48px">
        <h2>Want results like these for your site?</h2>
        <router-link class="btn btn-primary pressable" to="/contact">Request a quote</router-link>
      </div>
    </div>
  </section>

  <Lightbox :project="lightboxProject" @close="close" />
</template>

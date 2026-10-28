<script setup>
import { computed, onMounted, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProjectsStore } from '@/stores/projects'
import { useTestimonialsStore } from '@/stores/testimonials'
import FiberCanvas from '@/components/FiberCanvas.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import TestimonialCard from '@/components/TestimonialCard.vue'
import Lightbox from '@/components/Lightbox.vue'

const content = useContentStore()
const projects = useProjectsStore()
const testimonials = useTestimonialsStore()
const lightboxProject = ref(null)

onMounted(() => {
  projects.load()
  testimonials.load()
})

const c = computed(() => content.content.company)
const hero = computed(() => content.content.hero)
const headlineHtml = computed(() =>
  hero.value.headline.replace(/(Tanzania(?: and East Africa)?)/, '<em>$1</em>')
)
const visibleServices = computed(() => content.content.services.filter((s) => s.isVisible !== false))
const recent = computed(() => projects.list.slice(0, 3))
const shownTestimonials = computed(() => testimonials.shown.slice(0, 6))
</script>

<template>
  <section class="hero">
    <FiberCanvas />
    <div class="wrap hero-inner">
      <div>
        <span class="eyebrow">{{ hero.eyebrow }}</span>
        <h1 v-html="headlineHtml"></h1>
        <p class="hero-sub">{{ hero.sub }}</p>
        <div class="hero-cta">
          <router-link class="btn btn-primary pressable" to="/contact">Request a quote</router-link>
          <router-link class="btn btn-ghost pressable" to="/services">Explore services</router-link>
        </div>
      </div>
      <div class="hero-card">
        <h3>Company record</h3>
        <dl class="spec">
          <dt>Name</dt><dd>{{ c.name }}</dd>
          <dt>Based in</dt><dd>{{ c.address }}</dd>
          <dt>Reg. No</dt><dd>{{ c.reg }}</dd>
          <dt>TIN</dt><dd>{{ c.tin }}</dd>
          <dt>Established</dt><dd>{{ c.established }}</dd>
          <dt>Phone</dt><dd>{{ c.phone1 }}</dd>
        </dl>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">What we do</span><h2>{{ visibleServices.length }} service lines, one partner.</h2></div>
        <p>Each line below is tagged with a fibre colour from the standard 12-fibre code, the same way our technicians label strands in a cable.</p>
      </div>
      <div class="ports">
        <ServiceCard v-for="(s, i) in visibleServices" :key="s.title" :service="s" :index="i" link-only />
      </div>
    </div>
  </section>

  <section class="block" id="our-jobs">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Our Jobs</span><h2>Jobs we have completed.</h2></div>
        <p>
          Recent installations by the NEOC team, posted straight from our admin dashboard.
          <router-link v-if="projects.list.length" to="/projects">See all {{ projects.list.length }} job{{ projects.list.length === 1 ? '' : 's' }} →</router-link>
        </p>
      </div>
      <div v-if="recent.length" class="proj-grid">
        <ProjectCard v-for="p in recent" :key="p.id" :project="p" @open="lightboxProject = p" />
      </div>
      <div v-else class="empty">Our latest jobs will appear here soon.</div>
    </div>
  </section>

  <section v-if="shownTestimonials.length" class="block" id="testimonials">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Testimonials</span><h2>What our clients say.</h2></div>
        <p>Feedback from organisations we have worked with, shared with their permission.</p>
      </div>
      <div class="testi-grid">
        <TestimonialCard v-for="t in shownTestimonials" :key="t.id" :testimonial="t" show-job-link @open-job="lightboxProject = $event" />
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">How we deliver</span><h2>A structured path from survey to support.</h2></div>
        <p>Every project follows the same six stages, so you always know what has been done and what comes next.</p>
      </div>
      <div class="steps">
        <div v-for="(a, i) in content.content.approach" :key="a.t" class="step">
          <span class="n">STAGE {{ i + 1 }}</span>
          <h3>{{ a.t }}</h3>
          <p>{{ a.d }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Why NEOC</span><h2>Built for long-term partnerships.</h2></div>
        <p>{{ content.content.quality }}</p>
      </div>
      <div class="grid-3">
        <div v-for="w in content.content.why" :key="w.t" class="item">
          <h3>{{ w.t }}</h3>
          <p>{{ w.d }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Who we serve</span><h2>Sectors we work with.</h2></div>
        <p>From telecom operators and banks to schools, clinics and SMEs.</p>
      </div>
      <div class="chips">
        <span v-for="m in content.content.markets" :key="m" class="chip">{{ m }}</span>
      </div>
      <div class="cta-band" style="margin-top:48px">
        <h2>Planning a network, power or security project?</h2>
        <router-link class="btn btn-primary pressable" to="/contact">Talk to our team</router-link>
      </div>
    </div>
  </section>

  <Lightbox :project="lightboxProject" @close="lightboxProject = null" />
</template>

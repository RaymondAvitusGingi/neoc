<script setup>
import { computed, onMounted, ref } from 'vue'
import { useContentStore } from '@/stores/content'
import { useProjectsStore } from '@/stores/projects'
import { useTestimonialsStore } from '@/stores/testimonials'
import FiberCanvas from '@/components/FiberCanvas.vue'
import ServiceRow from '@/components/ServiceRow.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import TestimonialCard from '@/components/TestimonialCard.vue'
import Lightbox from '@/components/Lightbox.vue'

const content = useContentStore()
const projects = useProjectsStore()
const testimonials = useTestimonialsStore()
const lightboxProject = ref(null)

// Decorative mouse-tracking tilt on the hero's device card — fine-pointer
// desktops only (touch "hover" would just stick the tilt in place), and
// skipped entirely under prefers-reduced-motion.
const deviceCardRef = ref(null)
const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onTiltMove(e) {
  if (!canTilt || !deviceCardRef.value) return
  const rect = deviceCardRef.value.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  deviceCardRef.value.style.setProperty('--tiltY', `${px * 10}deg`)
  deviceCardRef.value.style.setProperty('--tiltX', `${py * -10}deg`)
  deviceCardRef.value.style.setProperty('--tiltS', '1.02')
}
function onTiltLeave() {
  if (!deviceCardRef.value) return
  deviceCardRef.value.style.setProperty('--tiltY', '0deg')
  deviceCardRef.value.style.setProperty('--tiltX', '0deg')
  deviceCardRef.value.style.setProperty('--tiltS', '1')
}

onMounted(() => {
  projects.load()
  testimonials.load()
})

const c = computed(() => content.content.company)
const hero = computed(() => content.content.hero)
const visibleServices = computed(() => content.content.services.filter((s) => s.isVisible !== false))
const featuredServices = computed(() => visibleServices.value.slice(0, 4))
const recent = computed(() => projects.list.slice(0, 3))
const shownTestimonials = computed(() => testimonials.shown.slice(0, 6))

const featureIcons = [
  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', // customer focus: target-ish check
  'M13 2 3 14h7l-1 8 10-12h-7l1-8z', // technical capability: bolt
  'M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z', // security: shield
]
const featureItems = computed(() => (content.content.why || []).slice(0, 3))

const statCards = computed(() => [
  { num: String(visibleServices.value.length), lbl: 'Service lines' },
  { num: String(projects.list.length), lbl: 'Jobs completed' },
  { num: String((content.content.markets || []).length), lbl: 'Sectors served' },
  { num: c.value.established, lbl: 'Established' },
])
</script>

<template>
  <section class="hero-light">
    <div class="wrap hero-light-grid">
      <div class="hero-light-panel">
        <svg class="hero-doodle" viewBox="0 0 400 300" aria-hidden="true">
          <path d="M20 40 Q 80 10, 140 40 T 260 40" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 7" stroke-linecap="round" opacity="0.4" />
          <path d="M300 220 Q 340 250, 320 290" fill="none" stroke="var(--signal)" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" opacity="0.4" />
          <circle cx="260" cy="40" r="4" fill="var(--accent)" opacity="0.5" />
        </svg>
        <span class="eyebrow">{{ hero.eyebrow }}</span>
        <h1>{{ hero.headline }}</h1>
        <p class="hero-light-sub">{{ hero.sub }}</p>
        <div class="hero-cta">
          <router-link class="btn btn-primary btn-pill pressable" to="/contact">Request a quote</router-link>
          <router-link class="btn btn-ghost btn-pill pressable" to="/services">Explore services</router-link>
        </div>
        <ul class="check-list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Quick response</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Quality service</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Always on the customer side</li>
        </ul>
      </div>
      <div class="hero-light-art" @mousemove="onTiltMove" @mouseleave="onTiltLeave">
        <div class="device-card" ref="deviceCardRef">
          <FiberCanvas />
        </div>
        <div class="floating-card">
          <h3>Company record</h3>
          <dl class="spec">
            <dt>Name</dt><dd>{{ c.name }}</dd>
            <dt>Reg. No</dt><dd>{{ c.reg }}</dd>
            <dt>TIN</dt><dd>{{ c.tin }}</dd>
            <dt>Established</dt><dd>{{ c.established }}</dd>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="icon-features">
        <div v-for="(w, i) in featureItems" :key="w.t" class="icon-feature">
          <span class="icon-circle" :class="`c${i + 1}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="featureIcons[i]" /></svg>
          </span>
          <h3>{{ w.t }}</h3>
          <p>{{ w.d }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="block" style="padding-top:16px">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">What we do</span><h2>Work of varying complexity, handled end to end.</h2></div>
        <p>{{ visibleServices.length }} service lines, each tagged with a fibre colour from the standard 12-fibre code — the same way our technicians label strands in a cable. <router-link to="/services">See all services →</router-link></p>
      </div>
      <div class="service-rows">
        <ServiceRow v-for="(s, i) in featuredServices" :key="s.title" :service="s" :index="i" />
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

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">NEOC in numbers</span><h2>Where we stand today.</h2></div>
        <p>A new company, built to grow — these are our real, current numbers, not projections.</p>
      </div>
      <div class="stat-counters">
        <div v-for="s in statCards" :key="s.lbl">
          <div class="num">{{ s.num }}</div>
          <div class="lbl">{{ s.lbl }}</div>
        </div>
      </div>
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
          <span class="n">{{ i + 1 }}</span>
          <h3>{{ a.t }}</h3>
          <p>{{ a.d }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="band">
        <div class="sec-head" style="margin-bottom:28px">
          <div><span class="eyebrow">Who we serve</span><h2>Sectors we work with.</h2></div>
          <p>From telecom operators and banks to schools, clinics and SMEs.</p>
        </div>
        <div class="chips">
          <span v-for="m in content.content.markets" :key="m" class="chip">{{ m }}</span>
        </div>
      </div>
      <div class="cta-band" style="margin-top:32px">
        <h2>Planning a network, power or security project?</h2>
        <router-link class="btn btn-primary btn-pill pressable" to="/contact">Talk to our team</router-link>
      </div>
    </div>
  </section>

  <Lightbox :project="lightboxProject" @close="lightboxProject = null" />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContentStore } from '@/stores/content'
import BrandMark from './BrandMark.vue'

const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { open.value = false })

const content = useContentStore()
const phone = computed(() => content.content.company.phone1)
</script>

<template>
  <header class="site-head">
    <div class="wrap head-row">
      <router-link class="brand" to="/" aria-label="NEOC Technology home">
        <BrandMark subline class="head-brand" />
      </router-link>
      <button class="menu-btn pressable" :aria-expanded="open" aria-controls="nav" @click="open = !open">Menu</button>
      <nav class="nav" :class="{ open }" id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/services">Services</router-link>
        <router-link to="/projects">Our Jobs</router-link>
        <router-link to="/contact">Contact</router-link>
      </nav>
      <a class="head-phone" :href="`tel:${phone.replace(/\s+/g, '')}`">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
        </svg>
        <span>{{ phone }}</span>
      </a>
      <router-link class="btn btn-dark btn-pill pressable head-cta" to="/contact">
        <span class="cta-full">Request a quote</span>
        <span class="cta-short">Quote</span>
      </router-link>
    </div>
  </header>
</template>

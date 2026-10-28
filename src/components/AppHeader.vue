<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <header class="site-head">
    <div class="wrap head-row">
      <router-link class="brand" to="/" aria-label="NEOC Technology home">
        <svg class="brand-mark" viewBox="0 0 36 36" aria-hidden="true">
          <rect x="1" y="1" width="34" height="34" rx="8" fill="var(--accent)" />
          <path d="M9 26V10l18 16V10" fill="none" stroke="var(--accent-ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="27" cy="10" r="2.6" fill="var(--signal)" />
        </svg>
        <span><span class="brand-name">NEOC</span><span class="brand-sub">Technology Co. Ltd</span></span>
      </router-link>
      <button class="menu-btn pressable" :aria-expanded="open" aria-controls="nav" @click="open = !open">Menu</button>
      <nav class="nav" :class="{ open }" id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/services">Services</router-link>
        <router-link to="/projects">Our Jobs</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/admin" class="admin-link">Admin</router-link>
      </nav>
    </div>
  </header>
</template>

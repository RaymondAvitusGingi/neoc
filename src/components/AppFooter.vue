<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { FIBERS } from '@/services/defaults'
import { slugify } from '@/services/text'

const content = useContentStore()
const c = computed(() => content.content.company)
const year = new Date().getFullYear()
const services = computed(() => content.content.services.filter((s) => s.isVisible !== false).slice(0, 6))
</script>

<template>
  <footer class="foot">
    <div class="fiber-strip">
      <span v-for="f in FIBERS" :key="f[0]" :style="{ background: f[1] }"></span>
    </div>
    <div class="wrap foot-in">
      <div>
        <router-link to="/" class="brand-name" style="text-decoration:none">NEOC</router-link>
        <p style="margin-top:10px;max-width:38ch">{{ c.tagline }}</p>
        <p style="margin-top:10px" class="mono">{{ c.address }}<br />{{ c.postal }}</p>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li v-for="s in services" :key="s.title">
            <router-link :to="{ path: '/services', hash: `#${slugify(s.title)}` }">{{ s.title }}</router-link>
          </li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><router-link to="/about">About us</router-link></li>
          <li><router-link to="/projects">Our Jobs</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <li><router-link to="/privacy">Privacy Policy</router-link></li>
          <li><router-link to="/admin">Admin</router-link></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a :href="`tel:${c.phone1.replace(/\s+/g, '')}`">{{ c.phone1 }}</a></li>
          <li><a :href="`tel:${c.phone2.replace(/\s+/g, '')}`">{{ c.phone2 }}</a></li>
          <li><a :href="`mailto:${c.email}`">{{ c.email }}</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap foot-bot">
      <span>© {{ year }} {{ c.name }}</span>
      <span>Reg. No {{ c.reg }} · TIN {{ c.tin }}</span>
    </div>
  </footer>
</template>

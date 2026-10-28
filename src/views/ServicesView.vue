<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import ServiceCard from '@/components/ServiceCard.vue'

const content = useContentStore()
const visibleServices = computed(() => content.content.services.filter((s) => s.isVisible !== false))
</script>

<template>
  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Products &amp; services</span><h2>Everything from the server rack to the perimeter fence.</h2></div>
        <p>All equipment supplied is subject to product specifications, availability, warranty conditions, and agreed procurement terms.</p>
      </div>
      <div class="ports">
        <ServiceCard v-for="(s, i) in visibleServices" :key="s.title" :service="s" :index="i" />
      </div>
      <div class="cta-band" style="margin-top:48px">
        <h2>Need a site survey or a quotation?</h2>
        <router-link class="btn btn-primary btn-pill pressable" to="/contact">Send a request</router-link>
      </div>
    </div>
  </section>
</template>

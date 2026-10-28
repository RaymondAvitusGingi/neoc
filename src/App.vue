<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import WhatsAppFloat from '@/components/WhatsAppFloat.vue'
import { useContentStore } from '@/stores/content'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const content = useContentStore()
const auth = useAuthStore()
const isAdmin = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  content.load()
  auth.init()
})
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppHeader />
  <main id="main">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter v-if="!isAdmin" />
  <WhatsAppFloat v-if="!isAdmin" />
  <Toaster position="bottom-center" rich-colors close-button />
</template>

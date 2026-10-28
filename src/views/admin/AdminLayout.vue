<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { ROLES } from '@/services/defaults'
import { initials } from '@/services/text'

const TABS = [
  { name: 'admin-dashboard', label: 'Dashboard', roles: ['superadmin', 'editor', 'viewer'] },
  { name: 'admin-company', label: 'Company info', roles: ['superadmin', 'editor'] },
  { name: 'admin-home', label: 'Home page', roles: ['superadmin', 'editor'] },
  { name: 'admin-about', label: 'About & values', roles: ['superadmin', 'editor'] },
  { name: 'admin-services', label: 'Services', roles: ['superadmin', 'editor'] },
  { name: 'admin-process', label: 'Approach & why us', roles: ['superadmin', 'editor'] },
  { name: 'admin-markets', label: 'Markets', roles: ['superadmin', 'editor'] },
  { name: 'admin-projects', label: 'Our Jobs', roles: ['superadmin', 'editor', 'viewer'] },
  { name: 'admin-testimonials', label: 'Testimonials', roles: ['superadmin', 'editor', 'viewer'] },
  { name: 'admin-messages', label: 'Messages', roles: ['superadmin', 'editor', 'viewer'] },
  { name: 'admin-users', label: 'Users', roles: ['superadmin'] },
]

const auth = useAuthStore()
const messages = useMessagesStore()
const route = useRoute()
const router = useRouter()

onMounted(() => messages.load())

const visibleTabs = computed(() => TABS.filter((t) => t.roles.includes(auth.role)))
const title = computed(() => route.meta?.title || 'Dashboard')

async function signOut() {
  await auth.logout()
  router.replace({ name: 'admin-login' })
}
</script>

<template>
  <div class="admin">
    <aside class="side">
      <span class="lbl">Manage</span>
      <router-link
        v-for="tab in visibleTabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button type="button" :class="{ on: isActive }" @click="navigate">
          {{ tab.label }}
          <span v-if="tab.name === 'admin-messages' && messages.unreadCount" class="badge">{{ messages.unreadCount }}</span>
        </button>
      </router-link>

      <span class="lbl" style="margin-top:14px">Account</span>
      <div class="me-card">
        <span class="avatar" aria-hidden="true">{{ initials(auth.me?.name) }}</span>
        <span style="min-width:0">
          <strong>{{ auth.me?.name }}</strong>
          <span class="note" style="display:block">{{ ROLES[auth.role]?.label }}</span>
        </span>
      </div>
      <button type="button" @click="signOut">Sign out</button>
    </aside>

    <div class="main">
      <div class="main-head">
        <h2>{{ title }}</h2>
        <router-link class="btn btn-ghost btn-sm pressable" to="/">View website ↗</router-link>
      </div>
      <div v-if="auth.role === 'viewer'" class="mode">
        <span class="dot" style="background:var(--muted)"></span>
        <span>Your role is Viewer. Ask a Super Admin for Editor access to change content.</span>
      </div>
      <router-view />
    </div>
  </div>
</template>

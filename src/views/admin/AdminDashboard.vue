<script setup>
import { computed, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { useMessagesStore } from '@/stores/messages'
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import StatTile from '@/components/StatTile.vue'
import { fmtDate } from '@/services/text'

const content = useContentStore()
const messages = useMessagesStore()
const projects = useProjectsStore()
const auth = useAuthStore()

onMounted(() => {
  projects.load()
  messages.load()
})

const recentMessages = computed(() => messages.list.slice(0, 3))
</script>

<template>
  <div class="stats">
    <StatTile :value="content.content.services.length" label="Service lines" />
    <StatTile :value="messages.list.length" label="Messages received" />
    <StatTile :value="messages.unreadCount" label="Unread messages" color="var(--signal)" />
    <StatTile :value="projects.list.length" label="Jobs posted" />
  </div>

  <div class="card">
    <h3 style="font-size:18px;margin-bottom:8px">Quick actions</h3>
    <p class="note" style="margin-bottom:14px">Last published update: {{ fmtDate(content.content.updatedAt) }}</p>
    <div style="display:flex;flex-wrap:wrap;gap:10px">
      <template v-if="auth.role !== 'viewer'">
        <router-link class="btn btn-ghost pressable" :to="{ name: 'admin-home' }">Edit hero text</router-link>
        <router-link class="btn btn-ghost pressable" :to="{ name: 'admin-services' }">Manage services</router-link>
        <router-link class="btn btn-ghost pressable" :to="{ name: 'admin-projects' }">Post a job</router-link>
        <router-link class="btn btn-ghost pressable" :to="{ name: 'admin-testimonials' }">Add a testimonial</router-link>
      </template>
      <router-link v-else class="btn btn-ghost pressable" :to="{ name: 'admin-projects' }">See jobs</router-link>
      <router-link class="btn btn-ghost pressable" :to="{ name: 'admin-messages' }">Read messages</router-link>
      <router-link v-if="auth.isSuper" class="btn btn-ghost pressable" :to="{ name: 'admin-users' }">Manage users</router-link>
      <router-link class="btn btn-primary pressable" to="/">View website</router-link>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <h3 style="font-size:18px;margin-bottom:12px">Recent messages</h3>
    <p v-if="!recentMessages.length" class="note">No messages yet. Enquiries sent from the Contact page appear here.</p>
    <div v-for="m in recentMessages" :key="m.key" style="padding:10px 0;border-top:1px solid var(--line)">
      <strong>{{ m.name }}</strong> <span class="msg-meta">{{ m.service || 'General' }} · {{ fmtDate(m.at) }}</span>
      <div class="note" style="overflow-wrap:anywhere">{{ m.message.slice(0, 140) }}</div>
    </div>
  </div>
</template>

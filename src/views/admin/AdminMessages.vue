<script setup>
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import ConfirmButton from '@/components/ConfirmButton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { fmtDate } from '@/services/text'

const auth = useAuthStore()
const messages = useMessagesStore()
messages.load()

async function toggleRead(m) {
  await messages.markRead(m.key, !m.read)
}
async function remove(key) {
  await messages.remove(key)
  toast('Message deleted.')
}
function exportCsv() {
  const header = ['Date', 'Name', 'Organisation', 'Email', 'Phone', 'Service', 'Message', 'Status']
  const rows = messages.list.map((m) => [
    new Date(m.at).toISOString(), m.name, m.org, m.email, m.phone, m.service, m.message.replace(/\n/g, ' '), m.status,
  ])
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `neoc-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div v-if="messages.list.length" style="margin-bottom:16px;display:flex;justify-content:flex-end">
    <button class="btn btn-ghost btn-sm pressable" type="button" @click="exportCsv">Export to CSV</button>
  </div>
  <EmptyState v-if="!messages.list.length" text="No messages yet. When someone sends the form on the Contact page, it shows up here." />
  <div v-else class="ed-list">
    <div v-for="m in messages.list" :key="m.key" v-reveal class="msg" :class="{ unread: !m.read }">
      <div class="msg-h">
        <strong>{{ m.name }}</strong>
        <span class="msg-meta">{{ m.org }}</span>
        <span class="msg-meta" style="margin-left:auto">{{ fmtDate(m.at) }}</span>
      </div>
      <div class="msg-meta">{{ m.service || 'General enquiry' }} · {{ m.email || 'no email' }} · {{ m.phone || 'no phone' }}</div>
      <div class="msg-body">{{ m.message }}</div>
      <div class="msg-act">
        <button v-if="auth.canWrite" class="btn btn-ghost btn-sm pressable" type="button" @click="toggleRead(m)">
          {{ m.read ? 'Mark unread' : 'Mark as read' }}
        </button>
        <ConfirmButton v-if="auth.isSuper" label="Delete" message="Delete this message?" @confirm="remove(m.key)" />
      </div>
    </div>
  </div>
</template>

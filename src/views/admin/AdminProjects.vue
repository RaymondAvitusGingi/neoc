<script setup>
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useContentStore } from '@/stores/content'
import { resizeImage } from '@/services/image'
import { fmtDate } from '@/services/text'
import ConfirmButton from '@/components/ConfirmButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const auth = useAuthStore()
const projects = useProjectsStore()
const content = useContentStore()
projects.load()

const form = reactive({ title: '', client: '', location: '', service: '', date: '', description: '' })
const uploads = ref([])
const dragOver = ref(false)
const busy = ref(false)
const fileInput = ref(null)

async function handleFiles(fileList) {
  const files = [...fileList].slice(0, 8 - uploads.value.length)
  if (!files.length) return
  for (const file of files) {
    try {
      const { dataUrl } = await resizeImage(file)
      uploads.value.push(dataUrl)
    } catch {
      toast.error(`Could not read ${file.name}`)
    }
  }
}
function onDrop(e) {
  dragOver.value = false
  handleFiles(e.dataTransfer.files)
}
function removeUpload(i) {
  uploads.value.splice(i, 1)
}

async function submit() {
  if (!form.title.trim()) return toast.error('A job title is required.')
  if (!uploads.value.length) return toast.error('Add at least one photo.')
  busy.value = true
  try {
    await projects.create({ ...form, images: uploads.value })
    toast.success('Job posted', { description: 'It now appears on Home and Our Jobs.' })
    Object.assign(form, { title: '', client: '', location: '', service: '', date: '', description: '' })
    uploads.value = []
  } finally {
    busy.value = false
  }
}

async function remove(id) {
  await projects.remove(id)
  toast('Job deleted.')
}
</script>

<template>
  <form v-if="auth.canWrite" class="card" novalidate @submit.prevent="submit">
    <h3 style="font-size:19px;margin-bottom:14px">Post a completed job</h3>
    <p class="note" style="margin:-6px 0 14px">It appears on the Home page and the Our Jobs page as soon as you post it.</p>
    <div class="fields">
      <label class="f full">Job title *<input v-model="form.title" maxlength="90" placeholder="e.g. Fibre backbone for head office" /></label>
      <label class="f">Client<input v-model="form.client" placeholder="Client or sector" /></label>
      <label class="f">Location<input v-model="form.location" placeholder="e.g. Dar es Salaam" /></label>
      <label class="f">
        Service
        <select v-model="form.service">
          <option value="">Select a service</option>
          <option v-for="s in content.content.services" :key="s.title" :value="s.title">{{ s.title }}</option>
        </select>
      </label>
      <label class="f">Completed<input v-model="form.date" type="month" /></label>
      <label class="f full">Description<textarea v-model="form.description" rows="4" placeholder="Scope of work, equipment installed, result for the client."></textarea></label>
      <div class="full">
        <label
          class="drop"
          :class="{ over: dragOver }"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="onDrop"
          @click="fileInput.click()"
        >
          <strong>Choose photos</strong> or drop them here<br />
          <span class="note">JPG, PNG or WebP · up to 8 photos · resized automatically</span>
        </label>
        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden @change="handleFiles($event.target.files)" />
        <div class="thumbs">
          <div v-for="(src, i) in uploads" :key="i" class="thumb">
            <img :src="src" :alt="`Selected photo ${i + 1}`" />
            <button type="button" aria-label="Remove photo" @click="removeUpload(i)">✕</button>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-primary pressable" type="submit" :disabled="busy">{{ busy ? 'Posting…' : 'Post job' }}</button>
      <span class="note">{{ uploads.length }} photo{{ uploads.length === 1 ? '' : 's' }} selected</span>
    </div>
  </form>
  <div v-else class="mode"><span class="dot" style="background:var(--muted)"></span><span>View only: only the owner or an Editor can post or delete jobs.</span></div>

  <h3 style="font-size:20px;margin:28px 0 14px">Posted jobs ({{ projects.list.length }})</h3>
  <div v-if="projects.list.length" class="ed-list">
    <div v-for="p in projects.list" :key="p.id" v-reveal class="adm-proj">
      <div class="pi">
        <img v-if="p.images?.[0]" :src="p.images[0]" alt="" />
        <div v-else class="ph">No photo</div>
      </div>
      <div style="min-width:0">
        <strong>{{ p.title }}</strong>
        <div class="proj-meta">{{ p.service || 'No service' }} · {{ p.client || '—' }} · {{ (p.images || []).length }} photos · added {{ fmtDate(p.createdAt) }}</div>
      </div>
      <div class="act">
        <ConfirmButton v-if="auth.canWrite" label="Delete" message="Delete this job and its photos?" @confirm="remove(p.id)" />
      </div>
    </div>
  </div>
  <EmptyState v-else text="No jobs posted yet. Post your first completed job with the form above." />
</template>

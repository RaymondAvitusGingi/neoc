<script setup>
import { computed, reactive, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useTestimonialsStore } from '@/stores/testimonials'
import { useProjectsStore } from '@/stores/projects'
import ConfirmButton from '@/components/ConfirmButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const auth = useAuthStore()
const testimonials = useTestimonialsStore()
const projects = useProjectsStore()
testimonials.load()
projects.load()

const blank = () => ({ name: '', role: '', company: '', rating: 0, quote: '', jobId: '', ok: false, visible: true })
const form = reactive(blank())

const editing = computed(() => (testimonials.editingId ? testimonials.list.find((t) => t.id === testimonials.editingId) : null))
watch(editing, (t) => Object.assign(form, t ? { ...t, jobId: t.jobId || '' } : blank()), { immediate: true })

async function submit() {
  if (!form.name.trim()) return toast.error("The client's name is required.")
  if (!form.quote.trim()) return toast.error('Add what the client said.')
  if (!form.ok) return toast.error('Confirm the client agreed to be quoted before publishing.')
  await testimonials.save({ ...form, id: testimonials.editingId || undefined, jobId: form.jobId || null })
  Object.assign(form, blank())
  toast.success(testimonials.editingId ? 'Testimonial updated.' : 'Testimonial added.')
}
function cancelEdit() {
  testimonials.cancelEdit()
  Object.assign(form, blank())
}
async function remove(id) {
  await testimonials.remove(id)
  toast('Testimonial deleted.')
}
</script>

<template>
  <form v-if="auth.canWrite" class="card" novalidate @submit.prevent="submit">
    <h3 style="font-size:19px;margin-bottom:4px">{{ editing ? 'Edit testimonial' : 'Add a testimonial' }}</h3>
    <p class="note" style="margin-bottom:14px">Use the client's real words, and only with their permission.</p>
    <div class="fields">
      <label class="f">Client name *<input v-model="form.name" maxlength="60" placeholder="Person who gave the feedback" /></label>
      <label class="f">Job title<input v-model="form.role" maxlength="60" placeholder="e.g. IT Manager" /></label>
      <label class="f">Organisation<input v-model="form.company" maxlength="80" placeholder="Company or institution" /></label>
      <label class="f">
        Rating
        <select v-model.number="form.rating">
          <option value="0">No rating</option>
          <option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">{{ n }} star{{ n > 1 ? 's' : '' }}</option>
        </select>
      </label>
      <label class="f full">
        What the client said * <span class="note">{{ form.quote.length }}/400</span>
        <textarea v-model="form.quote" rows="4" maxlength="400" placeholder="Their feedback in their own words, up to 400 characters."></textarea>
      </label>
      <label class="f full">
        Related job
        <select v-model="form.jobId">
          <option value="">Not linked to a job</option>
          <option v-for="p in projects.list" :key="p.id" :value="p.id">{{ p.title }}</option>
        </select>
      </label>
      <label class="chk full"><input type="checkbox" v-model="form.ok" /> The client agreed to have this quote and their name shown on the website.</label>
      <label class="chk full"><input type="checkbox" v-model="form.visible" /> Show on the website</label>
    </div>
    <div style="display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-primary pressable" type="submit">{{ editing ? 'Save changes' : 'Add testimonial' }}</button>
      <button v-if="editing" class="btn btn-ghost pressable" type="button" @click="cancelEdit">Cancel editing</button>
    </div>
  </form>
  <div v-else class="mode"><span class="dot" style="background:var(--muted)"></span><span>Your role is Viewer. Ask a Super Admin for Editor access to add or change testimonials.</span></div>

  <h3 style="font-size:20px;margin:28px 0 14px">Testimonials ({{ testimonials.list.length }})</h3>
  <div v-if="testimonials.list.length" class="ed-list">
    <div v-for="t in testimonials.sorted" :key="t.id" class="t-row" :class="{ off: !t.visible }">
      <div style="min-width:0">
        <div class="t-q">"{{ t.quote }}"</div>
        <div class="proj-meta">
          <strong style="font-family:var(--f-body);color:var(--ink)">{{ t.name }}</strong>
          <span v-if="t.role">{{ t.role }}</span>
          <span v-if="t.company">{{ t.company }}</span>
          <span v-if="t.rating">{{ t.rating }}/5</span>
          <span class="pill">{{ t.visible ? 'Shown' : 'Hidden' }}</span>
        </div>
      </div>
      <div v-if="auth.canWrite" class="act">
        <button class="btn btn-ghost btn-sm pressable" type="button" @click="testimonials.edit(t.id)">Edit</button>
        <button class="btn btn-ghost btn-sm pressable" type="button" @click="testimonials.toggleVisible(t.id)">{{ t.visible ? 'Hide' : 'Show' }}</button>
        <ConfirmButton label="Delete" message="Delete this testimonial?" @confirm="remove(t.id)" />
      </div>
    </div>
  </div>
  <EmptyState v-else text="No testimonials yet. When a client is happy with a job, ask if you may quote them, then add it here." />
</template>

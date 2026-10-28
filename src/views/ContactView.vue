<script setup>
import { computed, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useContentStore } from '@/stores/content'
import { useMessagesStore } from '@/stores/messages'

const content = useContentStore()
const messages = useMessagesStore()
const c = computed(() => content.content.company)

const form = reactive({ name: '', org: '', email: '', phone: '', service: '', message: '' })
const errors = reactive({})
const sending = ref(false)
const sent = ref(false)
const sendError = ref('')

function validate() {
  const e = {}
  if (!form.name.trim()) e.name = 'Please tell us your name.'
  if (!form.message.trim()) e.message = 'Please add a short message.'
  if (!form.email.trim() && !form.phone.trim()) {
    e.email = 'Add an email or phone number so we can reply.'
    e.phone = 'Add an email or phone number so we can reply.'
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    e.email = 'That email address does not look right.'
  }
  Object.keys(errors).forEach((k) => delete errors[k])
  Object.assign(errors, e)
  return Object.keys(e).length === 0
}

async function submit() {
  sendError.value = ''
  if (!validate()) return
  sending.value = true
  try {
    await messages.send({ ...form })
    sent.value = true
    toast.success('Message sent', { description: "We reply within one working day." })
    Object.assign(form, { name: '', org: '', email: '', phone: '', service: '', message: '' })
  } catch (e) {
    sendError.value = e.message || 'Something went wrong. Please call or email us directly.'
  } finally {
    sending.value = false
  }
}

async function copy(value) {
  try {
    await navigator.clipboard.writeText(value)
    toast('Copied', { description: value })
  } catch {
    toast.error('Could not copy — select and copy manually.')
  }
}

const visibleServices = computed(() => content.content.services.filter((s) => s.isVisible !== false))
const mapSrc = computed(
  () => `https://www.google.com/maps?q=${encodeURIComponent(c.value.address)}&output=embed`
)
</script>

<template>
  <section class="block">
    <div class="wrap">
      <span class="eyebrow">Contact</span>
      <h2 style="font-size:clamp(32px,4.5vw,52px);font-weight:800;margin:10px 0 12px;max-width:18ch">Let's talk about your project.</h2>
      <p class="note" style="font-size:16px;margin-bottom:32px;max-width:52ch">Write to us, call, or send the form below — we reply within one working day.</p>

      <div class="contact">
        <div class="c-list">
          <div class="c-row">
            <div><div class="lab">Phone</div><div class="val"><a :href="`tel:${c.phone1.replace(/\s+/g,'')}`">{{ c.phone1 }}</a></div></div>
            <button class="btn btn-ghost btn-sm pressable" type="button" @click="copy(c.phone1)">Copy</button>
          </div>
          <div class="c-row">
            <div><div class="lab">Phone</div><div class="val"><a :href="`tel:${c.phone2.replace(/\s+/g,'')}`">{{ c.phone2 }}</a></div></div>
            <button class="btn btn-ghost btn-sm pressable" type="button" @click="copy(c.phone2)">Copy</button>
          </div>
          <div class="c-row">
            <div><div class="lab">Email</div><div class="val"><a :href="`mailto:${c.email}`">{{ c.email }}</a></div></div>
            <button class="btn btn-ghost btn-sm pressable" type="button" @click="copy(c.email)">Copy</button>
          </div>
          <div class="c-row">
            <div><div class="lab">Office</div><div class="val">{{ c.address }}</div></div>
            <button class="btn btn-ghost btn-sm pressable" type="button" @click="copy(c.address)">Copy</button>
          </div>
          <div class="c-row">
            <div><div class="lab">Postal</div><div class="val">{{ c.postal }}</div></div>
            <button class="btn btn-ghost btn-sm pressable" type="button" @click="copy(c.postal)">Copy</button>
          </div>

          <a class="wa-btn pressable" href="https://wa.me/255629101982" target="_blank" rel="noopener">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 6.3A8.9 8.9 0 0 0 12 4.1 8.9 8.9 0 0 0 3.5 17l-1 3.7 3.8-1A8.9 8.9 0 0 0 20.9 12 8.9 8.9 0 0 0 17.6 6.3Z"/></svg>
            Chat on WhatsApp
          </a>

          <div class="table-wrap" style="overflow:hidden">
            <iframe
              :src="mapSrc"
              width="100%"
              height="220"
              style="border:0;display:block"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="NEOC office location"
            ></iframe>
          </div>
        </div>

        <form novalidate @submit.prevent="submit" style="padding-top:4px">
          <h3 style="font-size:clamp(22px,2.6vw,28px);font-weight:800;margin-bottom:20px">Send us a message</h3>
          <template v-if="sent">
            <div class="form-msg ok">Thanks, {{ form.name || 'there' }} — your message is with our team. We reply within one working day.</div>
          </template>
          <div class="fields">
            <label class="f underline">
              Full name *
              <input v-model="form.name" required autocomplete="name" :class="{ err: errors.name }" />
              <span v-if="errors.name" class="field-err">{{ errors.name }}</span>
            </label>
            <label class="f underline">
              Organisation
              <input v-model="form.org" autocomplete="organization" />
            </label>
            <label class="f underline">
              Email
              <input v-model="form.email" type="email" autocomplete="email" :class="{ err: errors.email }" />
              <span v-if="errors.email" class="field-err">{{ errors.email }}</span>
            </label>
            <label class="f underline">
              Phone
              <input v-model="form.phone" type="tel" autocomplete="tel" placeholder="+255 …" :class="{ err: errors.phone }" />
              <span v-if="errors.phone" class="field-err">{{ errors.phone }}</span>
            </label>
            <label class="f underline full">
              Service needed
              <select v-model="form.service">
                <option value="">Select a service</option>
                <option v-for="s in visibleServices" :key="s.title" :value="s.title">{{ s.title }}</option>
                <option>Other</option>
              </select>
            </label>
            <label class="f underline full">
              Message *
              <textarea v-model="form.message" required placeholder="Tell us about the site, scope and timeline." :class="{ err: errors.message }"></textarea>
              <span v-if="errors.message" class="field-err">{{ errors.message }}</span>
            </label>
          </div>
          <div style="display:flex;gap:12px;align-items:center;margin-top:24px;flex-wrap:wrap">
            <button class="btn btn-primary btn-pill pressable" type="submit" :disabled="sending">{{ sending ? 'Sending…' : 'Send message' }}</button>
            <span class="note">We reply within one working day.</span>
          </div>
          <div v-if="sendError" class="form-msg err" style="margin-top:12px">
            {{ sendError }} You can also reach us at {{ c.phone1 }} or {{ c.email }}.
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useContentStore } from '@/stores/content'
import { useAuthStore } from '@/stores/auth'
import { fmtDate } from '@/services/text'

const content = useContentStore()
const auth = useAuthStore()
const confirmingReset = ref(false)
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await content.save(auth.me?.username)
    toast.success('Published', { description: 'Your changes are now live on the website.' })
  } catch (e) {
    toast.error('Could not save', { description: e.message })
  } finally {
    saving.value = false
  }
}

async function restoreDefaults() {
  await content.restoreDefaults()
  confirmingReset.value = false
  toast('Restored the original company-profile content.')
}
</script>

<template>
  <div class="savebar">
    <span class="st" :class="{ dirty: content.dirty }">
      {{ content.dirty ? 'Unsaved changes' : `All changes saved · last update ${fmtDate(content.content.updatedAt)}` }}
    </span>

    <span v-if="confirmingReset" style="display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap">
      <span class="note">Restore the original profile content?</span>
      <button class="btn btn-danger btn-sm pressable" type="button" @click="restoreDefaults">Yes, restore</button>
      <button class="btn btn-ghost btn-sm pressable" type="button" @click="confirmingReset = false">Cancel</button>
    </span>
    <button v-else class="btn btn-ghost btn-sm pressable" type="button" @click="confirmingReset = true">Restore defaults</button>

    <button class="btn btn-ghost btn-sm pressable" type="button" :disabled="!content.dirty" @click="content.discard()">Discard</button>
    <button class="btn btn-primary btn-sm pressable" type="button" :disabled="!content.dirty || !auth.canWrite || saving" @click="save">
      {{ saving ? 'Publishing…' : 'Save & publish' }}
    </button>
  </div>
</template>

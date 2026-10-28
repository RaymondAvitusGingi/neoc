<script setup>
import { onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import SaveBar from '@/components/SaveBar.vue'

const content = useContentStore()
onMounted(() => content.beginDraft())
</script>

<template>
  <div v-if="content.draft" class="card">
    <div class="fields">
      <label class="f full">Company name<input v-model="content.draft.company.name" @input="content.markDirty()" /></label>
      <label class="f full">Tagline<input v-model="content.draft.company.tagline" @input="content.markDirty()" /></label>
      <label class="f">Phone 1<input v-model="content.draft.company.phone1" @input="content.markDirty()" /></label>
      <label class="f">Phone 2<input v-model="content.draft.company.phone2" @input="content.markDirty()" /></label>
      <label class="f">Email<input v-model="content.draft.company.email" type="email" @input="content.markDirty()" /></label>
      <label class="f">Postal address<input v-model="content.draft.company.postal" @input="content.markDirty()" /></label>
      <label class="f full">Physical address<input v-model="content.draft.company.address" @input="content.markDirty()" /></label>
      <label class="f">Registration number<input v-model="content.draft.company.reg" @input="content.markDirty()" /></label>
      <label class="f">TIN<input v-model="content.draft.company.tin" @input="content.markDirty()" /></label>
      <label class="f">Managing Director<input v-model="content.draft.company.md" @input="content.markDirty()" /></label>
      <label class="f">Year established<input v-model="content.draft.company.established" @input="content.markDirty()" /></label>
      <label class="f">Country of registration<input v-model="content.draft.company.country" @input="content.markDirty()" /></label>
    </div>
  </div>
  <SaveBar />
</template>

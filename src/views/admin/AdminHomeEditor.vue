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
      <label class="f full">
        Small label above headline
        <input v-model="content.draft.hero.eyebrow" @input="content.markDirty()" />
      </label>
      <label class="f full">
        Headline
        <span class="note" style="align-self:flex-end">{{ content.draft.hero.headline.length }}/90</span>
        <input v-model="content.draft.hero.headline" maxlength="90" @input="content.markDirty()" />
      </label>
      <label class="f full">
        Supporting text
        <textarea v-model="content.draft.hero.sub" rows="3" @input="content.markDirty()"></textarea>
      </label>
      <label class="f full">
        Quality & security statement
        <textarea v-model="content.draft.quality" rows="4" @input="content.markDirty()"></textarea>
      </label>
    </div>
  </div>
  <SaveBar />
</template>

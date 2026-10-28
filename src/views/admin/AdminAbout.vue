<script setup>
import { onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import SaveBar from '@/components/SaveBar.vue'
import ListEditor from '@/components/ListEditor.vue'

const content = useContentStore()
onMounted(() => content.beginDraft())
</script>

<template>
  <template v-if="content.draft">
    <div class="card">
      <div class="fields">
        <label class="f full">
          About the company (blank line between paragraphs)
          <textarea v-model="content.draft.about" rows="9" @input="content.markDirty()"></textarea>
        </label>
        <label class="f full">
          Vision
          <textarea v-model="content.draft.vision" rows="3" @input="content.markDirty()"></textarea>
        </label>
        <label class="f full">
          Mission
          <textarea v-model="content.draft.mission" rows="3" @input="content.markDirty()"></textarea>
        </label>
      </div>
    </div>
    <h3 style="font-size:20px;margin:28px 0 14px">Core values</h3>
    <ListEditor :items="content.draft.values" label="Value" />
  </template>
  <SaveBar />
</template>

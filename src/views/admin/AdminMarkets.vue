<script setup>
import { onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import SaveBar from '@/components/SaveBar.vue'

const content = useContentStore()
onMounted(() => content.beginDraft())

function setMarkets(text) {
  content.draft.markets = text.split('\n')
  content.markDirty()
}
</script>

<template>
  <div v-if="content.draft" class="card">
    <div class="fields">
      <label class="f full">
        Target sectors (one per line)
        <textarea :value="content.draft.markets.join('\n')" rows="11" @change="setMarkets($event.target.value)"></textarea>
      </label>
    </div>
  </div>
  <SaveBar />
</template>

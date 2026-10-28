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
    <h3 style="font-size:20px;margin-bottom:14px">Project delivery stages</h3>
    <ListEditor :items="content.draft.approach" label="Stage" />
    <h3 style="font-size:20px;margin:32px 0 14px">Why choose NEOC</h3>
    <ListEditor :items="content.draft.why" label="Reason" />
  </template>
  <SaveBar />
</template>

<script setup>
defineProps({ text: { type: String, required: true } })
</script>
<template>
  <div class="empty">{{ text }}</div>
</template>

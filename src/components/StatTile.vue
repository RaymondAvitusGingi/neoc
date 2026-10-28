<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  color: { type: String, default: '' },
})
</script>
<template>
  <div class="stat">
    <div class="v" :style="color ? { color } : {}">{{ value }}</div>
    <div class="l">{{ label }}</div>
  </div>
</template>

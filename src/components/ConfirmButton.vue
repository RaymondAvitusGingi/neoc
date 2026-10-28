<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  message: { type: String, default: 'Are you sure?' },
  confirmLabel: { type: String, default: 'Yes, delete' },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'sm' },
})
const emit = defineEmits(['confirm'])
const confirming = ref(false)
</script>

<template>
  <span v-if="confirming" style="display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap">
    <span class="note">{{ message }}</span>
    <button class="btn btn-danger pressable" :class="size === 'sm' ? 'btn-sm' : ''" type="button" @click="confirming = false; emit('confirm')">
      {{ confirmLabel }}
    </button>
    <button class="btn btn-ghost pressable" :class="size === 'sm' ? 'btn-sm' : ''" type="button" @click="confirming = false">Cancel</button>
  </span>
  <button
    v-else
    class="btn btn-danger pressable"
    :class="size === 'sm' ? 'btn-sm' : ''"
    type="button"
    :disabled="disabled"
    @click="confirming = true"
  >
    {{ label }}
  </button>
</template>

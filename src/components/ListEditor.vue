<script setup>
import { useContentStore } from '@/stores/content'

const props = defineProps({
  items: { type: Array, required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const content = useContentStore()

function add() {
  props.items.push({ t: '', d: '' })
  content.markDirty()
}
function remove(i) {
  props.items.splice(i, 1)
  content.markDirty()
}
function move(i, dir) {
  const target = i + dir
  if (target < 0 || target >= props.items.length) return
  ;[props.items[i], props.items[target]] = [props.items[target], props.items[i]]
  content.markDirty()
}
</script>

<template>
  <div class="ed-list">
    <div v-for="(item, i) in items" :key="i" v-reveal class="ed-row">
      <div class="ed-top">
        <span class="idx">{{ label }} {{ i + 1 }}</span>
        <button class="icon-btn pressable" type="button" :disabled="disabled || i === 0" aria-label="Move up" @click="move(i, -1)">↑</button>
        <button class="icon-btn pressable" type="button" :disabled="disabled || i === items.length - 1" aria-label="Move down" @click="move(i, 1)">↓</button>
        <button class="icon-btn pressable" type="button" :disabled="disabled" aria-label="Remove" @click="remove(i)">✕</button>
      </div>
      <div class="fields">
        <label class="f full">
          Title
          <input v-model="item.t" :disabled="disabled" @input="content.markDirty()" />
        </label>
        <label class="f full">
          Description
          <textarea v-model="item.d" rows="2" :disabled="disabled" @input="content.markDirty()"></textarea>
        </label>
      </div>
    </div>
  </div>
  <button v-if="!disabled" class="btn btn-ghost pressable" style="margin-top:14px" type="button" @click="add">
    + Add {{ label.toLowerCase() }}
  </button>
</template>

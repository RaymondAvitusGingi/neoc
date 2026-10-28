<script setup>
defineProps({
  subline: { type: Boolean, default: false },
})
</script>

<template>
  <span class="brand-lockup">
    <span class="brand-word" role="img" aria-label="NEOC">
      <svg class="bw-n" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <circle class="bw-glow" cx="88" cy="8" r="22" />
        <path class="bw-strand" d="M8 94 L8 8 L92 94 L92 8" />
        <circle class="bw-dot" cx="88" cy="8" r="13" />
      </svg>
      <span class="bw-letter">E</span>
      <svg class="bw-o" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="bw-ring" cx="50" cy="50" r="38" />
        <circle class="bw-dot" cx="68" cy="34" r="13" />
      </svg>
      <span class="bw-letter">C</span>
    </span>
    <span v-if="subline" class="brand-sub">Technology Co. Ltd</span>
  </span>
</template>

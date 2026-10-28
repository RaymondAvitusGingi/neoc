<script setup>
// Click-to-chat only — no WhatsApp Business API integration (out of scope per spec).
const NUMBER = '255629101982'
</script>

<template>
  <a
    class="wa-float pressable"
    :href="`https://wa.me/${NUMBER}`"
    target="_blank"
    rel="noopener"
    aria-label="Chat with NEOC on WhatsApp"
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 6.3A8.9 8.9 0 0 0 12 4.1 8.9 8.9 0 0 0 3.5 17l-1 3.7 3.8-1A8.9 8.9 0 0 0 20.9 12 8.9 8.9 0 0 0 17.6 6.3Zm-5.6 13.6a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.5.6.7-2.4-.2-.3a7.4 7.4 0 1 1 13.7-4.6 7.4 7.4 0 0 1-7.6 7.9Zm4-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-1.3-.6-2.1-1.1-3-2.5-.1-.2-.1-.3.1-.5l.4-.5c.1-.2.1-.4 0-.5l-.6-1.4c-.1-.3-.3-.3-.5-.3h-.4c-.1 0-.4.1-.6.4-.2.3-.8.8-.8 1.9s.8 2.2 1 2.4c1.2 1.6 2.6 2.5 4.4 3.2.5.2.9.2 1.3.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1l-.3-.1Z"/>
    </svg>
  </a>
</template>

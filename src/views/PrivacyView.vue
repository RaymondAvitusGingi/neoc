<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'

const content = useContentStore()
const c = computed(() => content.content.company)
</script>

<template>
  <section class="block">
    <div class="wrap legal" style="max-width:860px">
      <span class="eyebrow">Legal</span>
      <h2 style="font-size:clamp(28px,4vw,42px);font-weight:800;margin:10px 0 24px">Privacy Policy</h2>

      <h2>What we collect</h2>
      <p>
        When you use the enquiry form on the Contact page, we collect your full name, organisation (optional),
        email address and/or phone number, the service you are enquiring about, and the message you write.
      </p>

      <h2>Why we collect it</h2>
      <p>
        We use this information only to respond to your enquiry — to understand what you need and to contact
        you back by email or phone. We do not sell or share your details with third parties, and we do not use
        them for marketing without your separate consent.
      </p>

      <h2>How long we keep it</h2>
      <p>Enquiries are kept for as long as needed to handle your request and for our own records, and are deleted automatically after 24 months.</p>

      <h2>Your rights</h2>
      <p>
        Under Tanzania's Personal Data Protection Act, 2022, you may ask us to show you the information we hold
        about you, correct it, or delete it. To do this, email {{ c.email }} or call {{ c.phone1 }}.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable technical and organisational measures to protect your information against
        unauthorised access, loss or misuse.
      </p>

      <h2>Contact</h2>
      <p>{{ c.name }}, {{ c.address }}, {{ c.postal }}. {{ c.email }} · {{ c.phone1 }}</p>
    </div>
  </section>
</template>

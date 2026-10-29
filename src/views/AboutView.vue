<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { paragraphs } from '@/services/text'

const content = useContentStore()
const c = computed(() => content.content.company)
const aboutParas = computed(() => paragraphs(content.content.about))
// Registration number and TIN are intentionally left off the public site —
// they stay in the printed/PDF company profile for formal verification
// (tenders, procurement) rather than sitting openly on a crawlable page.
const rows = computed(() => [
  ['Company name', c.value.name],
  ['Country of registration', c.value.country],
  ['Physical address', c.value.address],
  ['Postal address', c.value.postal],
  ['Telephone', `${c.value.phone1} & ${c.value.phone2}`],
  ['Email', c.value.email],
  ['Managing Director', c.value.md],
  ['Year established', c.value.established],
])
const certifications = computed(() => content.content.certifications || [])
</script>

<template>
  <section class="block">
    <div class="wrap">
      <span class="eyebrow">About us</span>
      <h2 style="font-size:clamp(32px,4.5vw,52px);font-weight:800;margin:10px 0 28px;max-width:20ch">{{ c.tagline }}</h2>
      <div class="two">
        <div class="prose">
          <p v-for="(p, i) in aboutParas" :key="i">{{ p }}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="band" style="padding:28px 28px 26px;border-radius:var(--r)">
            <span class="eyebrow">Vision</span>
            <h3 style="margin-top:6px">Where we are going</h3>
            <p style="color:var(--muted)">{{ content.content.vision }}</p>
          </div>
          <div class="band" style="padding:28px 28px 26px;border-radius:var(--r);background:var(--accent-soft)">
            <span class="eyebrow">Mission</span>
            <h3 style="margin-top:6px">What we do every day</h3>
            <p style="color:var(--muted)">{{ content.content.mission }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Core values</span><h2>What guides our work.</h2></div>
        <p>The standards our team holds itself to on every site and every ticket.</p>
      </div>
      <div class="grid-3">
        <div v-for="(v, i) in content.content.values" :key="v.t" v-reveal class="item">
          <span class="icon-circle" :class="`c${(i % 3) + 1}`" style="width:46px;height:46px;margin-bottom:12px">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </span>
          <span class="k">V{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ v.t }}</h3>
          <p>{{ v.d }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap">
      <div class="sec-head">
        <div><span class="eyebrow">Corporate information</span><h2>Company particulars.</h2></div>
        <p>Registered in {{ c.country }}. Certifications and formal approvals will be listed here as the company obtains them.</p>
      </div>
      <div class="table-wrap">
        <table class="info">
          <tbody>
            <tr v-for="r in rows" :key="r[0]"><th>{{ r[0] }}</th><td>{{ r[1] }}</td></tr>
          </tbody>
        </table>
      </div>

      <template v-if="certifications.length">
        <h3 style="font-size:20px;margin:32px 0 14px">Certifications</h3>
        <div class="table-wrap">
          <table class="info">
            <tbody>
              <tr v-for="cert in certifications" :key="cert.name">
                <th>{{ cert.name }}</th>
                <td>{{ cert.issuer }}<span v-if="cert.expiry"> · expires {{ cert.expiry }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </section>
</template>

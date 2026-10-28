<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { DEMO_LOGIN } from '@/services/defaults'
import { backendName } from '@/services/repo'

const auth = useAuthStore()
const users = useUsersStore()
const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const hasSuper = ref(true)

// Firestore rules correctly refuse to list all users to a signed-out visitor,
// so this check — and the local-only demo-login hint — only applies in local mode.
if (backendName === 'local') {
  users.load().then(() => {
    hasSuper.value = users.activeSuperAdmins > 0
  })
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    router.replace(route.query.redirect || { name: 'admin-dashboard' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <span class="eyebrow">Admin</span>
    <h2>Sign in to manage the site</h2>
    <p class="note" style="margin-bottom:20px">
      <template v-if="backendName === 'firebase'">
        Sign in with your NEOC admin email and password. First time as the project owner?
        Use <span class="mono">neocgr9@gmail.com</span> — your Super Admin profile is created automatically on first sign-in.
      </template>
      <template v-else-if="hasSuper">Sign in with the account a Super Admin created for you.</template>
      <template v-else>
        First sign-in: <span class="mono">{{ DEMO_LOGIN.username }}</span> / <span class="mono">{{ DEMO_LOGIN.password }}</span>.
        Then open <strong>Users</strong> and create your own account; the demo login stops working once a Super Admin exists.
      </template>
    </p>
    <form class="card" novalidate @submit.prevent="submit">
      <div class="fields">
        <label class="f full">
          {{ backendName === 'firebase' ? 'Email' : 'Username' }}
          <input
            v-model="username"
            :type="backendName === 'firebase' ? 'email' : 'text'"
            autocomplete="username"
            autocapitalize="none"
            autocorrect="off"
            spellcheck="false"
          />
        </label>
        <label class="f full">
          Password
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>
      </div>
      <button class="btn btn-primary pressable" style="margin-top:16px;width:100%;justify-content:center" type="submit" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
      <div v-if="error" class="form-msg err" style="margin-top:12px">{{ error }}</div>
    </form>
  </div>
</template>

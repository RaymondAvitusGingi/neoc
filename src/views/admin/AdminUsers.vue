<script setup>
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { ROLES } from '@/services/defaults'
import { initials, fmtDate } from '@/services/text'
import ConfirmButton from '@/components/ConfirmButton.vue'
import EmptyState from '@/components/EmptyState.vue'

const auth = useAuthStore()
const users = useUsersStore()
users.load()

const form = reactive({ name: '', username: '', role: 'editor', password: '', password2: '' })
const resettingId = ref(null)
const newPassword = ref('')

async function createUser() {
  if (!form.name.trim() || !form.username.trim()) return toast.error('Name and username are required.')
  if (form.password.length < 8) return toast.error('Password must be at least 8 characters.')
  if (form.password !== form.password2) return toast.error('Passwords do not match.')
  try {
    await users.create({ name: form.name, username: form.username, role: form.role, password: form.password })
    Object.assign(form, { name: '', username: '', role: 'editor', password: '', password2: '' })
    toast.success('User created.')
  } catch (e) {
    toast.error(e.message)
  }
}

function startReset(id) {
  resettingId.value = id
  newPassword.value = ''
}
async function saveReset(id) {
  if (newPassword.value.length < 8) return toast.error('Password must be at least 8 characters.')
  await users.setPassword(id, newPassword.value)
  resettingId.value = null
  toast.success('Password updated.')
}

async function changeRole(u, role) {
  await users.updateRole(u.id, role)
}
async function toggleActive(id) {
  await users.toggleActive(id)
}
async function remove(id) {
  await users.remove(id)
  toast('User removed.')
}

function isLastSuper(u) {
  return u.active && u.role === 'superadmin' && users.activeSuperAdmins <= 1
}
</script>

<template>
  <div v-if="auth.me?.builtin" class="mode">
    <span class="dot" style="background:var(--signal)"></span>
    <span>
      <strong>You are signed in with the built-in demo account.</strong> Create a Super Admin account for yourself below.
      Once one exists, the demo login stops working.
    </span>
  </div>

  <form class="card" novalidate autocomplete="off" @submit.prevent="createUser">
    <h3 style="font-size:19px;margin-bottom:4px">Add a user</h3>
    <p class="note" style="margin-bottom:14px">The person signs in on the Admin page with this username and password.</p>
    <div class="fields">
      <label class="f">Full name *<input v-model="form.name" maxlength="60" placeholder="e.g. Asha Mwakyusa" /></label>
      <label class="f">Username or email *<input v-model="form.username" maxlength="60" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="e.g. asha or asha@neoctech.co.tz" /></label>
      <label class="f full">
        Role *
        <select v-model="form.role">
          <option v-for="(r, key) in ROLES" :key="key" :value="key">{{ r.label }}</option>
        </select>
      </label>
      <label class="f">Password *<input v-model="form.password" type="password" autocomplete="new-password" placeholder="At least 8 characters" /></label>
      <label class="f">Confirm password *<input v-model="form.password2" type="password" autocomplete="new-password" /></label>
    </div>
    <div style="display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap">
      <button class="btn btn-primary pressable" type="submit">Create user</button>
      <span class="note">Share the password with the person privately.</span>
    </div>
  </form>

  <div class="table-wrap" style="margin-top:20px">
    <table class="info">
      <tbody>
        <tr v-for="(r, key) in ROLES" :key="key"><th>{{ r.label }}</th><td>{{ r.desc }}</td></tr>
      </tbody>
    </table>
  </div>

  <h3 style="font-size:20px;margin:28px 0 14px">Admin users ({{ users.list.length }})</h3>
  <div v-if="users.list.length" class="ed-list">
    <div v-for="u in users.list" :key="u.id" class="u-row" :class="{ off: !u.active }">
      <span class="avatar" aria-hidden="true">{{ initials(u.name) }}</span>
      <div class="u-main">
        <strong>{{ u.name }} <span v-if="u.id === auth.me?.id" class="pill">You</span></strong>
        <div class="proj-meta">
          <span class="mono">{{ u.username }}</span>
          <span>{{ u.active ? 'Active' : 'Deactivated' }}</span>
          <span>Last sign-in {{ u.lastLogin ? fmtDate(u.lastLogin) : 'never' }}</span>
        </div>
      </div>
      <label class="u-role">
        <span class="sr">Role for {{ u.name }}</span>
        <select :value="u.role" :disabled="u.id === auth.me?.id || isLastSuper(u)" @change="changeRole(u, $event.target.value)">
          <option v-for="(r, key) in ROLES" :key="key" :value="key">{{ r.label }}</option>
        </select>
      </label>
      <div class="act">
        <button class="btn btn-ghost btn-sm pressable" type="button" @click="startReset(u.id)">Reset password</button>
        <button class="btn btn-ghost btn-sm pressable" type="button" :disabled="u.id === auth.me?.id || isLastSuper(u)" @click="toggleActive(u.id)">
          {{ u.active ? 'Deactivate' : 'Activate' }}
        </button>
        <ConfirmButton
          label="Delete"
          :message="`Delete ${u.name}?`"
          :disabled="u.id === auth.me?.id || isLastSuper(u)"
          @confirm="remove(u.id)"
        />
      </div>
      <div v-if="resettingId === u.id" class="u-inline">
        <input v-model="newPassword" type="password" placeholder="New password (8+ characters)" autocomplete="new-password" />
        <button class="btn btn-primary btn-sm pressable" type="button" @click="saveReset(u.id)">Save password</button>
        <button class="btn btn-ghost btn-sm pressable" type="button" @click="resettingId = null">Cancel</button>
      </div>
    </div>
  </div>
  <EmptyState v-else text="No user accounts yet. Create the first one above. Make it a Super Admin so you are not locked out." />
  <p v-if="users.list.length" class="note" style="margin-top:12px">
    You cannot change your own role, deactivate yourself, or remove the last active Super Admin.
  </p>
</template>

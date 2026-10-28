// Local, browser-only data layer (IndexedDB via idb-keyval + sessionStorage for the
// signed-in user). It implements the same shape as src/services/repo/firebase.js —
// components and Pinia stores only ever talk to src/services/repo/index.js, so
// swapping the backend never touches UI code.
import { createStore, get, set } from 'idb-keyval'
import { cloneDefaults, mergeWithDefaults, DEMO_LOGIN, ROLES } from '../defaults'
import { hashPassword, newSalt, newId } from '../hash'
import { checkRateLimit } from '../rateLimit'

const store = createStore('neoc-db', 'kv')
const SESSION_KEY = 'neoc_session'

const k = {
  content: 'content',
  projects: 'projects',
  testimonials: 'testimonials',
  messages: 'messages',
  users: 'users',
  versions: 'versions',
}

async function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeSession(me) {
  try {
    if (me) sessionStorage.setItem(SESSION_KEY, JSON.stringify(me))
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

/* ---------------- Content ---------------- */

export async function getContent() {
  const raw = await get(k.content, store)
  if (!raw) {
    const seeded = cloneDefaults()
    await set(k.content, seeded, store)
    return seeded
  }
  return mergeWithDefaults(raw)
}

export async function saveContent(content, publishedBy) {
  const next = { ...content, updatedAt: Date.now() }
  await set(k.content, next, store)
  const versions = (await get(k.versions, store)) || []
  versions.unshift({ id: newId('ver'), snapshot: next, publishedBy: publishedBy || null, publishedAt: next.updatedAt })
  await set(k.versions, versions.slice(0, 20), store)
  return next
}

export async function listVersions() {
  return (await get(k.versions, store)) || []
}

export async function restoreVersion(versionId) {
  const versions = await listVersions()
  const found = versions.find((v) => v.id === versionId)
  if (!found) throw new Error('Version not found')
  return saveContent(found.snapshot, 'restore')
}

export async function restoreDefaults() {
  const seeded = cloneDefaults()
  return saveContent(seeded, 'restore-defaults')
}

/* ---------------- Auth & users ---------------- */

export async function listUsers() {
  return (await get(k.users, store)) || []
}

export async function hasSuperAdmin() {
  const users = await listUsers()
  return users.some((u) => u.active && u.role === 'superadmin')
}

export async function getSession() {
  return readSession()
}

export async function login({ username, password }) {
  const id = String(username || '').trim()
  const pw = String(password || '')
  const users = await listUsers()
  const hasAnySuper = users.some((u) => u.active && u.role === 'superadmin')

  if (!hasAnySuper && id.toLowerCase() === DEMO_LOGIN.username && pw === DEMO_LOGIN.password) {
    const me = { id: 'demo', name: 'Demo Admin', username: DEMO_LOGIN.username, role: 'superadmin', builtin: true }
    writeSession(me)
    return me
  }

  const user = users.find((u) => u.username.toLowerCase() === id.toLowerCase())
  if (!user || !user.active) throw new Error('Incorrect username or password.')
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    throw new Error('Too many attempts. Try again in a few minutes.')
  }
  const hash = await hashPassword(pw, user.salt)
  if (hash !== user.passHash) {
    const fails = (user.fails || 0) + 1
    user.fails = fails
    if (fails >= 5) user.lockedUntil = Date.now() + 15 * 60 * 1000
    await set(k.users, users, store)
    throw new Error('Incorrect username or password.')
  }
  user.fails = 0
  user.lockedUntil = null
  user.lastLogin = Date.now()
  await set(k.users, users, store)

  const me = { id: user.id, name: user.name, username: user.username, role: user.role, builtin: false }
  writeSession(me)
  return me
}

export async function logout() {
  writeSession(null)
}

export async function createUser({ name, username, role, password }) {
  if (!ROLES[role]) throw new Error('Invalid role')
  const users = await listUsers()
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('That username is already in use.')
  }
  const salt = newSalt()
  const passHash = await hashPassword(password, salt)
  const user = {
    id: newId('usr'),
    name,
    username,
    role,
    active: true,
    salt,
    passHash,
    fails: 0,
    lockedUntil: null,
    lastLogin: null,
    createdAt: Date.now(),
  }
  users.push(user)
  await set(k.users, users, store)
  return user
}

export async function setUserPassword(id, password) {
  const users = await listUsers()
  const user = users.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  user.salt = newSalt()
  user.passHash = await hashPassword(password, user.salt)
  await set(k.users, users, store)
  return { method: 'set' }
}

export async function updateUserRole(id, role) {
  const users = await listUsers()
  const user = users.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  user.role = role
  await set(k.users, users, store)
}

export async function toggleUserActive(id) {
  const users = await listUsers()
  const user = users.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  user.active = !user.active
  await set(k.users, users, store)
}

export async function deleteUser(id) {
  const users = await listUsers()
  await set(k.users, users.filter((u) => u.id !== id), store)
}

/* ---------------- Projects ---------------- */

export async function listProjects() {
  const list = (await get(k.projects, store)) || []
  return list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}

export async function createProject(data) {
  const projects = (await get(k.projects, store)) || []
  const project = {
    id: newId('prj'),
    title: data.title,
    client: data.client || '',
    location: data.location || '',
    service: data.service || '',
    date: data.date || '',
    description: data.description || '',
    // Images may arrive as a reactive array (Vue ref/proxy); IndexedDB's structured
    // clone can't store a Proxy, so materialize a plain array of plain strings.
    images: Array.from(data.images || [], (src) => String(src)),
    isVisible: true,
    createdAt: Date.now(),
  }
  projects.unshift(project)
  await set(k.projects, projects, store)
  return project
}

export async function deleteProject(id) {
  const projects = (await get(k.projects, store)) || []
  await set(k.projects, projects.filter((p) => p.id !== id), store)
}

/* ---------------- Testimonials ---------------- */

export async function listTestimonials() {
  return (await get(k.testimonials, store)) || []
}

export async function upsertTestimonial(data) {
  const list = (await get(k.testimonials, store)) || []
  if (data.id) {
    const idx = list.findIndex((t) => t.id === data.id)
    if (idx === -1) throw new Error('Testimonial not found')
    list[idx] = { ...list[idx], ...data }
  } else {
    list.unshift({
      id: newId('tst'),
      name: data.name,
      role: data.role || '',
      company: data.company || '',
      rating: Number(data.rating) || 0,
      quote: data.quote,
      jobId: data.jobId || null,
      visible: data.visible !== false,
      createdAt: Date.now(),
    })
  }
  await set(k.testimonials, list, store)
  return list
}

export async function toggleTestimonialVisible(id) {
  const list = (await get(k.testimonials, store)) || []
  const t = list.find((x) => x.id === id)
  if (!t) throw new Error('Testimonial not found')
  t.visible = !t.visible
  await set(k.testimonials, list, store)
}

export async function deleteTestimonial(id) {
  const list = (await get(k.testimonials, store)) || []
  await set(k.testimonials, list.filter((t) => t.id !== id), store)
}

/* ---------------- Messages / enquiries ---------------- */

export async function listMessages() {
  const list = (await get(k.messages, store)) || []
  return list.slice().sort((a, b) => (b.at || 0) - (a.at || 0))
}

export async function createMessage(data) {
  checkRateLimit()
  const list = (await get(k.messages, store)) || []
  const message = {
    key: newId('msg'),
    name: data.name,
    org: data.org || '',
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    message: data.message,
    read: false,
    status: 'new',
    at: Date.now(),
  }
  list.unshift(message)
  await set(k.messages, list, store)
  return message
}

export async function setMessageRead(key, read) {
  const list = (await get(k.messages, store)) || []
  const m = list.find((x) => x.key === key)
  if (!m) throw new Error('Message not found')
  m.read = read
  m.status = read ? 'read' : 'new'
  await set(k.messages, list, store)
}

export async function deleteMessage(key) {
  const list = (await get(k.messages, store)) || []
  await set(k.messages, list.filter((m) => m.key !== key), store)
}

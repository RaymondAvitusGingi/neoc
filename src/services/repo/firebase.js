// Firebase-backed data layer — implements the same exported function names as
// ./local.js (see the comment at the top of ./index.js). Content/projects/
// testimonials are public-read in Firestore; everything else requires an
// authenticated, active admin profile (see firestore.rules).
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit as fsLimit, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, sendPasswordResetEmail,
} from 'firebase/auth'
import { db, auth, getSecondaryAuth } from '../firebaseApp'
import { cloneDefaults, mergeWithDefaults, ROLES } from '../defaults'
import { checkRateLimit } from '../rateLimit'

const OWNER_EMAIL = 'neocgr9@gmail.com'

/* ---------------- Content ---------------- */

export async function getContent() {
  const snap = await getDoc(doc(db, 'content', 'site'))
  return snap.exists() ? mergeWithDefaults(snap.data()) : cloneDefaults()
}

export async function saveContent(content, publishedBy) {
  const next = { ...content, updatedAt: Date.now() }
  await setDoc(doc(db, 'content', 'site'), next)
  await addDoc(collection(db, 'contentVersions'), {
    snapshot: next,
    publishedBy: publishedBy || null,
    publishedAt: next.updatedAt,
  })
  return next
}

export async function listVersions() {
  const q = query(collection(db, 'contentVersions'), orderBy('publishedAt', 'desc'), fsLimit(20))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function restoreVersion(versionId) {
  const snap = await getDoc(doc(db, 'contentVersions', versionId))
  if (!snap.exists()) throw new Error('Version not found')
  return saveContent(snap.data().snapshot, 'restore')
}

export async function restoreDefaults() {
  return saveContent(cloneDefaults(), 'restore-defaults')
}

/* ---------------- Auth & users ---------------- */

function userDocToProfile(id, data) {
  return {
    id,
    name: data.name,
    username: data.username,
    role: data.role,
    active: data.active !== false,
    lastLogin: data.lastLogin || null,
    createdAt: data.createdAt || null,
  }
}

async function loadProfile(firebaseUser) {
  const ref = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    if (firebaseUser.email?.toLowerCase() !== OWNER_EMAIL) {
      await signOut(auth)
      throw new Error('No admin profile exists for this account yet. Ask a Super Admin to add you under Users.')
    }
    const profile = {
      name: 'Super Admin',
      username: firebaseUser.email,
      role: 'superadmin',
      active: true,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    }
    await setDoc(ref, profile)
    return userDocToProfile(firebaseUser.uid, profile)
  }

  const data = snap.data()
  if (data.active === false) {
    await signOut(auth)
    throw new Error('This account has been deactivated.')
  }
  return userDocToProfile(firebaseUser.uid, data)
}

let authReadyResolve
const authReady = new Promise((resolve) => { authReadyResolve = resolve })
onAuthStateChanged(auth, (user) => {
  if (authReadyResolve) { authReadyResolve(user); authReadyResolve = null }
})

export async function getSession() {
  const user = await authReady
  if (!user) return null
  try {
    return await loadProfile(user)
  } catch {
    return null
  }
}

export async function login({ username, password }) {
  const email = String(username || '').trim()
  let cred
  try {
    cred = await signInWithEmailAndPassword(auth, email, password)
  } catch (e) {
    if (e.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Try again in a few minutes.')
    }
    throw new Error('Incorrect username or password.')
  }
  const profile = await loadProfile(cred.user)
  await updateDoc(doc(db, 'users', cred.user.uid), { lastLogin: Date.now() })
  return profile
}

export async function logout() {
  await signOut(auth)
}

export async function listUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => userDocToProfile(d.id, d.data()))
}

export async function hasSuperAdmin() {
  const users = await listUsers()
  return users.some((u) => u.active && u.role === 'superadmin')
}

export async function createUser({ name, username, role, password }) {
  if (!ROLES[role]) throw new Error('Invalid role')
  const secondaryAuth = getSecondaryAuth()
  let cred
  try {
    cred = await createUserWithEmailAndPassword(secondaryAuth, username, password)
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') throw new Error('That username is already in use.')
    throw new Error(e.message || 'Could not create the account.')
  } finally {
    await signOut(secondaryAuth).catch(() => {})
  }
  const profile = { name, username, role, active: true, createdAt: Date.now(), lastLogin: null }
  await setDoc(doc(db, 'users', cred.user.uid), profile)
  return userDocToProfile(cred.user.uid, profile)
}

// Firebase's client SDK can't set another user's password without a Cloud
// Function / Admin SDK — so this sends them a reset link instead. The
// caller (useUsersStore) surfaces `method` so the UI can say which happened.
export async function setUserPassword(id, _password) {
  const snap = await getDoc(doc(db, 'users', id))
  if (!snap.exists()) throw new Error('User not found')
  await sendPasswordResetEmail(auth, snap.data().username)
  return { method: 'reset-email' }
}

export async function updateUserRole(id, role) {
  await updateDoc(doc(db, 'users', id), { role })
}

export async function toggleUserActive(id) {
  const ref = doc(db, 'users', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('User not found')
  await updateDoc(ref, { active: !(snap.data().active !== false) })
}

export async function deleteUser(id) {
  // Removes the admin profile (revokes app access). The underlying Firebase
  // Auth account can only be deleted with the Admin SDK, so it's left in
  // place but can no longer sign in to anything (no profile = no access).
  await deleteDoc(doc(db, 'users', id))
}

/* ---------------- Projects ---------------- */

export async function listProjects() {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const projects = await Promise.all(
    snap.docs.map(async (d) => {
      const imagesSnap = await getDocs(query(collection(db, 'projects', d.id, 'images'), orderBy('sortOrder', 'asc')))
      return {
        id: d.id,
        ...d.data(),
        images: imagesSnap.docs.map((img) => img.data().dataUrl),
      }
    })
  )
  return projects
}

export async function createProject(data) {
  const projectRef = await addDoc(collection(db, 'projects'), {
    title: data.title,
    client: data.client || '',
    location: data.location || '',
    service: data.service || '',
    date: data.date || '',
    description: data.description || '',
    isVisible: true,
    createdAt: Date.now(),
  })
  const images = Array.from(data.images || [], (src) => String(src))
  await Promise.all(
    images.map((dataUrl, i) =>
      addDoc(collection(db, 'projects', projectRef.id, 'images'), { dataUrl, sortOrder: i, createdAt: Date.now() })
    )
  )
  return { id: projectRef.id }
}

export async function deleteProject(id) {
  const imagesSnap = await getDocs(collection(db, 'projects', id, 'images'))
  const batch = writeBatch(db)
  imagesSnap.docs.forEach((d) => batch.delete(d.ref))
  batch.delete(doc(db, 'projects', id))
  await batch.commit()
}

/* ---------------- Testimonials ---------------- */

export async function listTestimonials() {
  const snap = await getDocs(collection(db, 'testimonials'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function upsertTestimonial(data) {
  const payload = {
    name: data.name,
    role: data.role || '',
    company: data.company || '',
    rating: Number(data.rating) || 0,
    quote: data.quote,
    jobId: data.jobId || null,
    visible: data.visible !== false,
  }
  if (data.id) {
    await updateDoc(doc(db, 'testimonials', data.id), payload)
  } else {
    await addDoc(collection(db, 'testimonials'), { ...payload, createdAt: Date.now() })
  }
}

export async function toggleTestimonialVisible(id) {
  const ref = doc(db, 'testimonials', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Testimonial not found')
  await updateDoc(ref, { visible: !(snap.data().visible !== false) })
}

export async function deleteTestimonial(id) {
  await deleteDoc(doc(db, 'testimonials', id))
}

/* ---------------- Messages / enquiries ---------------- */

export async function listMessages() {
  const q = query(collection(db, 'messages'), orderBy('at', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ key: d.id, ...d.data() }))
}

export async function createMessage(data) {
  checkRateLimit()
  await addDoc(collection(db, 'messages'), {
    name: data.name,
    org: data.org || '',
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    message: data.message,
    read: false,
    status: 'new',
    at: Date.now(),
  })
}

export async function setMessageRead(key, read) {
  await updateDoc(doc(db, 'messages', key), { read, status: read ? 'read' : 'new' })
}

export async function deleteMessage(key) {
  await deleteDoc(doc(db, 'messages', key))
}

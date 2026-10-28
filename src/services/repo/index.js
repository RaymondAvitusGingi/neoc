// Single seam between the app and its data backend.
//
// Today VITE_BACKEND is unset/"local", so every store imports the IndexedDB-backed
// implementation in ./local.js. Once Firebase credentials are available, add a
// ./firebase.js module that exports the exact same function names (see local.js for
// the full list: content, auth, users, projects, testimonials, messages) backed by
// Firestore/Auth/Storage, set VITE_BACKEND=firebase in .env, and nothing outside this
// file needs to change.
import * as local from './local'
// import * as firebase from './firebase'

const backend = import.meta.env.VITE_BACKEND === 'firebase' ? local /* firebase */ : local

export default backend

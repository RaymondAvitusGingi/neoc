// Single seam between the app and its data backend. Both modules export the
// exact same function names (content, auth, users, projects, testimonials,
// messages) — stores and views only ever import from this file.
import * as local from './local'
import * as firebase from './firebase'

export const backendName = import.meta.env.VITE_BACKEND === 'firebase' ? 'firebase' : 'local'

const backend = backendName === 'firebase' ? firebase : local

export default backend

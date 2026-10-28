import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// A second, independent app instance — used only to create a new admin's
// Auth account without disturbing the currently signed-in admin's session
// (createUserWithEmailAndPassword normally signs in as the new user on
// whichever auth instance it runs against).
let secondaryApp = null
export function getSecondaryAuth() {
  if (!secondaryApp) {
    const name = 'secondary'
    secondaryApp = getApps().find((a) => a.name === name) || initializeApp(firebaseConfig, name)
  }
  return getAuth(secondaryApp)
}

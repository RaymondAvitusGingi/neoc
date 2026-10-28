# NEOC Technology — website & admin panel

Vue 3 (Vite + Vue Router + Pinia) build of the public site and the admin panel described
in `NEOC_Website_Specification (1).docx`, styled from the design system in that spec.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

The app is connected to the real Firebase project (`neoctech1`) via `.env` (not
committed — see `.env.example` for the shape). A local-only fallback still exists:
set `VITE_BACKEND=local` (or delete `.env`) to run entirely in the browser's IndexedDB
with no Firebase project needed, first admin sign-in **admin / neoc2026** at `/admin`.

## Structure

- `src/views/` — the 7 public pages (Home, About, Services, Our Jobs, Contact, Privacy,
  404) plus `src/views/admin/` for the 11 admin modules.
- `src/stores/` — Pinia stores (content, auth, users, projects, testimonials, messages).
  Content editing uses a draft → "Save & publish" flow (`useContentStore`); projects,
  testimonials, messages and users save immediately, matching the spec's module table.
- `src/services/repo/` — the data layer. `local.js` is the current IndexedDB-backed
  implementation; `index.js` is the single seam the stores import through.
- `src/styles/` — the design tokens (colours, type, the 12-fibre colour code), base
  layout/component CSS ported from the approved prototype, and `motion.css` for the
  shared easing/press/stagger primitives.
- `.agents/skills/` — Emil Kowalski's design-engineering skills, used while building this
  UI (animation easing, press states, popover origins, etc.).

## Firebase project (neoctech1)

`src/services/repo/firebase.js` implements the same function surface as `local.js`
(Firestore for content/projects/testimonials/messages/users, Firebase Auth for
sign-in). `src/services/repo/index.js` picks it when `VITE_BACKEND=firebase`. Nothing
outside `src/services/repo/` needed to change — every store and view calls the repo
through that one file.

**Two manual steps in the Firebase console, done once, by whoever has console access**
(these touch billing/identity settings the CLI deliberately can't change on its own):

1. **Authentication → Sign-in method → Email/Password → Enable.**
2. **Firestore Database → Create database** (any region close to Tanzania, e.g.
   `eur3`/Belgium or `europe-west1`). This also turns on the Firestore API, which is
   currently blocking every read/write with a 403.

Then deploy the security rules: `firebase deploy --only firestore:rules`.

**First sign-in** at `/admin` works like the local demo did: sign in with
`neocgr9@gmail.com` and the account's Firebase Auth password (set that password by
adding the user once in **Authentication → Users → Add user** — the app does not create
Auth accounts for you on first login, specifically to avoid letting anyone who merely
knows that email address self-register and claim Super Admin). Once that account's
Firestore profile doc is auto-created on first login, `/admin/users` is where every
other teammate gets invited — creating a user there registers their Firebase Auth
account via a secondary, throwaway app instance so it never signs the current admin
out.

**Known limitations of a backend-less Firebase setup** (all fixable later with a single
Cloud Function, none blocking):
- Resetting another admin's password sends them a Firebase password-reset email
  instead of letting a Super Admin set it directly (the client SDK can't do the latter
  without the Admin SDK).
- Deleting a user removes their admin *profile* (so they lose all app access) but not
  their underlying Firebase Auth account — deleting that requires the Admin SDK.
- The contact form's spam defence (FR-PUB-05) is a client-side throttle only; a real
  rate limit needs to run server-side (Cloud Function + App Check, or Firestore
  security rules can't rate-limit by themselves).
- Enquiry notification emails (FR-ENQ-02/03) aren't sent — that also needs a Cloud
  Function (e.g. the official `firestore-send-email` extension) watching the `messages`
  collection.

## Spec coverage notes

- Role-based access (FR-SEC-02) is enforced twice: route guards in the UI, and
  `firestore.rules` on every read/write — a user can't get more than Viewer access by
  editing requests directly, even against the real backend.
- Account lockout after 5 failed attempts (FR-SEC-03) exists in `local.js` but isn't
  replicated in `firebase.js` yet — Firebase Auth has its own abuse throttling, but a
  precise 15-minute lockout would need a Cloud Function.
- Version history (FR-ADM-05) has full data-layer support (`listVersions`/
  `restoreVersion` in both repos) but no admin UI screen yet to browse/restore from.
- Out of scope per spec section 3: Swahili version, quotation calculator, client portal,
  blog, WhatsApp Business API (click-to-chat is implemented).

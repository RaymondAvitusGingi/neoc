# NEOC Technology — website & admin panel

Vue 3 (Vite + Vue Router + Pinia) build of the public site and the admin panel described
in `NEOC_Website_Specification (1).docx`, styled from the design system in that spec.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

No account or API key is needed to develop — the whole app runs client-side today, with
all content and uploads stored in the browser's IndexedDB. First admin sign-in:
**admin / neoc2026** at `/admin` (create a real Super Admin account under Users, which
retires the demo login).

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

## Connecting Firebase

1. Create a Firebase project; enable **Authentication** (Email/Password) and
   **Firestore**. (Storage isn't required — photos are compressed to data URLs client
   side, which works fine for Firestore too, though switching to Storage URLs is a small
   improvement worth making at that point.)
2. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values plus
   `VITE_BACKEND=firebase`.
3. Add `src/services/repo/firebase.js` that exports the same function names as
   `local.js` (listed in the comment at the top of `src/services/repo/index.js`), backed
   by Firestore/Auth instead of IndexedDB.
4. Flip the import in `src/services/repo/index.js`.

Nothing outside `src/services/repo/` needs to change — every store and view calls the
repo through that one file.

## Spec coverage notes

- Service visibility (FR-PUB-03), the enquiry rate limit (FR-PUB-05), CSV export
  (FR-ENQ-04), role-based route guards (FR-SEC-02), and the draft/publish/restore flow
  (FR-ADM-02–05) are implemented client-side; server-side enforcement of the same rules
  is part of the Firebase/Cloud Functions step.
- Email notifications (FR-ENQ-02/03) and account lockout persistence across devices
  need a backend and are stubbed for now (lockout is enforced locally).
- Out of scope per spec section 3: Swahili version, quotation calculator, client portal,
  blog, WhatsApp Business API (click-to-chat is implemented).

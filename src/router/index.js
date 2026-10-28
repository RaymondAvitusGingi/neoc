import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const EDITOR_PLUS = ['superadmin', 'editor']
const SUPER_ONLY = ['superadmin']
const ANY_ROLE = ['superadmin', 'editor', 'viewer']

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  { path: '/services', name: 'services', component: () => import('@/views/ServicesView.vue') },
  { path: '/projects', name: 'projects', component: () => import('@/views/ProjectsView.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('@/views/PrivacyView.vue') },

  { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/AdminLogin.vue') },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboard.vue'), meta: { roles: ANY_ROLE, title: 'Dashboard' } },
      { path: 'company', name: 'admin-company', component: () => import('@/views/admin/AdminCompany.vue'), meta: { roles: EDITOR_PLUS, title: 'Company info' } },
      { path: 'home', name: 'admin-home', component: () => import('@/views/admin/AdminHomeEditor.vue'), meta: { roles: EDITOR_PLUS, title: 'Home page' } },
      { path: 'about', name: 'admin-about', component: () => import('@/views/admin/AdminAbout.vue'), meta: { roles: EDITOR_PLUS, title: 'About & values' } },
      { path: 'services', name: 'admin-services', component: () => import('@/views/admin/AdminServices.vue'), meta: { roles: EDITOR_PLUS, title: 'Services' } },
      { path: 'process', name: 'admin-process', component: () => import('@/views/admin/AdminProcess.vue'), meta: { roles: EDITOR_PLUS, title: 'Approach & why us' } },
      { path: 'markets', name: 'admin-markets', component: () => import('@/views/admin/AdminMarkets.vue'), meta: { roles: EDITOR_PLUS, title: 'Markets' } },
      { path: 'projects', name: 'admin-projects', component: () => import('@/views/admin/AdminProjects.vue'), meta: { roles: ANY_ROLE, title: 'Our Jobs' } },
      { path: 'testimonials', name: 'admin-testimonials', component: () => import('@/views/admin/AdminTestimonials.vue'), meta: { roles: ANY_ROLE, title: 'Testimonials' } },
      { path: 'messages', name: 'admin-messages', component: () => import('@/views/admin/AdminMessages.vue'), meta: { roles: ANY_ROLE, title: 'Messages' } },
      { path: 'users', name: 'admin-users', component: () => import('@/views/admin/AdminUsers.vue'), meta: { roles: SUPER_ONLY, title: 'Users' } },
    ],
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const needsAuth = to.matched.some((r) => r.meta?.requiresAuth)
  if (!needsAuth) return true

  const auth = useAuthStore()
  if (!auth.ready) await auth.init()
  if (!auth.isAuthed) return { name: 'admin-login', query: { redirect: to.fullPath } }

  const roles = to.meta?.roles
  if (roles && !roles.includes(auth.role)) return { name: 'admin-dashboard' }
  return true
})

export default router

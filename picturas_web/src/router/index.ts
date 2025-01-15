import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/dashboard',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('../views/PricingView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/resetPassword/:token',
      name: 'reset-password',
      component: () => import('../views/ValidatePasswordRecoveryView.vue'), 
      meta: { fullWidth: true },
    },
    {
      path: '/passwordRecovery-success/:email',
      name: 'reset-password-success',
      component: () => import('../views/PasswordRecoverySuccessView.vue'), 
      meta: { fullWidth: true },
    },
    {
      path: '/validateAccount/:token',
      name: 'validate-account',
      component: () => import('../views/ValidateAccountView.vue'), 
      meta: { fullWidth: true },
    },
    {
      path: '/create-project',
      name: 'createproject',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/trash',
      name: 'Trash',
      component: () => import('../views/TrashView.vue'),
    },
    {
      path: '/registration-success/:email',
      name: 'registration-success',
      component: () => import('../views/RegisterSuccessView.vue'),
      meta: { fullWidth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Error404View.vue'),
      meta: { fullWidth: true },
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/', '/login', '/register', '/forgot-password', '/resetPassword', '/passwordRecovery-success', '/validateAccount', '/registration-success', '/:pathMatch(.*)*']
  const authRequired = !publicPages.some(page => to.path.startsWith(page))
  const loggedIn = authStore.accessToken
  const restrictedPages = ['/settings', '/profile']
  const hasTokens = authStore.accessToken && authStore.refreshToken

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  if (restrictedPages.includes(to.path) && !hasTokens) {
    return next('/login')
  }

  next()
})

export default router

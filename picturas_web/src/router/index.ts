
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
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
    },
    {
      path: '/validateAccount/:token',
      name: 'validate-account',
      component: () => import('../views/ValidateAccountView.vue'), 
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
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Error404View.vue'),
    },
    {
      path: '/registration-success/:email',
      name: 'registration-success',
      component: () => import('../views/RegisterSuccessView.vue')
    }
  ],
})

export default router

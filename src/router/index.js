import { createRouter, createWebHistory } from 'vue-router';
import Welcome from '../views/WelcomeView.vue';
import { useUserStore } from '@/stores/UserStore';
import { isReportType } from '@/constants/reportTypes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
      meta: { guestOnly: true },
    },
    {
      // Opened from the recovery email, which signs the user in: neither guest-only
      // nor requiresAuth, the view itself handles an invalid/expired link
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/UserDataView.vue'),
      props: { mode: 'register' },
      meta: { guestOnly: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/UserDataView.vue'),
      props: { mode: 'profile' },
      meta: { requiresAuth: true },
    },
    {
      // Old URL of the register/profile screen
      path: '/user-data',
      redirect: { name: 'profile' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/new-report/:type',
      name: 'new-report',
      component: () => import('@/views/NewReportView.vue'),
      props: true,
      meta: { requiresAuth: true },
      // The type comes from the URL and is saved as-is in Reports.Type
      beforeEnter: (to) => isReportType(to.params.type) || { name: 'dashboard' },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/report/:id',
      name: 'report',
      component: () => import('@/views/ReportView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('@/views/EmergencyView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  // Wait for the stored Supabase session to be restored, otherwise a reload
  // on a private page would always bounce to the login
  await userStore.ready;

  if (to.meta.requiresAuth && !userStore.logged) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && userStore.logged) {
    return { name: 'dashboard' };
  }
});

export default router;

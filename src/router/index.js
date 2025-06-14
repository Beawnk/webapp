import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/user-data',
      name: 'user-data',
      component: () => import('@/views/UserDataView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/new-report/:type',
      name: 'new-report',
      component: () => import('@/views/NewReportView.vue'),
      props: true
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue')
    },
    {
      path: '/report/:id',
      name: 'report',
      component: () => import('@/views/ReportView.vue'),
      props: true
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('@/views/EmergencyView.vue')
    }
  ]
})

export default router
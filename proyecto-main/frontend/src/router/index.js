import { createRouter, createWebHistory } from 'vue-router'
import loginView from '../views/loginView.vue'
import adminView from '../views/adminView.vue'
import usuarioView from '../views/usuarioView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: loginView },
  { path: '/admin', component: adminView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/usuario', component: usuarioView, meta: { requiresAuth: true, role: 'usuario' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Route guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login')
    }

    if (to.meta.role && to.meta.role !== role) {
      return next('/login') // o redirige a "no autorizado"
    }
  }

  next()
})

export default router

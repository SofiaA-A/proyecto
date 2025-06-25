import { createRouter, createWebHistory } from 'vue-router'

// Vistas principales
import LoginView from '../views/loginView.vue'
import AdminView from '../views/admin/adminView.vue'
import ClientView from '../views/client/clientView.vue'

// Componentes del cliente
import dashboard from '../components/client/dashboard.vue'
import CarInfo from '../components/client/CarInfo.vue'
import CarRoute from '../components/client/CarRoute.vue'

// Componentes del admin
import UserList from '../components/admin/userList.vue'
import CarList from '../components/admin/carList.vue'
import CarForm from '../components/admin/carForm.vue'
import RouteList from '../components/admin/routeList.vue'
import adminDashboard from '../components/admin/adminDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },

  // Rutas del admin
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', component: adminDashboard },
      { path: 'users', component: UserList },
      { path: 'users/new', component: () => import('../components/admin/userForm.vue') },
      { path: 'cars', component: CarList },
      { path: 'cars/new', component: CarForm },
      { path: 'cars/edit/:id', component: CarForm, props: true },
      { path: 'routes', component: RouteList }
    ]
  },

  // Rutas del cliente
  {
    path: '/client',
    component: ClientView,
    meta: { requiresAuth: true, role: 'cliente' },
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', component: dashboard },
      { path: 'car-info', component: CarInfo },
      { path: 'car-route', component: CarRoute }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🛡️ Guard global para proteger rutas
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isAuthenticated = !!user

  // Si la ruta necesita autenticación y no está logueado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Si ya está logueado e intenta ir al login
  if (to.path === '/login' && isAuthenticated) {
    if (user.role === 'admin') return next('/admin/dashboard')
    if (user.role === 'cliente') return next('/client/dashboard')
  }

  // Si intenta entrar a una ruta que no es de su rol
  if (to.meta.role && user && to.meta.role !== user.role) {
    return user.role === 'admin' ? next('/admin/dashboard') : next('/client/dashboard')
  }

  next()
})

export default router

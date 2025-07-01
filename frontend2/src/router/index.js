import { createRouter, createWebHistory } from 'vue-router'

// Vistas principales
import LoginView from '../views/loginView.vue'
import AdminView from '../views/admin/adminView.vue'
import ClientView from '../views/client/clientView.vue'

// Componentes del cliente
import dashboard from '../components/client/dashboard.vue'
import CarInfo from '../components/client/CarInfo.vue'
import CarRoute from '../components/client/CarRoute.vue'
import AviableCars from '@/components/client/AviableCars.vue'

// Componentes del admin
import UserList from '../components/admin/userList.vue'
import CarList from '../components/admin/carList.vue'
import CarForm from '../components/admin/carForm.vue'
import RouteList from '../components/admin/routeList.vue'
import adminDashboard from '../components/admin/adminDashboard.vue'
import UpdateRoute from '@/components/admin/UpdateRoute.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },

  // Rutas del admin
  {
    path: '/admin',
    component: AdminView,
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', component: adminDashboard },
      { path: 'users', component: UserList },
      { path: 'users/new', component: () => import('../components/admin/userForm.vue') },
      { path: '/admin/routes/car/:carId',name: 'CarRouteAdmin',component: () => import('../components/admin/CarRouteAdmin.vue'),props: true},
      { path: 'cars', component: CarList },
      { path: 'cars/new', component: CarForm },
      { path: 'cars/edit/:id', component: CarForm, props: true },
      { path: 'routes', component: RouteList },
      { path: 'route/new', component: UpdateRoute }
    ]
  },

  // Rutas del cliente
  {
    path: '/client',
    component: ClientView,
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', component: dashboard },
      { path: 'car-info', component: CarInfo },
      { path: 'available-cars', component: AviableCars },
      { path: 'car-route', component: CarRoute }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARDIA GLOBAL
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isAuthenticated = !!user

  // Si no está logueado y no va a login
  if (!isAuthenticated && to.path !== '/login') {
    return next('/login')
  }

  // Si está logueado y va a login
  if (isAuthenticated && to.path === '/login') {
    const home = user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'
    return next(home)
  }

  // Si es cliente e intenta ir a admin
  if (isAuthenticated && user.role === 'cliente' && to.path.startsWith('/admin')) {
    return next('/client/dashboard')
  }

  // Si es admin e intenta ir a cliente
  if (isAuthenticated && user.role === 'admin' && to.path.startsWith('/client')) {
    return next('/admin/dashboard')
  }

  next()
})

export default router

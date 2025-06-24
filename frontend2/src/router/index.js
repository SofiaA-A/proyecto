// src/router/index.js

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
    children: [
      { path: '', redirect: 'dashboard' }, // Redirige a dashboard por defecto
      { path: 'dashboard', component: adminDashboard }, // Vista principal
      { path: 'users', component: UserList },
      { path: 'cars', component: CarList },
      { path: 'cars/new', component: CarForm },
      {
        path: 'cars/edit/:id',
        component: CarForm,
        props: true // Habilita el paso del ID como prop
      },
      { path: 'routes', component: RouteList }
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
      { path: 'car-route', component: CarRoute }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/loginView.vue'
import UsuarioView from '../views/usuarioView.vue'
import AdminView from '../views/adminView.vue'
import RegistrarView from '../views/registrarView.vue'


const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/usuario', name: 'Usuario', component: UsuarioView },
  { path: '/admin', name: 'Admin', component: AdminView },
  { path: '/registrar', name: 'Registrarusuario',component: RegistrarView}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Proteger rutas según rol
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if ((to.path === '/admin' && role !== 'admin') ||
      (to.path === '/usuario' && role !== 'usuario')) {
    return next('/')
  }

  next()
})

export default router

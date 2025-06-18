import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import loginView from '../views/loginView.vue';
import registrarView from '../views/registrarView.vue';
import clientView from '../views/clientView.vue';
import adminView from '../views/adminView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: loginView },
  { path: '/register', name: 'register', component: registrarView },
  { path: '/client', name: 'client', component: clientView },
  { path: '/admin', name: 'admin', component: adminView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

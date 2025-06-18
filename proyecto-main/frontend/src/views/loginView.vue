<template>
  <div>
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="error" style="color:red;">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const login = async () => {
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value });
    localStorage.setItem('user', JSON.stringify(res.data));
    if (res.data.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/client');
    }
  } catch (error) {
    error.value = 'Credenciales incorrectas';
  }
};
</script>

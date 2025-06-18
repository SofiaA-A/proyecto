<template>
  <div>
    <h2>Registrar usuario</h2>
    <form @submit.prevent="register">
      <input v-model="name" placeholder="Nombre" required />
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Registrar</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../axios';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

const register = async () => {
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: 'client', // o según corresponda
    });
    message.value = 'Registro exitoso. Redirigiendo...';
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    message.value = 'Error al registrar.';
  }
};
</script>

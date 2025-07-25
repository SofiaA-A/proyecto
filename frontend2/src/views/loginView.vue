<template>
  <div class="login-container">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2' //  Importamos SweetAlert2
const baseURL = import.meta.env.VITE_API_URL

const email = ref('')
const password = ref('')
const router = useRouter()

async function handleLogin() {
  //  Encerramos todo en la función async
  const loginData = {
  email: email.value.trim(),
  password: password.value.trim()
}

  axios.post(`${baseURL}/api/auth/login`, loginData)
    .then((res) => {
      const user = res.data.user
      localStorage.setItem('user', JSON.stringify(user))

      //  Alerta de éxito
      Swal.fire('¡Bienvenido!', 'Inicio de sesión exitoso', 'success')

      // Redirigir según el rol
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (user.role === 'client') {
        router.push('/client/dashboard')
      }
    })
    .catch(() => {
      //  Alerta de error
      Swal.fire('Error', 'Correo o contraseña incorrectos', 'error')
    })
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #1e293b;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

button {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}
</style>

<template>
  <div class="login-container">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()

const handleLogin = async () => {
  error.value = null
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value,
      password: password.value
    })
        console.log('Respuesta completa del backend:', response.data)

    // Asumiendo que la API responde con el usuario y su rol
    const user = response.data.user
    // Guardamos datos en localStorage o donde prefieras
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('user_id', user.id)


    // Redirigimos según rol
    if (user.role === 'admin') {
      router.push('/admin/dashboard')  // Ruta para la vista admin
    } else if (user.role === 'client') {
      router.push('/client/dashboard') // Ruta para la vista cliente
    } else {
      error.value = 'Rol de usuario no reconocido.'
    }
  } catch (error) {
    error.value = 'Credenciales incorrectas o error en el servidor.'
  }
}
</script>

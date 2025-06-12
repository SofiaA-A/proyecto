<template>
  <div style="text-align: center; margin-top: 50px;" class="justify-content: center; mt-5">
    <h2>Login</h2>
    <input v-model="email" placeholder="Correo" /><br><br>
    <input v-model="password" type="password" placeholder="Contraseña" /><br><br>
    <button @click="login">Ingresar</button>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)

    // 🔽 Aquí haces la petición para listar los autos
    const token = res.data.token
    const carRes = await api.get('/cars', {
      headers: {
        Authorization: token
      }
    })

    console.log('Autos del usuario:', carRes.data)

    // 🔽 Redirección después de login
    if (res.data.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/usuario')
    }
  } catch (err) {
    error.value = err.response?.data?.msg || 'Error al iniciar sesión'
  }
}
</script>

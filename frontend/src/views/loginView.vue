<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Correo" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button @click="login">Ingresar</button>
    <p v-if="error">{{ error }}</p>
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

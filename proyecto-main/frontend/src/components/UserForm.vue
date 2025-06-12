<template>
  <form @submit.prevent="registrarUsuario" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Formulario de Usuario</h2>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Nombre</label>
      <input v-model="user.name" type="text" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Correo</label>
      <input v-model="user.email" type="email" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Contraseña</label>
      <input v-model="user.password" type="password" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Rol</label>
      <input v-model="user.role" type="text" class="w-full p-2 border rounded" />
    </div>

    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Registrar Usuario
    </button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: "UserForm",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        role: ""
      }
    }
  },
  methods: {
    async registrarUsuario() {
      try {
        const response = await axios.post('http://localhost:3000/api/users', this.user)
        alert('Usuario registrado correctamente')
        console.log(response.data)
      } catch (error) {
        console.error('Error al registrar usuario:', error.response?.data || error.message)
        alert('Error al registrar el usuario')
      }
    }
  }
}
</script>

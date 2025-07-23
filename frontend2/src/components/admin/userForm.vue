<template>
  <div class="user-form">
    <h2>{{ isEdit ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h2>

    <!-- Mostrar la imagen actual al editar -->
    <div v-if="isEdit && user.image" class="image-preview">
      <p>Imagen actual:</p>
      <img :src="baseURL + user.image" alt="Imagen de usuario" class="preview-img" />
    </div>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="user.name" required />
      </div>

      <div class="form-group">
        <label>Apellido:</label>
        <input type="text" v-model="user.lastname" required />
      </div>

      <div class="form-group">
        <label>Correo electrónico:</label>
        <input type="email" v-model="user.email" required />
      </div>

      <div class="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          v-model="user.password"
          :required="!isEdit"
          placeholder="Agrega nueva contraseña"
        />
      </div>

      <div class="form-group">
        <label>Rol:</label>
        <select v-model="user.role" required>
          <option disabled value="">Seleccione un rol</option>
          <option value="admin">Administrador</option>
          <option value="client">Cliente</option>
        </select>
      </div>

      <div class="form-group">
        <label>Imagen:</label>
        <input type="file" @change="handleImageUpload" accept="image/*" />
      </div>

      <button type="submit">{{ isEdit ? 'Actualizar' : 'Registrar' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const baseURL = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()

const isEdit = ref(false)
const user = ref({
  name: '',
  lastname: '',
  email: '',
  password: '',
  role: '',
  image: ''
})
const selectedImage = ref(null) // imagen seleccionada

// Cargar datos si estamos editando
onMounted(async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    try {
      const res = await axios.get(`${baseURL}/api/users/${id}`)
      user.value.name = res.data.name
      user.value.lastname = res.data.lastname
      user.value.email = res.data.email
      user.value.role = res.data.role
      user.value.image = res.data.image // ruta de la imagen
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error)
      Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error')
    }
  }
})

// Manejar subida de imagen
const handleImageUpload = (event) => {
  selectedImage.value = event.target.files[0]
}

const submitForm = async () => {
  try {
    const id = route.params.id
    const formData = new FormData()

    // Agregar datos al FormData
    formData.append('name', user.value.name)
    formData.append('lastname', user.value.lastname)
    formData.append('email', user.value.email)
    formData.append('role', user.value.role)

    if (user.value.password && user.value.password.trim() !== '') {
      formData.append('password', user.value.password)
    }

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    if (isEdit.value) {
      await axios.put(`${baseURL}/api/users/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El usuario fue actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver usuarios'
      }).then(() => {
        router.push('/admin/users')
      })
    } else {
      await axios.post(`${baseURL}/api/users/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
        title: '¡Registrado!',
        text: 'El usuario fue registrado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver usuarios'
      }).then(() => {
        router.push('/admin/users')
      })
    }
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    Swal.fire('Error', 'Hubo un error al guardar el usuario.', 'error')
  }
}
</script>

<style scoped>
.user-form {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.user-form h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.image-preview {
  text-align: center;
  margin-bottom: 15px;
}

.preview-img {
  width: 150px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
</style>

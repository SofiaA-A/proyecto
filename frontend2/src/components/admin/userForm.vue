<template>
  <div class="user-form">
    <h2>{{ isEdit ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h2>

    <!-- Imagen actual -->
    <div v-if="isEdit && user.image" class="image-preview">
      <p>Imagen actual:</p>
      <img :src="baseURL + user.image" alt="Imagen de usuario" class="preview-img" />
    </div>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="user.name" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="form-group">
        <label>Apellido:</label>
        <input type="text" v-model="user.lastname" />
        <p v-if="errors.lastname" class="error">{{ errors.lastname }}</p>
      </div>

      <div class="form-group">
        <label>Correo electrónico:</label>
        <input type="text" v-model="user.email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          v-model="user.password"
          placeholder="Agrega nueva contraseña"
        />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label>Rol:</label>
        <select v-model="user.role">
          <option disabled value="">Seleccione un rol</option>
          <option value="admin">Administrador</option>
          <option value="client">Cliente</option>
        </select>
        <p v-if="errors.role" class="error">{{ errors.role }}</p>
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
const selectedImage = ref(null)
const user = ref({
  name: '',
  lastname: '',
  email: '',
  password: '',
  role: '',
  image: ''
})

const errors = ref({})

// Cargar datos si es edición
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
      user.value.image = res.data.image
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error')
    }
  }
})

// Validaciones
const validateForm = () => {
  errors.value = {}

  if (!user.value.name.trim()) {
    errors.value.name = 'El nombre es obligatorio.'
  }

  if (!user.value.lastname.trim()) {
    errors.value.lastname = 'El apellido es obligatorio.'
  }

  if (!user.value.email.trim()) {
    errors.value.email = 'El correo es obligatorio.'
  } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(user.value.email)) {
    errors.value.email = 'El correo no tiene un formato válido.'
  }

  // Validar password solo si es registro o si password tiene valor (edición)
  if (!isEdit.value || user.value.password) {
    const password = user.value.password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/
    if (!passwordRegex.test(password)) {
      errors.value.password =
        'La contraseña debe tener mínimo 8 caracteres, una letra, un número y un símbolo (@#$%).'
    }
  }

  if (!user.value.role) {
    errors.value.role = 'Debe seleccionar un rol.'
  }

  return Object.keys(errors.value).length === 0
}

// Imagen
const handleImageUpload = (event) => {
  selectedImage.value = event.target.files[0]
}

// Enviar datos
const submitForm = async () => {
  if (!validateForm()) {
    return Swal.fire('Formulario inválido', 'Corrige los errores antes de enviar.', 'warning')
  }

  try {
    const id = route.params.id
    const formData = new FormData()

    formData.append('name', user.value.name)
    formData.append('lastname', user.value.lastname)
    formData.append('email', user.value.email)
    formData.append('role', user.value.role)

    if (user.value.password && user.value.password.trim()) {
      formData.append('password', user.value.password)
    }

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    const respons = isEdit.value
      ? await axios.put(`${baseURL}/api/users/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      : await axios.post(`${baseURL}/api/users/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

    Swal.fire({
      title: isEdit.value ? '¡Actualizado!' : '¡Registrado!',
      text: 'El usuario fue guardado correctamente.',
      icon: 'success',
      confirmButtonText: 'Continuar'
    }).then(() => {
      router.push('/admin/users')
    })
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    Swal.fire('Error', 'Ocurrió un error al guardar el usuario.', 'error')
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}
</style>

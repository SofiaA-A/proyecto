<template>
  <div class="user-form">
    <h2>{{ isEdit ? 'Editar Geocerca' : 'Agregar Geocerca' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Longitud:</label>
        <input type="text" v-model="geocerca.lng" required />
      </div>

      <div class="form-group">
        <label>Latitud:</label>
        <input type="text" v-model="geocerca.lat" required />
      </div>

      <div class="form-group">
        <label>Radio (metros):</label>
        <input type="text" v-model="geocerca.radius" required />
      </div>

      <button type="submit">{{ isEdit ? 'Actualizar' : 'Registrar' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2' // Importamos SweetAlert2
const baseURL = import.meta.env.VITE_API_URL

const route = useRoute()
const router = useRouter()

const isEdit = ref(false)

const geocerca = ref({
  lng: '',
  lat: '',
  radius: '',
  car_id: '',
  user_id: ''
})

onMounted(() => {
  const carId = route?.params?.carId
  const userId = route?.params?.userId
  geocerca.value.car_id = parseInt(carId)
  geocerca.value.user_id = parseInt(userId)

  const id = route.params.id
  if (id) {
    isEdit.value = true
    axios.get(`${baseURL}/api/geocercas/${id}`)
      .then(res => {
        const center = res.data.center.coordinates
        geocerca.value.lng = center[1]
        geocerca.value.lat = center[0]
        geocerca.value.radius = res.data.radius
      })
      .catch(error => {
        console.error('Error al obtener la geocerca:', error)
        Swal.fire('Error', 'No se pudo cargar la geocerca.', 'error')
      })
  }
})

const submitForm = async () => {
  if (
    !geocerca.value.lng ||
    !geocerca.value.lat ||
    !geocerca.value.radius
  ) {
    Swal.fire('Atención', 'Por favor, llena todos los campos.', 'warning')
    return
  }

  try {
    const id = route.params.id

    const payload = {
      lng: geocerca.value.lng,
      lat: geocerca.value.lat,
      radius: parseInt(geocerca.value.radius),
      car_id: geocerca.value.car_id,
      user_id: geocerca.value.user_id
    }

    if (isEdit.value) {
      await axios.put(`${baseURL}/api/geocercas/${id}`, payload)
      //  Alerta de éxito
      Swal.fire({
        title: '¡Actualizado!',
        text: 'La geocerca se actualizó correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver rutas'
      }).then(() => {
        router.push(`/admin/routes/car/${geocerca.value.car_id}/${geocerca.value.user_id}`)
      })
    } else {
      await axios.post(`${baseURL}/api/geocercas`, payload)
      //  Alerta de éxito
      Swal.fire({
        title: '¡Registrado!',
        text: 'La geocerca se registró correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver rutas'
      }).then(() => {
        router.push(`/admin/routes/car/${geocerca.value.car_id}/${geocerca.value.user_id}`)
      })
    }
  } catch (error) {
    console.error('Error al guardar la geocerca:', error)
    Swal.fire('Error', 'Hubo un error al guardar la geocerca.', 'error')
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
</style>

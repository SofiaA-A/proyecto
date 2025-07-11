<template>
  <div class="user-form">
    <h2>{{ isEdit ? 'Editar Geocerca' : 'Agregar una Geocerca' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Latitud:</label>
        <input type="text" v-model="geocerca.lat" required />
      </div>

      <div class="form-group">
        <label>Longitud:</label>
        <input type="text" v-model="geocerca.lng" required />
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

const route = useRoute()
const router = useRouter()

const isEdit = ref(false)

const geocerca = ref({
  lng: '',
  lat: '',
  radius: '',
  car_id: '', // lo definimos en onMounted
  user_id: '' // podemos asumir un ID fijo o traerlo del login
})

onMounted(() => {
  // Obtenemos car_id desde la URL
  const carId = route.params.car_id
  geocerca.value.car_id = parseInt(carId)
  geocerca.value.user_id = 1000000000000000// 👈 Ajusta según tu sistema de auth

  const id = route.params.id
  if (id) {
    isEdit.value = true
    axios.get(`http://localhost:3000/api/geocercas/${id}`)
      .then(res => {
        const center = res.data.center.coordinates
        geocerca.value.lng = center[1] // latitud
        geocerca.value.lat = center[0] // longitud
        geocerca.value.radius = res.data.radius
      })
      .catch(error => {
        console.error('Error al obtener la geocerca:', error)
      })
  }
})

const submitForm = async () => {
  if (
    !geocerca.value.lng ||
    !geocerca.value.lat ||
    !geocerca.value.radius
  ) {
    alert('Por favor, llena todos los campos')
    return
  }

  try {
    const id = route.params.id

    const payload = {
      center: {
        type: 'Point',
        coordinates: [
          parseFloat(geocerca.value.lng),
          parseFloat(geocerca.value.lat)
        ]
      },
      radius: parseInt(geocerca.value.radius),
      car_id: geocerca.value.car_id,
      user_id: geocerca.value.user_id
    }

    if (isEdit.value) {
      await axios.put(`http://localhost:3000/api/geocercas/${id}`, payload)
      alert('Geocerca actualizada correctamente')
    } else {
      await axios.post('http://localhost:3000/api/geocercas', payload)
      alert('Geocerca registrada correctamente')
    }

    // 🔥 Redirigir al mapa con el car_id
    router.push(`/admin/routes/car/${geocerca.value.car_id}`)
  } catch (error) {
    console.error('Error al guardar la geocerca:', error)
    alert('Hubo un error al guardar la geocerca')
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

<template>
  <div class="form-container">
    <h2>Agregar Punto a Ruta</h2>
    <form @submit.prevent="submitForm">
      <label>Latitud:</label>
      <input v-model="route.lat" type="text" required />

      <label>Longitud:</label>
      <input v-model="route.lng" type="text" required />

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2' // Importamos SweetAlert2

const baseURL = import.meta.env.VITE_API_URL

// Props
const props = defineProps({
  carId: {
    type: Number,
    required: true
  }
})

const router = useRouter()

// Estado reactivo
const route = ref({
  lat: '',
  lng: '',
  car_id: null
})

// Asignar car_id al montar
onMounted(() => {
  route.value.car_id = props.carId
})

const submitForm = async () => {
  try {
    await axios.post(`${baseURL}/api/route/`, route.value)

    // Mostrar éxito con SweetAlert2
    Swal.fire({
      title: '¡Guardado!',
      text: 'El punto de la ruta se guardó correctamente.',
      icon: 'success',
      confirmButtonText: 'Ver rutas'
    }).then(() => {
      router.push('/admin/routes')
    })
  } catch (error) {
    console.error('Error al guardar la ruta:', error)
    Swal.fire('Error', 'Ocurrió un error al guardar la ruta.', 'error')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  background-color: #10b981;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #059669;
}
</style>

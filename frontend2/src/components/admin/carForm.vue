<template>
  <div class="form-container">
    <h2>{{ isEdit ? 'Editar Carro' : 'Agregar Carro' }}</h2>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <label>Marca:</label>
      <input v-model="car.brand" type="text" required />

      <label>Modelo:</label>
      <input v-model="car.model" type="text" required />

      <label>Placa:</label>
      <input v-model="car.plate" type="text" required />

      <label>Año:</label>
      <input v-model="car.year" type="text" required />

      <label>Latitud:</label>
      <input v-model="car.lat" type="text" required />

      <label>Longitud:</label>
      <input v-model="car.lng" type="text" required />

      <label>Propietario:</label>
      <select v-model="car.user_id">
        <option :value="null">Sin propietario</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>

      <label>Imagen:</label>
      <input type="file" @change="handleImageUpload" accept="image/*" />

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2' // Importamos SweetAlert2
const baseURL = import.meta.env.VITE_API_URL

export default {
  data() {
    return {
      car: {
        brand: '',
        model: '',
        plate: '',
        year: '',
        lat: '',
        lng: '',
        image: '',
        user_id: null,
      },
      users: [],
      imageFile: null,
      isEdit: false,
    }
  },
  created() {
    this.loadUsers()
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.loadCar(id)
    }
  },
  methods: {
    async loadUsers() {
      try {
        const res = await axios.get(`${baseURL}/api/users`)
        this.users = res.data
      } catch (error) {
        console.error('Error cargando usuarios:', error)
      }
    },
    async loadCar(id) {
      try {
        const res = await axios.get(`${baseURL}/api/car/${id}`)
        this.car = res.data
      } catch (error) {
        console.error('Error cargando carro:', error)
      }
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0]
    },
    async submitForm() {
      try {
        const formData = new FormData()
        formData.append('brand', this.car.brand)
        formData.append('model', this.car.model)
        formData.append('plate', this.car.plate)
        formData.append('year', this.car.year)
        formData.append('lat', this.car.lat)
        formData.append('lng', this.car.lng)

        // Si user_id es null, enviamos cadena vacía
        formData.append('user_id', this.car.user_id === null ? '' : this.car.user_id)

        if (this.imageFile) {
          formData.append('image', this.imageFile)
        }

        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
        }

        if (this.isEdit) {
          await axios.put(`${baseURL}/api/car/${this.$route.params.id}`, formData, config)
        } else {
          await axios.post(`${baseURL}/api/car`, formData, config)
        }

        //  Alerta de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: 'El carro se guardó correctamente.',
          icon: 'success',
          confirmButtonText: 'Ir a la lista'
        }).then(() => {
          this.$router.push('/admin/cars') // Redirigir después de confirmar
        })
      } catch (error) {
        if (error.response && error.response.status === 400) {
          //  Alerta de validación
          Swal.fire('Error', error.response.data.message || 'Error de validación', 'error')
        } else {
          console.error('Error guardando carro:', error)
          Swal.fire('Error', 'Ocurrió un error inesperado al guardar el carro', 'error')
        }
      }
    },
  },
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

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

input[type="text"],
input[type="file"],
select {
  margin-bottom: 1rem;
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 15px;
  color: #334155;
}

button {
  background-color: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #059669;
}
</style>

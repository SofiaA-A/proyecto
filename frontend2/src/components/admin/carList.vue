<template>
  <div class="user-list">
    <h2>Lista de Autos</h2>

    <div class="mb-4">
      <button class="btn new" @click="$router.push('/admin/cars/new')">+ Nuevo Auto</button>
      <label for="limit">Autos por página:</label>
      <select id="limit" v-model="limit" @change="handleLimitChange">
        <option :value="5">5</option>
        <option :value="10">10</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Placa</th>
          <th>Año</th>
          <th>Latitud</th>
          <th>Longitud</th>
          <th>Imagen</th>
          <th>Usuario</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.id }}</td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.plate }}</td>
          <td>{{ car.year }}</td>
          <td>{{ car.lat }}</td>
          <td>{{ car.lng }}</td>
          <td>
            <img
              v-if="car.image"
              :src="baseURL + car.image"
              alt="Imagen"
              width="50"
              style="border-radius: 6px;"
            />
            <span v-else>Sin imagen</span>
          </td>
          <td>
            <span v-if="car.user">{{ car.user.name }}</span>
            <span v-else>-</span>
          </td>
          <td>
            <button class="btn edit" @click="editCar(car.id)">Editar</button>
            <button class="btn delete" @click="deleteCar(car.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="cars.length === 0">No hay autos registrados.</p>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const cars = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(5)
const router = useRouter()

const fetchCars = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/car?page=${currentPage.value}&limit=${limit.value}`
    )
    cars.value = res.data.cars
    totalPages.value = res.data.totalPages
  } catch (error) {
    console.error('Error al obtener autos:', error)
  }
}

const handleLimitChange = () => {
  currentPage.value = 1
  fetchCars()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCars()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCars()
  }
}

const editCar = (id) => {
  router.push(`/admin/cars/edit/${id}`)
}

const deleteCar = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este auto?')) {
    try {
      await axios.delete(`${baseURL}/api/car/${id}`)
      fetchCars()
    } catch (error) {
      console.error('Error al eliminar auto:', error)
      alert('Hubo un error al eliminar el auto')
    }
  }
}

onMounted(() => {
  fetchCars()
})
</script>

<style scoped>
/* Mismos estilos de user list */
.user-list {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.user-list h2 {
  margin-bottom: 1rem;
  color: #1e293b;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
th,
td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
th {
  background-color: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
}
tr:hover {
  background-color: #f9fafb;
}

.new {
  background-color: #10b981;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
}
.new:hover {
  background-color: #059669;
}
.btn {
  padding: 0.4rem 0.8rem;
  margin-right: 0.3rem;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  color: white;
}
.edit {
  background-color: #3b82f6;
}
.edit:hover {
  background-color: #2563eb;
}
.delete {
  background-color: #ef4444;
}
.delete:hover {
  background-color: #dc2626;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.pagination button {
  background-color: #3b82f6;
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(59, 130, 246, 0.5);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
}
.pagination button:hover:not(:disabled) {
  background-color: #2563eb;
  box-shadow: 0 5px 12px rgba(37, 99, 235, 0.7);
}
.pagination button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  box-shadow: none;
  color: #dbeafe;
}
.pagination span {
  font-weight: 600;
  color: #334155;
}

select {
  padding: 6px 12px;
  font-size: 15px;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  cursor: pointer;
  transition: border-color 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
select:hover,
select:focus {
  border-color: #3b82f6;
  outline: none;
}
</style>

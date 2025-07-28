<template>
  <div class="car-list">
    <h2>Rutas de Usuarios</h2>

    <div class="mb-4">
      <label for="limit">Autos por página:</label>
      <select id="limit" v-model="limit" @change="handleLimitChange">
        <option :value="5">5</option>
        <option :value="10">10</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Placa</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.user?.name || 'No asignado' }}</td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.plate }}</td>
          <td>
            <button class="btn edit" @click.stop="goToCarRoute(car.id, car.user?.id)">
              Ver Ruta
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="cars.length === 0">No hay autos registrados.</p>

    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Siguiente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const cars = ref([])
const page = ref(1)
const totalPages = ref(1)
const limit = ref(5)

const router = useRouter()

const fetchCars = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/cars?page=${page.value}&limit=${limit.value}`)
    cars.value = res.data.cars
    totalPages.value = res.data.totalPages
  } catch (error) {
    console.error('Error al cargar autos:', error)
  }
}

const handleLimitChange = () => {
  page.value = 1
  fetchCars()
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchCars()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchCars()
  }
}

const goToCarRoute = (carId, userId) => {
  if (!userId) {
    alert("Este vehículo no tiene un usuario asignado")
    return
  }
  router.push(`/admin/routes/car/${carId}/${userId}`)
}

onMounted(() => {
  fetchCars()
})
</script>

<style scoped>
.car-list {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.car-list h2 {
  margin-bottom: 1rem;
  color: #1e293b;
}
.mb-4 {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
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
.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
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
}
select:hover,
select:focus {
  border-color: #3b82f6;
  outline: none;
}
</style>

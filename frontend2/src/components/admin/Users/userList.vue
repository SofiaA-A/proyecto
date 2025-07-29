<template>
  <div class="user-list">
    <h2>Lista de Usuarios</h2>

    <!-- Botón y selector de cantidad -->
    <div class="mb-4">
      <button class="btn new" @click="$router.push('/admin/users/new')">+ Nuevo Usuario</button>
      <label for="limit">Usuarios por página: </label>
      <select id="limit" v-model="limit" @change="handleLimitChange">
        <option :value="5">5</option>
        <option :value="10">10</option>
      </select>
    </div>
<td></td>

    <!-- Filtros -->
    <div class="filters mb-4">
      <label for="name">Filtrar por nombre:</label>
      <input
        id="name"
        v-model="filterName"
        @input="handleFilterChange"
        type="text"
        placeholder="Buscar por nombre..."
      />

      <label for="email">Filtrar por correo:</label>
      <input
        id="email"
        v-model="filterEmail"
        @input="handleFilterChange"
        type="text"
        placeholder="Buscar por email..."
      />
    </div>

    <!-- Tabla de usuarios -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Imagen</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.email }}</td>
          <td>
            <img
              v-if="user.image"
              :src="baseURL + user.image"
              alt="Imagen"
              width="50"
              style="border-radius: 6px;"
            />
            <span v-else>Sin imagen</span>
          </td>
          <td>{{ user.role }}</td>
          <td>
            <button class="btn edit" @click="editUser(user.id)">Editar</button>
            <button class="btn delete" @click="deleteUser(user.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="users.length === 0">No hay usuarios registrados.</p>

    <!-- Paginación -->
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

const users = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(5)
const filterName = ref('')
const filterEmail = ref('')
const router = useRouter()

const fetchUsers = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/users?page=${currentPage.value}&limit=${limit.value}&name=${filterName.value}&email=${filterEmail.value}`
    )
    users.value = res.data.users
    totalPages.value = res.data.totalPages
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

const handleLimitChange = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchUsers()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchUsers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchUsers()
  }
}

const editUser = (id) => {
  router.push(`/admin/users/edit/${id}`)
}

const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    try {
      await axios.delete(`${baseURL}/api/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      alert('Hubo un error al eliminar el usuario')
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
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

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filters label {
  font-weight: 600;
  color: #1e293b;
}

.filters input {
  padding: 6px 12px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
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

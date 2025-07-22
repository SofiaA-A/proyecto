<template>
  <div class="user-list">
    <h2>Lista de Usuarios</h2>

    <!-- Botón para agregar nuevo usuario -->
    <div class="mb-4">
      <button class="btn new" @click="$router.push('/admin/users/new')">+ Nuevo Usuario</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
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
          <td>{{ user.role }}</td>
          <td>
            <button class="btn edit" @click="editUser(user.id)">Editar</button>
            <button class="btn delete" @click="deleteUser(user.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="users.length === 0">No hay usuarios registrados.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL

const users = ref([])
const router = useRouter()

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/users`)
    users.value = res.data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
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

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

th, td {
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
</style>

<template>
  <div class="user-list">
    <h2>Lista de Usuarios</h2>
    <!-- Botón para agregar nuevo auto -->
    <div class="mb-4">
      <button class="btn new" @click="$router.push('/admin/users/new')">+ Nuevo Usuario</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="users.length === 0">No hay usuarios registrados.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])

const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users')
    users.value = res.data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
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
</style>

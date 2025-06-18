<template>
  <div>
    <h2>Lista de Usuarios</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!-- Opcional: botones para editar o eliminar -->
            <button @click="editUser(user.id)">Editar</button>
            <button @click="deleteUser(user.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: []
    }
  },
  created() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const res = await axios.get('http://localhost:3000/api/users');
        this.users = res.data;
      } catch (error) {
        console.error('Error cargando usuarios', error);
      }
    },
    editUser(id) {
      this.$router.push(`/admin/users/edit/${id}`);
    },
    async deleteUser(id) {
      if (confirm('¿Seguro que quieres eliminar este usuario?')) {
        try {
          await axios.delete(`http://localhost:3000/api/users/${id}`);
          this.loadUsers();
        } catch (error) {
          console.error('Error eliminando usuario', error);
        }
      }
    }
  }
}
</script>

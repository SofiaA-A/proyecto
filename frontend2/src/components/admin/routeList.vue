<template>
  <div>
    <h2>Lista de Rutas</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Origen</th>
          <th>Destino</th>
          <th>Distancia (km)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="route in routes" :key="route.id">
          <td>{{ route.id }}</td>
          <td>{{ route.origin }}</td>
          <td>{{ route.destination }}</td>
          <td>{{ route.distance }}</td>
          <td>
            <button @click="editRoute(route.id)">Editar</button>
            <button @click="deleteRoute(route.id)">Eliminar</button>
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
      routes: []
    }
  },
  created() {
    this.loadRoutes();
  },
  methods: {
    async loadRoutes() {
      try {
        const res = await axios.get('http://localhost:3000/api/routes');
        this.routes = res.data;
      } catch (error) {
        console.error('Error cargando rutas', error);
      }
    },
    editRoute(id) {
      this.$router.push(`/admin/routes/edit/${id}`);
    },
    async deleteRoute(id) {
      if (confirm('¿Seguro que quieres eliminar esta ruta?')) {
        try {
          await axios.delete(`http://localhost:3000/api/routes/${id}`);
          this.loadRoutes();
        } catch (error) {
          console.error('Error eliminando ruta', error);
        }
      }
    }
  }
}
</script>

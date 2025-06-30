<template>
  <div class="car-list">
    <h2>Lista de Autos</h2>

    <!-- Botón para agregar nuevo auto -->
    <div class="mb-4">
      <button class="btn new" @click="$router.push('/admin/cars/new')">+ Nuevo Vehículo</button>
    </div>

    <div v-if="loading" class="loading-text">Cargando autos...</div>
    <div v-if="error" class="error-text">Error: {{ error }}</div>

    <table v-if="!loading && !error">
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
          <th>Propietario</th>
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
            <img v-if="car.image" :src="`http://localhost:3000${car.image}`" alt="Auto" width="80" style="border-radius: 6px;" />
            <span v-else>Sin imagen</span>
          </td>
          <td>{{ car.ownerName }}</td>
          <td>
            <button class="btn edit" @click="editCar(car.id)">Editar</button>
            <button class="btn delete" @click="deleteCar(car.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CarList',
  data() {
    return {
      cars: [],
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchCars() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/api/car');
        this.cars = response.data.map(car => ({
          id: car.id,
          brand: car.brand || 'N/A',
          model: car.model || 'N/A',
          plate: car.plate || 'N/A',
          year: car.year   || 'N/A',
          lat: car. lat    || 'N/A',
          lng: car.lng     || 'N/A',
          image: car.image || null,
          ownerName: car.user ? car.user.name : 'Sin propietario',
        }));
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar autos';
      } finally {
        this.loading = false;
      }
    },
    editCar(id) {
      this.$router.push(`/admin/cars/edit/${id}`);
    },
    async deleteCar(id) {
      const confirmDelete = confirm('¿Estás segura que deseas eliminar este auto?');
      if (!confirmDelete) return;

      try {
        await axios.delete(`http://localhost:3000/api/car/${id}`);
        // Actualizar lista quitando el auto eliminado
        this.cars = this.cars.filter(car => car.id !== id);
      } catch (error) {
        console.error('Error al eliminar el auto:', error.response?.data || error);
        alert('No se pudo eliminar el auto.');
      }
    }
  },
  mounted() {
    this.fetchCars();
  },
};
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

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

th, td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  color: #334155;
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

.delete {
  background-color: #ef4444;
}

.delete:hover {
  background-color: #dc2626;
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

<template>
  <div class="car-list">
    <h2>Rutas de Usuarios</h2>
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
            <button class="btn edit" @click.stop="goToCarRoute(car.id)"> Ver Ruta</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RouteList",
  data() {
    return {
      cars: []
    };
  },
  created() {
    this.loadCars();
  },
  methods: {
    async loadCars() {
      try {
        const res = await axios.get("http://localhost:3000/api/cars");
        this.cars = res.data;
      } catch (error) {
        console.error("Error cargando autos", error);
      }
    },
    goToCarRoute(carId) {
      this.$router.push(`/admin/routes/car/${carId}`);
    },
    // goToCreateRoute(carId) {
    //   this.$router.push(`/admin/routes/new/${carId}`);
    // },
    async deleteRoute(carId) {
      const confirmDelete = confirm('¿Estás seguro de que deseas eliminar todas las rutas de este auto?');
      if (!confirmDelete) return;

      try {
        await axios.delete(`http://localhost:3000/api/routes/car/${carId}`);
        alert('Rutas eliminadas correctamente.');
        this.loadCars(); // refresca la tabla
      } catch (error) {
        console.error('Error al eliminar rutas:', error);
        alert('Hubo un error al eliminar las rutas.');
      }
    }
  }
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

th,
td {
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
  transition: background-color 0.2s ease;
}

.edit {
  background-color: #3b82f6;
}

.edit:hover {
  background-color: #2563eb;
}

.create {
  background-color: #26b609;
}

.create:hover {
  background-color: #1a8605;
}

.delete {
  background-color: #d63030;
}

.delete:hover {
  background-color: #b91c1c;
}
</style>

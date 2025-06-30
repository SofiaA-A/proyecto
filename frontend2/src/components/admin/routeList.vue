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
        <tr v-for="car in cars" :key="car.id" @click="goToRoute(car.id)" style="cursor: pointer;">
          <td>{{ car.user?.name || 'No asignado' }}</td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.plate }}</td>
          <td>
            <button class="btn edit" @click.stop="goToRoute(car.id)">Ver Ruta</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ListCar",
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
    goToRoute(carId) {
      this.$router.push(`/admin/routes/car/${carId}`);
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
  transition: background-color 0.2s ease;
}

.edit {
  background-color: #3b82f6;
}

.edit:hover {
  background-color: #2563eb;
}
</style>

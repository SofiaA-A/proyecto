<!-- CarList.vue -->
<template>
  <div>
    <h2>Lista de Carros</h2>
    <button @click="$router.push('/admin/cars/new')">Agregar Carro</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Placa</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.id }}</td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.plate }}</td>
          <td>
            <button @click="editCar(car.id)">Editar</button>
            <button @click="deleteCar(car.id)">Eliminar</button>
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
      cars: []
    }
  },
  created() {
    this.loadCars();
  },
  methods: {
    async loadCars() {
      try {
        const res = await axios.get('http://localhost:3000/api/cars');
        this.cars = res.data;
      } catch (error) {
        console.error('Error cargando carros', error);
      }
    },
    editCar(id) {
      this.$router.push(`/admin/cars/edit/${id}`);
    },
    async deleteCar(id) {
      if (confirm('¿Seguro que quieres eliminar este carro?')) {
        try {
          await axios.delete(`http://localhost:3000/api/cars/${id}`);
          this.loadCars(); // recargar lista
        } catch (error) {
          console.error('Error eliminando carro', error);
        }
      }
    }
  }
}
</script>

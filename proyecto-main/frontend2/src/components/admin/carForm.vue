<template>
  <div>
    <h2>{{ isEdit ? 'Editar Carro' : 'Agregar Carro' }}</h2>
    <form @submit.prevent="submitForm">
      <label>Marca:</label>
      <input v-model="car.brand" required />

      <label>Modelo:</label>
      <input v-model="car.model" required />

      <label>Placa:</label>
      <input v-model="car.plate" required />

      <label>Color:</label>
      <input v-model="car.color" />

      <!-- Otros campos según tu modelo -->

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      car: {
        brand: '',
        model: '',
        plate: '',
        color: ''
      },
      isEdit: false
    }
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.loadCar(id);
    }
  },
  methods: {
    async loadCar(id) {
      try {
        const res = await axios.get(`http://localhost:3000/api/cars/${id}`);
        this.car = res.data;
      } catch (error) {
        console.error('Error cargando carro', error);
      }
    },
    async submitForm() {
      try {
        if (this.isEdit) {
          await axios.put(`http://localhost:3000/api/cars/${this.$route.params.id}`, this.car);
        } else {
          await axios.post('http://localhost:3000/api/cars', this.car);
        }
        this.$router.push('/admin/cars');
      } catch (error) {
        console.error('Error guardando carro', error);
      }
    }
  }
}
</script>

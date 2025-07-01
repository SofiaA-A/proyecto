<template>
  <div class="form-container">
    <h2>Agregar Punto a Ruta</h2>
    <form @submit.prevent="submitForm">
      <label>Latitud:</label>
      <input v-model="route.lat" type="text" required />

      <label>Longitud:</label>
      <input v-model="route.lng" type="text" required />

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['carId'],
  data() {
    return {
      route: {
        lat: '',
        lng: '',
        car_id: null
      }
    };
  },
  created() {
    this.route.car_id = this.carId;
  },
  methods: {
    async submitForm() {
      try {
        await axios.post('http://localhost:3000/api/route/', this.route);
        alert('Ruta guardada exitosamente');
        this.$router.push('/admin/routes');
      } catch (error) {
        console.error('Error al guardar la ruta:', error);
        alert('Ocurrió un error al guardar la ruta');
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  background-color: #10b981;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #059669;
}
</style>

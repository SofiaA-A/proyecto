<template>
  <div class="car-info">
    <h2>Auto asignado</h2>
    <div v-if="car">
      <img :src="`${baseURL}${car.image}`" alt="Imagen del auto" style="width: 300px;" />
      <p><strong>Marca:</strong> {{ car.brand }}</p>
      <p><strong>Modelo:</strong> {{ car.model }}</p>
      <p><strong>Placa:</strong> {{ car.plate }}</p>
      <p><strong>Año:</strong> {{ car.year }}</p>
    </div>
    <div v-else>
      <p>No se encontró ningún auto asignado.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export default {
  name: 'CarInfo',
  data() {
    return {
      car: null,
      baseURL
    };
  },
  mounted() {
    this.fetchCar();
  },
  methods: {
    async fetchCar() {
      const userRaw = localStorage.getItem('user');
      if (!userRaw) {
        console.error('No hay user en localStorage');
        return;
      }

      const user = JSON.parse(userRaw);
      const userId = user.id;
      console.log("Obteniendo auto del usuario:", userId);

      try {
        const response = await axios.get(`${baseURL}/api/car/user/${userId}`);
        console.log("Auto encontrado:", response.data);
        this.car = response.data;
      } catch (error) {
        console.error('Error al obtener el auto del usuario:', error);
      }
    }
  }
};
</script>

<style scoped>
.car-info {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #fefefe;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.car-info h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 28px;
  color: #333;
}

.car-info img {
  display: block;
  margin: 0 auto 20px auto;
  width: 100%;
  max-width: 350px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.car-info p {
  font-size: 18px;
  margin: 10px 0;
  color: #555;
}

.car-info p strong {
  color: #222;
}
</style>

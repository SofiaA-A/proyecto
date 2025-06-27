<template>
  <div class="catalog-container">
    <h2>Catálogo de Autos Disponibles</h2>

    <div v-if="loading" class="loading">Cargando autos...</div>

    <div v-else>
      <div v-if="cars.length === 0" class="no-cars">No hay autos disponibles en este momento.</div>

      <div v-else class="car-grid">
        <div class="car-card" v-for="car in cars" :key="car.id">
          <!-- Cambié esta línea para usar getImageUrl() -->
          <img :src="getImageUrl(car.image)" alt="Auto" class="car-img" />
          <h3>{{ car.brand }} {{ car.model }}</h3>
          <p><strong>Placa:</strong> {{ car.plate }}</p>
          <p><strong>Año:</strong> {{ car.year }}</p>
           <button @click="assignCar(car.id)" class="assign-button">Asignarme este auto</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AviableCars',
  data() {
    return {
      cars: [],
      loading: true
    }
  },
  methods: {
    async assignCar(carId) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Debes iniciar sesión para asignar un auto');
        return;
      }

      const userId = user.id;

      // Petición PUT para asignar el auto
      await axios.put(`http://localhost:3000/api/cars/${carId}/assign`, { userId });

      alert('Auto asignado correctamente');
      // Refrescar la lista para que el auto desaparezca del catálogo
      this.fetchAvailableCars();

    } catch (error) {
      console.error('Error al asignar auto:', error);
      alert(error.response?.data?.message || 'Error al asignar auto');
    }
  },
    async fetchAvailableCars() {
      try {
        // Opcional: usar baseURL en axios para evitar URL largas
        const res = await axios.get('http://localhost:3000/api/cars/available')
        this.cars = res.data
      } catch (error) {
        console.error('Error al obtener autos disponibles:', error)
      } finally {
        this.loading = false
      }
    },
    // Nuevo método para construir la URL completa de la imagen
    getImageUrl(imagePath) {
      if (!imagePath) {
        return '/default-car.png' // Puedes cambiar por una imagen por defecto si quieres
      }
      return `http://localhost:3000${imagePath}`
    }
  },
  mounted() {
    this.fetchAvailableCars()
  }
}
</script>

<style scoped>
.catalog-container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  text-align: center;
}

h2 {
  margin-bottom: 2rem;
  color: #1f2937;
}

.loading,
.no-cars {
  font-size: 18px;
  color: #6b7280;
}

.car-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.car-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  width: 220px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.car-card:hover {
  transform: scale(1.03);
}

.car-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.assign-button {
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.assign-button:hover {
  background-color: #1e40af;
}

</style>

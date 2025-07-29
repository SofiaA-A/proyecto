<template>
  <div class="form-container">
    <h2>{{ isEdit ? 'Editar Ruta' : 'Agregar Ruta' }}</h2>
    <form @submit.prevent="submitForm">
      <label>Latitud:</label>
      <input
        v-model="route.lat"
        type="number"
        required
        @input="validateLat"
        placeholder="Ej. 19.4326"
      />
      <span v-if="errors.lat" class="error">{{ errors.lat }}</span>

      <label>Longitud:</label>
      <input
        v-model="route.lng"
        type="number"
        required
        @input="validateLng"
        placeholder="Ej. -99.1332"
      />
      <span v-if="errors.lng" class="error">{{ errors.lng }}</span>

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      isEdit: false,
      route: {
        lat: '',
        lng: '',
        user_id: null,
        car_id: null,
      },
      errors: {
        lat: '',
        lng: '',
      },
    };
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.loadRoute(id);
    }
  },
  methods: {
    async loadRoute(id) {
      try {
        const res = await axios.get(`${baseURL}/api/routes/${id}`);
        this.route = res.data;
      } catch (error) {
        console.error('Error cargando ruta:', error);
      }
    },
    validateLat() {
      const regex = /^-?\d+(\.\d+)?$/;
      if (!regex.test(this.route.lat)) {
        this.errors.lat = 'Latitud debe ser un número válido';
      } else {
        this.errors.lat = '';
      }
    },
    validateLng() {
      const regex = /^-?\d+(\.\d+)?$/;
      if (!regex.test(this.route.lng)) {
        this.errors.lng = 'Longitud debe ser un número válido';
      } else {
        this.errors.lng = '';
      }
    },
    async submitForm() {
      this.validateLat();
      this.validateLng();

      if (this.errors.lat || this.errors.lng) {
        alert('Por favor corrige los errores en el formulario.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('lat', this.route.lat);
        formData.append('lng', this.route.lng);

        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
        };

        if (this.isEdit) {
          await axios.put(`${baseURL}/api/route/${this.$route.params.id}`, formData, config);
        } else {
          await axios.post(`${baseURL}/api/route`, formData, config);
        }

        alert('Ruta guardada exitosamente');
        this.$router.push('/admin/routes');
      } catch (error) {
        console.error('Error guardando ruta:', error);
        alert('Error al guardar la ruta');
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
  margin-bottom: 10px;
  display: block;
}
</style>

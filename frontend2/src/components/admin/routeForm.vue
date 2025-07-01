<template>
  <div class="form-container">
    <h2>{{ isEdit ? 'Editar Ruta' : 'Agregar Ruta' }}</h2>
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
  data() {
    return {
      isEdit: false,
      route: {
        lat: '',
        lng: '',
        user_id: null,
        car_id: null
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
        const res = await axios.get(`http://localhost:3000/api/routes/${id}`);
        this.route = res.data;
      } catch (error) {
        console.error('Error cargando ruta:', error);
      }
    },
    async submitForm() {
      try {
        const formData = new FormData();
        formData.append('lat', this.route.lat);
        formData.append('lng', this.route.lng);

        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
        };

        if (this.isEdit) {
          await axios.put(`http://localhost:3000/api/route/${this.$route.params.id}`, formData, config);
        } else {
          await axios.post('http://localhost:3000/api/route', formData, config);
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

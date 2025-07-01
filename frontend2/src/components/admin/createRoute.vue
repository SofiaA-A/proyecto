<template>
  <div class="p-4 border rounded shadow mt-4 max-w-md mx-auto">
    <h3 class="text-lg font-semibold mb-4">Registrar nueva ruta</h3>

    <form @submit.prevent="createRoute">
      <div class="mb-2">
        <label class="block">Latitud:</label>
        <input v-model="latitude" type="number" step="any" required class="border p-2 w-full" />
      </div>

      <div class="mb-2">
        <label class="block">Longitud:</label>
        <input v-model="longitude" type="number" step="any" required class="border p-2 w-full" />
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
        Crear Ruta
      </button>
    </form>

    <p v-if="message" class="mt-3 text-green-600">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreateRoute',
  data() {
    return {
      latitude: '',
      longitude: '',
      user_id: null,
      car_id: null,
      message: ''
    };
  },
  async mounted() {
    // Recuperar usuario logueado
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user_id = user.id;

      // Obtener el carro del usua

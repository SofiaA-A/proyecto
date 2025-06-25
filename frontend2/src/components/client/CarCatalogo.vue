<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-center">Catálogo de Vehículos Disponibles</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="car in cars"
        :key="car.id"
        class="border rounded-lg shadow-md overflow-hidden"
      >
        <img
          :src="getImageUrl(car.image)"
          alt="auto"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold">
            {{ car.brand }} - {{ car.model }}
          </h3>
          <p class="text-sm text-gray-600">Año: {{ car.year }}</p>
          <p class="text-sm text-gray-600">Precio: ${{ car.price }}</p>
          <button
            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="verDetalles(car)"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const cars = ref([])
const router = useRouter()

const getImageUrl = (img) => {
  return `http://localhost:3000/uploads/${img}`
}

const verDetalles = (car) => {
  router.push({ name: 'carInfo', params: { id: car.id } })
}

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/cars/available')
  cars.value = res.data
})
</script>

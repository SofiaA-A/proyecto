<template>
  <div>
    <h2>Rutas disponibles</h2>
    <ul>
      <li v-for="ruta in rutas" :key="ruta.id">
        {{ ruta.origen }} → {{ ruta.destino }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const rutas = ref([])

onMounted(async () => {
  const res = await api.get('/rutas') // <-- ruta que retorna rutas
  rutas.value = res.data
})
</script>

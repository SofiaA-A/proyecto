<template>
  <div>
    <h2>Autos registrados</h2>
    <ul>
      <li v-for="auto in autos" :key="auto.id">
        {{ auto.marca }} - {{ auto.modelo }} - ${{ auto.precio }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const autos = ref([])

onMounted(async () => {
  const res = await api.get('/autos')  // <-- ruta que retorna autos
  autos.value = res.data
})
</script>

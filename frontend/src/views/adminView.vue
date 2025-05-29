<template>
  <div>
    <h2>Bienvenido</h2>
    <button @click="logout">Cerrar sesión</button>

    <h2>Recorridos de todos los autos</h2>
    <ul>
      <li v-for="r in recorridos" :key="r.id">
        {{ r.origen }} → {{ r.destino }} (Auto ID: {{ r.car_id }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'

const router = useRouter()
const recorridos = ref([])

onMounted(async () => {
  const res = await api.get('/recorridos/admin')
  recorridos.value = res.data
})

function logout() {
  localStorage.removeItem('token')  // Borra el token guardado
  router.push('/login')             // Redirige al login
}
</script>

<template>
  <div>
    <h2>Bienvenido</h2>
    <button @click="logout">Cerrar sesión</button>

    <h2>Recorridos del Usuario</h2>
    <ul>
      <li v-for="r in recorridos" :key="r.id">
        {{ r.origen }} → {{ r.destino }}
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
  const res = await api.get('/recorridos/usuario')
  recorridos.value = res.data
})

function logout() {
  localStorage.removeItem('token')  // Borra el token guardado
  router.push('/login')             // Redirige al login
}
</script>

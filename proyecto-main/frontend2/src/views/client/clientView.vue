<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <h2>Cliente</h2>
      <ul>
        <li><router-link to="/client/dashboard"> Inicio</router-link></li>
        <li><router-link to="/client/car-info"> Datos del Carro</router-link></li>
        <li><router-link to="/client/car-route"> Ruta</router-link></li>
        <li><a href="#" @click="logout"> Salir</a></li>
      </ul>
    </aside>

    <main class="main-content">
      <!-- Aquí se muestran las sub-vistas -->
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'ClientView',
  methods: {
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 15px;
}

.sidebar a,
.sidebar .router-link-active {
  color: white;
  text-decoration: none;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
}
</style>

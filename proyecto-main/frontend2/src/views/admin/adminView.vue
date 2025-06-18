<!-- src/views/AdminView.vue -->
<template>
  <div class="admin-layout">
    <!-- Cabecera o barra superior -->
    <header class="admin-header">
      <h1>Panel de Administración</h1>
      <p>Hola, {{ userName }}</p>
    </header>

    <!-- Contenedor principal con barra lateral y contenido -->
    <div class="admin-content">
      <!-- Barra lateral -->
      <aside class="admin-sidebar">
        <nav>
          <ul>
            <li><router-link to="/admin/users">Usuarios</router-link></li>
            <li><router-link to="/admin/cars">Carros</router-link></li>
            <li><router-link to="/admin/routes">Rutas</router-link></li>
          </ul>
        </nav>
      </aside>

      <!-- Área para cargar sub-vistas -->
      <main class="admin-main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  computed: {
    userName() {
      // Si tienes login, puedes obtener el nombre del usuario admin desde el localStorage o store
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || 'Admin';
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.admin-header {
  background-color: #222;
  color: white;
  padding: 1rem;
  text-align: center;
}
.admin-content {
  display: flex;
  flex: 1;
}
.admin-sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 1rem;
}
.admin-main {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
.admin-sidebar ul {
  list-style: none;
  padding: 0;
}
.admin-sidebar li {
  margin: 10px 0;
}
</style>

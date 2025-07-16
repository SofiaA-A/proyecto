<template>
  <div class="admin-layout">
    <!-- Cabecera -->
    <header class="admin-header">
      <h1>Bienvenido </h1>
      <p>Hola, {{ userName }}</p>

      <!-- Botón hamburguesa -->
      <button class="menu-toggle" @click="toggleSidebar">☰</button>
    </header>

    <!-- Contenedor principal -->
    <div class="admin-content">
      <!-- Menú lateral -->
      <aside :class="['admin-sidebar', { 'sidebar-open': sidebarOpen }]">
        <nav>
          <ul>
            <li><router-link to="/client/dashboard" @click="closeSidebar">Inicio</router-link></li>
            <li><router-link to="/client/car-info" @click="closeSidebar">Datos del Carro</router-link></li>
            <li><router-link to="/client/available-cars" @click="closeSidebar">Autos Disponibles</router-link></li>
            <li><router-link to="/client/car-route" @click="closeSidebar">Ruta</router-link></li>
            <li><a href="/login" @click="logout" class="logout">Salir</a></li>
          </ul>
        </nav>
      </aside>

      <!-- Vista principal -->
      <main class="admin-main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      sidebarOpen: false
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
    logout() {
      localStorage.clear();
    }
  },
  computed: {
    userName() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || 'Admin';
    }
  }
}
</script>

<style scoped>
/* Estructura general */
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* Cabecera */
.admin-header {
  background-color: #1e293b;
  color: white;
  padding: 0.1rem 2rem;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Botón hamburguesa oculto por defecto */
.menu-toggle {
  display: none;
  font-size: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* Contenido dividido en sidebar y vista */
.admin-content {
  display: flex;
  flex: 1;
  background-color: #f8fafc;
}

/* Menú lateral */
.admin-sidebar {
  width: 220px;
  background-color: #f1f5f9;
  padding: 2rem 1rem;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.08);
}

.admin-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-sidebar a {
  display: block;
  padding: 12px 18px;
  border-radius: 8px;
  text-decoration: none;
  color: #1e293b;
  font-weight: 500;
  transition: 0.3s ease;
  background-color: transparent;
}

.admin-sidebar a:hover,
.admin-sidebar a.router-link-exact-active {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Estilo del botón "Salir" */
.admin-sidebar a.logout {
  color: #dc2626;
  font-weight: bold;
}

.admin-sidebar a.logout:hover {
  background-color: #dc2626;
  color: white;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

/* Vista principal */
.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #ffffff;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.03);
}

/* --RESPONSIVE ----------- */
@media (max-width: 768px) {
  /* Mostrar botón hamburguesa */
  .menu-toggle {
    display: block;
  }

  /* Sidebar oculto por defecto */
  .admin-sidebar {
    position: fixed;
    left: -250px;
    top: 0;
    height: 100%;
    width: 220px;
    background-color: #f1f5f9;
    padding: 2rem 1rem;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 1000;
  }

  /* Sidebar visible cuando se abre */
  .admin-sidebar.sidebar-open {
    left: 0;
  }

  /* La vista principal ocupa todo el ancho */
  .admin-main {
    padding: 1rem;
  }
}
</style>

<template>
  <div>
    <h2>Ruta del Vehículo</h2>

    <LMap
      v-if="routeCoords.length"
      ref="map"
      style="height: 500px; width: 100%"
      :zoom="13"
      :center="mapCenter"
    >
      <LTileLayer :url="tileUrl" :attribution="attribution" />

      <!-- Marcadores para cada punto -->
      <LMarker
        v-for="(coord, index) in routeCoords"
        :key="index"
        :lat-lng="coord" 
      >
        <LPopup>
          Punto {{ index + 1 }}<br />
          Latitud: {{ coord[0] }}<br />
          Longitud: {{ coord[1] }}
        </LPopup>
      </LMarker>

      <!-- Línea que une todos los puntos -->
      <LPolyline :lat-lng="routeCoords" color="purple" /> <!-- ✅ corregido -->

      <!-- Círculo de la geocerca -->
      <LCircle
        v-if="geocercaLngLat"
        :lat-lng="geocercaLngLat"
        :radius="geocerca.radius"
        color="purple"
      />
    </LMap>

    <div v-else>
      <p>No hay coordenadas suficientes para mostrar una ruta.</p>
    </div>

    <!-- Botones -->
    <button class="add-btn" @click="goToAddRoute">+ Agregar Nueva Ruta</button>
    <button class="add-btn" @click="goToAddGeocerca">+ Crear una Geocerca</button>

    <!-- Información del vehículo -->
    <div v-if="car && routes.length" class="info-container">
      <h3>Información del Vehículo</h3>
      <p><strong>Usuario:</strong> {{ car.user?.name || 'Sin propietario' }}</p>
      <p><strong>Marca:</strong> {{ car.brand }}</p>
      <p><strong>Modelo:</strong> {{ car.model }}</p>

      <h4>Coordenadas registradas en la ruta:</h4>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(route, index) in routes" :key="route.id">
            <td>{{ index + 1 }}</td>
            <td>{{ route.lat }}</td>
            <td>{{ route.lng }}</td>
            <td>
              <button @click="deleteRoute(route.id)" class="delete-btn">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
  LPopup,
  LCircle
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Iconos Leaflet para Vue 3
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export default {
  name: "CarRouteAdmin",
  components: { LMap, LTileLayer, LMarker, LPolyline, LPopup, LCircle },
  data() {
    return {
      car: null,
      routes: [],
      routeCoords: [],
      geocerca: null,
      geocercaLngLat: null, // ✅ Añadido para la geocerca
      mapCenter: [20.6597, -103.3496], // Valor por defecto (Guadalajara)
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors'
    };
  },
  async mounted() {
    await this.loadRoutes();
    await this.loadGeocerca();
  },
  methods: {
    async loadRoutes() {
      const carId = this.$route.params.carId;
      try {
        const response = await axios.get(`http://localhost:3000/api/route/car/${carId}`);
        const data = response.data;

        this.car = data.car || null;
        this.routes = (data.routes || []).map(route => {
          if (route.latlong && Array.isArray(route.latlong.coordinates)) {
            return {
              ...route,
              lng: route.latlong.coordinates[0],
              lat: route.latlong.coordinates[1]
            };
          }
          return route;
        });

        const coords = [];
        if (this.car?.latlong?.coordinates) {
          const [lng, lat] = this.car.latlong.coordinates;
          coords.push([lat, lng]); // ✅ corregido
        }
        this.routes.forEach(r => {
          if (r.lng !== undefined && r.lat !== undefined) {
            coords.push([r.lat, r.lng]); // ✅ corregido
          }
        });

        this.routeCoords = coords;

        // Centrar el mapa en la primera coordenada si existe
        if (coords.length > 0) {
          this.mapCenter = coords[0];
        }
      } catch (error) {
        console.error("Error cargando rutas:", error);
        alert("Error al cargar rutas");
      }
    },
    async loadGeocerca() {
      try {
        const carId = this.$route.params.carId;
        const response = await axios.get(`http://localhost:3000/api/geocercas/car/${carId}`);
        this.geocerca = response.data;

        // Centrar el mapa y preparar lat-lng para el círculo
        if (this.geocerca && this.geocerca.center?.coordinates) {
          const [lng, lat] = this.geocerca.center.coordinates;
          this.mapCenter = [lat, lng]; // ✅ corregido
          this.geocercaLngLat = [lat, lng]; // ✅ corregido
        }

        console.log("Geocerca cargada:", this.geocerca);
      } catch (error) {
        console.error("Error cargando geocerca:", error);
      }
    },
    async deleteRoute(routeId) {
      if (!confirm("¿Estás seguro que deseas eliminar esta ruta?")) return;

      try {
        await axios.delete(`http://localhost:3000/api/route/${routeId}`);
        alert("Ruta eliminada correctamente");
        await this.loadRoutes();
      } catch (error) {
        console.error("Error eliminando ruta:", error);
        alert("No se pudo eliminar la ruta");
      }
    },
    goToAddRoute() {
      this.$router.push(`/admin/routes/new/${this.car.id}`);
    },
    goToAddGeocerca() {
      this.$router.push(`/admin/geocerca/new/${this.car.id}`);
    }
  }
};
</script>

<style scoped>
.info-container {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.add-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}

.add-btn:hover {
  background-color: #218838;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>

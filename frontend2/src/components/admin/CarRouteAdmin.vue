<template>
  <div>
    <h2>Ruta del Vehículo</h2>

    <LMap
      v-if="routeCoords.length"
      ref="map"
      style="height: 500px; width: 100%"
      :zoom="9"
      :center="mapCenter"
    >
      <LTileLayer :url="tileUrl" :attribution="attribution" />

      <!-- Marcadores para cada punto -->
      <LMarker
        v-for="(coord, index) in routeCoords"
        :key="index"
        :lat-lng="coord"
        :icon="getMarkerIcon(coord)"
      >
        <LPopup>
          Punto {{ index + 1 }}<br />
          Latitud: {{ coord[0] }}<br />
          Longitud: {{ coord[1] }}
        </LPopup>
      </LMarker>

      <!-- Línea que une todos los puntos -->
      <LPolyline
        v-if="routeCoords.length"
        :lat-lngs="routeCoords"
        color="purple"
      />

      <!--  Mostrar todas las geocercas -->
      <LCircle
        v-for="(fence, index) in geocercas"
        :key="`fence-${index}`"
        :lat-lng="[fence.center.coordinates[1], fence.center.coordinates[0]]"
        :radius="fence.radius"
        color="purple"
        fill-opacity="0.2"
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
      <p><strong>Usuario:</strong> {{ routes.length && routes[0].user ? routes[0].user.name : 'Sin propietario' }}</p>
      <p><strong>Marca:</strong> {{ car.brand }}</p>
      <p><strong>Modelo:</strong> {{ car.model }}</p>

      <h4>Coordenadas registradas en la ruta:</h4>
      <table>
        <thead>
          <tr>
            <th>ID</th>
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
const baseURL = import.meta.env.VITE_API_URL

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
      geocercas: [],         // Todas las geocercas
      mapCenter: [20.6597, -103.3496], // Valor por defecto (Guadalajara)
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors'
    };
  },
  async mounted() {
    await this.loadRoutes();
    await this.loadGeocercas();
  },
  methods: {
    async loadRoutes() {
      const carId = this.$route.params.carId;
      try {
        const response = await axios.get(`${baseURL}/api/route/car/${carId}`);
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
          coords.push([lat, lng]);
        }
        this.routes.forEach(r => {
          if (r.lng !== undefined && r.lat !== undefined) {
            coords.push([r.lat, r.lng]);
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
    async loadGeocercas() {
      try {
        const carId = this.$route.params.carId;
        const response = await axios.get(`${baseURL}/api/geocercas/car/${carId}`);
        const fences = response.data;

        this.geocercas = Array.isArray(fences) ? fences : [fences];
        console.log("Geocercas cargadas:", this.geocercas);
      } catch (error) {
        console.error("Error cargando geocercas:", error);
      }
    },
    getMarkerIcon(coord) {
      //  Revisar si el punto está dentro de alguna geocerca
      let isInsideAnyFence = false;

      for (const fence of this.geocercas) {
        const center = [
          fence.center.coordinates[1],
          fence.center.coordinates[0]
        ];
        const distance = this.getDistance(coord, center);
        if (distance <= fence.radius) {
          isInsideAnyFence = true;
          break;
        }
      }

      return L.icon({
        iconUrl: isInsideAnyFence
          ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
          : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
    },
    getDistance(coord1, coord2) {
      const R = 6371e3; // Radio de la Tierra en metros
      const lat1 = coord1[0] * Math.PI / 180;
      const lat2 = coord2[0] * Math.PI / 180;
      const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
      const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distancia en metros
    },
    async deleteRoute(routeId) {
      if (!confirm("¿Estás seguro que deseas eliminar esta ruta?")) return;

      try {
        await axios.delete(`${baseURL}/api/route/${routeId}`);
        alert("Ruta eliminada correctamente");
        await this.loadRoutes();
      } catch (error) {
        console.error("Error eliminando ruta:", error);
        alert("No se pudo eliminar la ruta");
      }
    },
    goToAddRoute() {
      if (this.car?.user_id) {
        this.$router.push(`/admin/routes/new/${this.car.id}/${this.car.user_id}`);
      } else {
        alert("Este vehículo no tiene un usuario asignado");
      }
    },
    goToAddGeocerca() {
      if (this.car?.user_id) {
        this.$router.push(`/admin/geocerca/new/${this.car.id}/${this.car.user_id}`);
      } else {
        alert("Este vehículo no tiene un usuario asignado");
      }
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

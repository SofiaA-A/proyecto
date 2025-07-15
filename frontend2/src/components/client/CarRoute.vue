<template>
  <div>
    <LMap
      style="height: 500px; width: 100%"
      :zoom="zoom"
      :center="center"
    >
      <LTileLayer :url="tileUrl" :attribution="attribution" />

      <!-- Punto de partida del auto -->
      <!-- <LMarker :lat-lng="carPosition">
        <LPopup>Inicio del vehículo</LPopup>
      </LMarker> -->

      <!-- Marcadores de la ruta -->
      <LMarker
        v-for="(point, index) in routePoints"
        :key="index"
        :lat-lng="point"
        :icon="getMarkerIcon(point)"
      >
        <LPopup>Punto {{ index + 1 }}</LPopup>
      </LMarker>

      <!-- Línea de la ruta -->
      <LPolyline :lat-lngs="[carPosition, ...routePoints]" :color="'purple'" />

      <!-- Geocerca -->
      <LCircle
        v-if="geoFenceCenter && geoFenceRadius"
        :lat-lng="geoFenceCenter"
        :radius="geoFenceRadius"
        color="purple"
        fill-opacity="0.2"
      />
    </LMap>

    <!-- Tabla de rutas -->
    <div class="info-container" v-if="routes.length > 0">
      <h3>Rutas del vehículo</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Latitud</th>
            <th>Longitud</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(route, index) in routes" :key="route.id">
            <td>{{ index === 0 ? 'Inicio' : index }}</td>
            <td>{{ formatDate(route.createdAt) }}</td>
            <td>{{ route.latlong.coordinates[1].toFixed(6) }}</td>
            <td>{{ route.latlong.coordinates[0].toFixed(6) }}</td>
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
  LPopup,
  LPolyline,
  LCircle
} from "@vue-leaflet/vue-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"

// Iconos para los marcadores
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  name: "CarRoute",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
    LCircle
  },
  data() {
    return {
      zoom: 13,
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors',
      carPosition: [0, 0],      // punto inicial
      routePoints: [],          // puntos de ruta
      routes: [],               // rutas completas para la tabla
      center: [0, 0],           // centro del mapa
      geoFenceCenter: null,     // centro de la geocerca
      geoFenceRadius: 0         // radio de la geocerca en metros
    }
  },
  async mounted() {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const userId = user?.id
      if (!userId) throw new Error("Usuario no autenticado")

      // Obtener el auto del cliente
      const carRes = await axios.get(`http://localhost:3000/api/cars/user/${userId}`)
      const car = carRes.data

      if (!car || !car.latlong) throw new Error("Carro sin coordenadas")

      const [lng, lat] = car.latlong.coordinates
      this.carPosition = [lat, lng]
      this.center = [lat, lng]

      // Construir la primera "ruta" desde el carro
      const initialRoute = {
        id: "car-initial",
        latlong: car.latlong,
        createdAt: car.createdAt || new Date().toISOString()
      }

      // Obtener las rutas asociadas a ese carro
      const routeRes = await axios.get(`http://localhost:3000/api/route/car/${car.id}`)
      const apiRoutes = routeRes.data.routes || []

      // Combinar la ruta inicial del carro con las rutas del backend
      this.routes = [initialRoute, ...apiRoutes]

      this.routePoints = this.routes.map(r => {
        const [lng, lat] = r.latlong.coordinates
        return [lat, lng]
      })

      // 🔵 Obtener la geocerca asociada al carro
      const geoRes = await axios.get(`http://localhost:3000/api/geocercas/car/${car.id}`)
      if (geoRes.data && geoRes.data.center && geoRes.data.radius) {
        const [geoLng, geoLat] = geoRes.data.center.coordinates
        this.geoFenceCenter = [geoLat, geoLng]
        this.geoFenceRadius = geoRes.data.radius // metros
      }
    } catch (err) {
      console.error("Error al cargar datos:", err)
    }
  },
  methods: {
    getMarkerIcon(point) {
      if (!this.geoFenceCenter || !this.geoFenceRadius) {
        return L.icon({ iconUrl: markerIcon, iconSize: [25, 41], iconAnchor: [12, 41] });
      }

      const distance = this.getDistance(point, this.geoFenceCenter);
      const isInside = distance <= this.geoFenceRadius;

      return L.icon({
        iconUrl: isInside
          ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
          : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
    },
    getDistance(coord1, coord2) {
      const R = 6371e3; // Radio de la tierra en metros
      const lat1 = coord1[0] * Math.PI / 180;
      const lat2 = coord2[0] * Math.PI / 180;
      const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
      const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distancia en metros
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("es-MX", options);
    }
  }
}
</script>

<style scoped>
.info-container {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f0f7ff;
  cursor: pointer;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>

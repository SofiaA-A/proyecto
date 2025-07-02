<template>
  <div>
    <h2>Ruta del Vehículo</h2>

    <!-- Mapa -->
    <LMap
      v-if="routeCoords.length"
      style="height: 500px; width: 100%"
      :zoom="11"
      :center="routeCoords[0]"
    >
      <LTileLayer :url="tileUrl" :attribution="attribution" />

      <LMarker v-for="(coord, index) in routeCoords" :key="index" :lat-lng="coord">
        <LPopup>Punto {{ index + 1 }}</LPopup>
      </LMarker>

      <LPolyline :lat-lngs="routeCoords" :color="'purple'" />
    </LMap>

    <div v-else>
      <p>No hay coordenadas suficientes para mostrar una ruta.</p>
    </div>

    <!-- Información del vehículo y coordenadas -->
    <div v-if="car && routes && routes.length" class="info-container">
      <h3>Información del Vehículo</h3>
      <p><strong>ID del Usuario:</strong> {{ car.id_user }}</p>
      <p><strong>Marca:</strong> {{ car.bran }}</p>
      <p><strong>Modelo:</strong> {{ car.model }}</p>

      <h4>Coordenadas registradas en la ruta:</h4>
      <table>
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Latitud</th>
            <th>Longitud</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in routes" :key="route.id">
            

          </tr>
        </tbody>
      </table>
      <ul class="coord-list">
        <li v-for="(r, index) in routes" :key="r.id">
          <span class="point-icon">📍</span>
          <span class="coord-text">
            Ruta {{ index + 1 }} →
            Latitud: <strong>{{ r.latlong.coordinates[1] }}</strong>,
            Longitud: <strong>{{ r.latlong.coordinates[0] }}</strong>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
  LPopup
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Iconos de Leaflet
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
  name: "AdminRouteMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LPopup
  },
  data() {
    return {
      routeCoords: [],
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors',
      user: null,
      car: null,
      routes: []
    };
  },
  async created() {
    const carId = this.$route.params.carId;
    try {
      const response = await fetch(`http://localhost:3000/api/route/car/${carId}`);
      const data = await response.json();
      console.log('datos de la ruta:', data);

      this.routes = data.routes || [];
      this.user = data.user || null;
      this.car = data.car || null;

      const coords = [];

      if (this.car && this.car.latlong && this.car.latlong.coordinates) {
        const [lng, lat] = this.car.latlong.coordinates;
        coords.push([lat, lng]);
      }

      this.routes.forEach(r => {
        if (r.latlong && r.latlong.coordinates) {
          const [lng, lat] = r.latlong.coordinates;
          coords.push([lat, lng]);
        }
      });

      this.routeCoords = coords;
    } catch (error) {
      console.error("Error al cargar ruta:", error);
    }
  }
};
</script>

<style scoped>
/* Estilo general del contenedor */
.info-container {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* Títulos */
.info-container h3,
.info-container h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

/* Lista de coordenadas */
.coord-list {
  list-style: none;
  padding-left: 0;
  margin-top: 1rem;
}

.coord-list li {
  display: flex;
  align-items: center;
  background: #fff;
  margin-bottom: 8px;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Icono de ubicación */
.point-icon {
  font-size: 18px;
  margin-right: 8px;
}

/* Texto de la coordenada */
.coord-text {
  font-family: monospace;
  font-size: 14px;
}
</style>

<template>
  <div>
    <h2>Ruta del Vehículo</h2>
    <LMap
      v-if="routeCoords.length"
      style="height: 500px; width: 100%"
      :zoom="13"
      :center="routeCoords[0]"
    >
      <LTileLayer
        :url="tileUrl"
        :attribution="attribution"
      />
      <LMarker
        v-for="(coord, index) in routeCoords"
        :key="index"
        :lat-lng="coord"
      >
        <LPopup>Punto {{ index + 1 }}</LPopup>
      </LMarker>
      <LPolyline :lat-lngs="routeCoords" :color="'purple'" />
    </LMap>
    <div v-else>
      <p>No hay coordenadas suficientes para mostrar una ruta.</p>
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
    LPopup,
  },
  data() {
    return {
      routeCoords: [],
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors'
    };
  },
  async created() {
    const carId = this.$route.params.carId;
    try {
      const response = await fetch(`http://localhost:3000/api/route/car/${carId}`);
      const data = await response.json();
      this.$router.push('/admin/newRoute');
      const coords = [];

      // 1. Punto inicial desde car.latlong
      if (data.car && data.car.latlong && data.car.latlong.coordinates) {
        const [lng, lat] = data.car.latlong.coordinates;
        coords.push([lat, lng]);
      }

      // 2. Todos los puntos registrados en rutas
      data.routes.forEach(r => {
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

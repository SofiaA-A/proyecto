<template>
  <div>
    <LMap
      style="height: 500px; width: 100%"
      :zoom="zoom"
      :center="center"
    >
      <LTileLayer :url="tileUrl" :attribution="attribution" />

      <!-- Punto de partida del auto -->
      <LMarker :lat-lng="carPosition">
        <LPopup>Inicio del vehículo</LPopup>
      </LMarker>

      <!-- Marcadores de la ruta -->
      <LMarker
        v-for="(point, index) in routePoints"
        :key="index"
        :lat-lng="point"
      >
        <LPopup>Punto {{ index + 1 }}</LPopup>
      </LMarker>

      <!-- Línea de la ruta -->
      <LPolyline :lat-lngs="[carPosition, ...routePoints]" :color="'blue'" />
    </LMap>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LPolyline
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
    LPolyline
  },
  data() {
    return {
      zoom: 13,
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors',
      carPosition: [0, 0],      // punto inicial
      routePoints: [],          // puntos de ruta
      center: [0, 0]            // centro del mapa
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

      // Obtener las rutas asociadas a ese carro
      const routeRes = await axios.get(`http://localhost:3000/api/route/car/${car.id}`)
      this.routePoints = routeRes.data.routes.map(r => {
        const [lng, lat] = r.latlong.coordinates
        return [lat, lng]
      })
    } catch (err) {
      console.error("Error al cargar ruta del carro:", err)
    }
  }
}
</script>

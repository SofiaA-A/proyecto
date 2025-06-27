<template>
  <LMap
    style="height: 500px; width: 100%"
    :zoom="zoom"
    :center="[lat, lng]"
  >
    <LTileLayer
      :url="tileUrl"
      :attribution="attribution"
    />
    <LMarker :lat-lng="[lat, lng]">
      <LPopup>¡Estás aquí!</LPopup>
    </LMarker>
  </LMap>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup
} from "@vue-leaflet/vue-leaflet"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix de los íconos
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  name: "MapView",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data() {
    return {
      lat: 19.4326,
      lng: -99.1332,
      zoom: 13,
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors'
    }
  }
}
</script>

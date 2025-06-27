<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'MapView',
  props: {
    lat: Number,
    lng: Number,
    destinationLat: Number,
    destinationLng: Number,
  },
  mounted() {
    if (this.lat == null || this.lng == null) {
      console.error('Latitud o longitud inicial no definida');
      return;
    }

    const map = L.map('map').setView([this.lat, this.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([this.lat, this.lng]).addTo(map).bindPopup('Ubicación del auto');

    if (this.destinationLat != null && this.destinationLng != null) {
      L.marker([this.destinationLat, this.destinationLng]).addTo(map).bindPopup('Destino');

      const route = L.polyline(
        [[this.lat, this.lng], [this.destinationLat, this.destinationLng]],
        { color: 'blue' }
      ).addTo(map);

      map.fitBounds(route.getBounds());
    }
  }
}
</script>

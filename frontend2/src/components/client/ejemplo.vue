<template>

  <div style="height: 500px; width: 100%;">
    <GMapMap
      :center="origin"
      :zoom="10"
      style="width: 100%; height: 100%"
    >
      <GMapMarker :position="car.latitude" label="Inicio" />
      <GMapMarker :position="car.logitude" label="Destino" />

      <!-- Dibuja la ruta -->
      <GMapDirections
        :origin="origin"
        :destination="destination"
        :travelMode="'DRIVING'"
      />
    </GMapMap>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { ref } from 'vue'

const origin = ref({ log: car.logitude })
const destination = ref({ lat: car.latitude})
</script>

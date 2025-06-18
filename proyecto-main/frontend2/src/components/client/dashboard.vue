<template>
  <div>
    <center><h2> Bienvenido al Panel del Cliente </h2></center>
    <center><p>Desde este panel puedes consultar la información de tu vehículo y su ruta asignada.</p></center>

    <div class="carousel">
      <div
        class="carousel-inner"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div class="carousel-item" v-for="(img, index) in images" :key="index">
          <img :src="img.src" :alt="img.alt" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Importar imágenes desde assets
import carro1 from '@/assets/carro1.jpg'
import carro2 from '@/assets/carro2.jpg'
import carro3 from '@/assets/carro3.jpg'

const currentIndex = ref(0)

const images = [
  { src: carro1, alt: 'carro1' },
  { src: carro2, alt: 'carro2' },
  { src: carro3, alt: 'carro3' }
]

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prev = () => {
  currentIndex.value =
    currentIndex.value === 0 ? images.length - 1 : currentIndex.value - 1
}

// Autoplay con setInterval
let interval = null

onMounted(() => {
  interval = setInterval(next, 3000) // cambia cada 3 segundos
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.carousel {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  overflow: hidden;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
}

.carousel-item img {
  width: 100%;
  height: 450px; /* Más alto */
  object-fit: cover;
  border-radius: 12px;
}

.carousel-buttons {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 0 20px;
  transform: translateY(-50%);
}

.carousel-buttons button {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 28px;
  padding: 10px 16px;
  border-radius: 50%;
  cursor: pointer;
}
</style>

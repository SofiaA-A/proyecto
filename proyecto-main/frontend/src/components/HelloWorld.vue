<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup>
defineProps({
  msg: String
})
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>

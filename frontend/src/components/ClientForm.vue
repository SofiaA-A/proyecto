<template>
  <form class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center">Formulario de Cliente</h2>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Nombre</label>
      <input v-model="cliente.nombre" type="text" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Correo</label>
      <input v-model="cliente.correo" type="email" class="w-full p-2 border rounded" />
    </div>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Teléfono</label>
      <input v-model="cliente.telefono" type="text" class="w-full p-2 border rounded" />
    </div>

    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Registrar Cliente
    </button>
  </form>
</template>

<script>
export default {
  name: "ClienteForm",
  data() {
    return {
      cliente: {
        nombre: "",
        correo: "",
        telefono: ""
      }
    };
  }
};
</script>

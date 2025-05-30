<template>
  <div class="p-6">
    <ClienteForm />
  </div>
</template>

<script>
import ClienteForm from "@/components/ClienteForm.vue";

export default {
  name: "ClientesView",
  components: {
    ClienteForm
  }
};
</script>

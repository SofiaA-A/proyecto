<template>
  <div class="user-form">
    <h2>Registrar Nuevo Usuario</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="user.name" required />
      </div>

      <div class="form-group">
        <label>Correo electrónico:</label>
        <input type="email" v-model="user.email" required />
      </div>

      <div class="form-group">
        <label>Contraseña:</label>
        <input type="password" v-model="user.password" required />
      </div>

      <div class="form-group">
        <label>Rol:</label>
        <select v-model="user.role" required>
          <option disabled value="">Seleccione un rol</option>
          <option value="admin">Administrador</option>
          <option value="client">Cliente</option>
        </select>
      </div>

      <button type="submit">Registrar</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserForm',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        role: ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://localhost:3000/api/users/register', this.user);
        alert('Usuario creado exitosamente');
        this.$router.push('/admin/users'); // Redirige a la lista si lo deseas
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        alert('Hubo un error al registrar el usuario');
      }
    }
  }
};
</script>

<style scoped>
.user-form {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.user-form h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

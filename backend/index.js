// 1️ Carga variables de entorno
require('dotenv').config();

// 2️ Importaciones principales
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

// 3️ Instancia de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 4️ Middleware global
app.use(cors());
app.use(express.json());

// 5️ Conexión a la base de datos usando .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  }
);

// 6️ Verifica la conexión y sincroniza modelos
sequelize.authenticate()
  .then(() => {
    console.log(' Conectado a la base de datos');

    // 7️ Sincroniza modelos
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log(' Modelos sincronizados');

    // 8️ Inicia el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// 9️ Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recorridos', require('./routes/recorridos'));

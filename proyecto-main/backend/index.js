// 1 Carga variables de entorno
require('dotenv').config();

// 2 Importaciones principales
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const multer = require('multer');

// 3 Instancia de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 4 Middleware global
app.use(cors());
app.use(express.json());

// 5 Conexión a la base de datos usando .env
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

// 6 Verifica la conexión y sincroniza modelos
sequelize.authenticate()
  .then(() => {
    console.log(' Conectado a la base de datos');

    // 7 Sincroniza modelos
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log(' Modelos sincronizados');

    // 8 Inicia el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
    console.log('Usuario de la base de datos:', process.env.DB_USER);

  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// 9 Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/route', require('./routes/route'));
app.use('/api/car', require('./routes/car'));
app.use('/api/users', require('./routes/user'));

  
 
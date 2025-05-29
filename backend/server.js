// 1️ Importaciones principales
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

// 2️ Carga la configuración de Sequelize
const dbConfig = require('./config/config.json').development;

// 3️ Crea instancia de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 4️ Middleware global
app.use(cors());
app.use(express.json());

// 5️ Conecta a la base de datos
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

// 6️ Verifica la conexión
sequelize.authenticate()
  .then(() => console.log(' Conectado a la base de datos'))
  .catch(err => console.error(' Error al conectar:', err));

// 7️ Importa tus modelos aquí
// Ejemplo:
// const User = require('./models/User');
// const Car = require('./models/Car');
// const Recorrido = require('./models/Recorrido');

// 8️ Sincroniza modelos con la base de datos
sequelize.sync({ force: false })
  .then(() => console.log(' Modelos sincronizados'));

// 9️ Rutas
const recorridosRoutes = require('./routes/recorridos'); // asegúrate de tener este archivo
app.use('/recorridos', recorridosRoutes);

//  Inicia el servidor
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});

// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USE,
  process.env.DB_PASSWORD, 
  {
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
  dialect: 'postgres',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Aquí importa tu modelo
db.User = require('./user')(sequelize, DataTypes);

// Si tienes más modelos, agrégalos aquí igual
db.Car = require('./car')(sequelize, DataTypes);
//db.Route = require ('/route')(sequelize, DataTypes)

// Asociaciones
if (db.User.associate) db.User.associate(db);
if (db.Car.associate) db.Car.associate(db);
//if(db.Route.associate) db.Route,associate(db);

module.exports = db;

// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('agencia', 'postgres', 'tres2442', {
  host: 'localhost',
  dialect: 'postgres' // o 'mysql', 'sqlite', etc.
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

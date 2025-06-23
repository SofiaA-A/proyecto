const { Sequelize, DataTypes } = require('sequelize');
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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//modelos
db.User = require('./user')(sequelize, DataTypes);
db.Car = require('./car')(sequelize, DataTypes);
db.Route = require('./route')(sequelize, DataTypes);

//asiciaciones
if (db.User.associate) db.User.associate(db);
if (db.Car.associate) db.Car.associate(db);
if (db.Route.associate) db.Route.associate(db);

module.exports = db;

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Asociaciones entre modelos
     */
    static associate(models) {
      Route.belongsTo(models.Car, { foreignKey: 'car_id' });
    }
  }

  Route.init({
    description: DataTypes.STRING,
    distance: DataTypes.FLOAT,
    date: DataTypes.DATE,
    car_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Route',
  });

  return Route;
};

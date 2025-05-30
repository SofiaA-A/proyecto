'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Definir asociaciones entre modelos
     */
    static associate(models) {
      Car.belongsTo(models.Users, { foreignKey: 'user_id' });
      Car.hasMany(models.Route, { foreignKey: 'car_id' });
    }
  }

  Car.init({
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    plate: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car',
  });

  return Car;
};

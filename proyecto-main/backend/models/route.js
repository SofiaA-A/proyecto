'use strict';
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    length: DataTypes.DOUBLE,
    latitude: DataTypes.DOUBLE,
    car_id: DataTypes.INTEGER,  
    user_id: DataTypes.INTEGER,
  }, {
    paranoid: true,
    tableName: 'Routes',
  });

  Route.associate = function(models) {
    Route.belongsTo(models.Car, { foreignKey: 'car_id', as: 'car' });  // <- MAYÚSCULA
    Route.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Route;
};

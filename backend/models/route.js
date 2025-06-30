'use strict';
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    latlong: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Routes',
    timestamps: true,
    paranoid: true
  });

  Route.associate = function(models) {
    Route.belongsTo(models.Car, { foreignKey: 'car_id', as: 'car' });
    Route.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Route;
};

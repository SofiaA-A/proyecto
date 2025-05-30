'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Asociaciones
     */
    static associate(models) {
      // Un usuario tiene un auto
      //User.hasOne(models.Car, { foreignKey: 'user_id' });
    }
  }

  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });

  return Users;
};

// models/car.js
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    image: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Cars',
    timestamps: true,
    paranoid: true,  // activa soft delete con deletedAt
  });

  // Asociaciones si tienes modelo User
  Car.associate = function(models) {
    Car.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Car;
};

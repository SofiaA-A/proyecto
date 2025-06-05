module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    modelo: DataTypes.STRING,
    marca: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  });

  Car.associate = (models) => {
    Car.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'usuario'
    });
  };

  return Car;
};

module.exports = (sequelize, DataTypes) => {
  const Geocerca = sequelize.define('Geocerca', {
    center: {
      type: DataTypes.GEOGRAPHY('POINT', 4326), // Punto (lat, lng)
      allowNull: false
    },
    radius: {
      type: DataTypes.INTEGER, // En metros
      allowNull: false
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    } },
    {
    tableName: 'Geocercas', 
    freezeTableName: true , 
    paranoid: true
    });

  Geocerca.associate = (models) => {
    Geocerca.belongsTo(models.Car, { foreignKey: 'car_id', as: 'car' });
    Geocerca.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Geocerca;
};

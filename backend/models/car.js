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
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latlong: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, 
  {
    tableName: 'Cars',
    timestamps: true,
    paranoid: true
  });

  Car.associate = function(models) {
    Car.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Car;
};

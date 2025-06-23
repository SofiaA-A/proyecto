module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, 
  {
  paranoid: true,       
    timestamps: true,
    deletedAt: 'deletedAt'
   });

   User.associate = function(models) {
    User.hasMany(models.Car, { foreignKey: 'user_id', as: 'cars' });
  };
  
  return User;
};

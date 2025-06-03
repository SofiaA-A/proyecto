module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.STRING
  })

  User.associate = (models) => {
    User.hasMany(models.Car, {
      foreignKey: 'user_id',
      as: 'autos'
    })
  }

  return User
}

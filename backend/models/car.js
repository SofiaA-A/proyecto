Car.associate = (models) => {
  Car.belongsTo(models.User, {
    foreignKey: 'user_id',  // o clienteId si así lo nombraste
    as: 'usuario'
  })
}

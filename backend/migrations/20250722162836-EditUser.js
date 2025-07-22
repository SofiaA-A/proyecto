'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columna lastname
    await queryInterface.addColumn('Users', 'lastname', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Agregar columna Image
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Quitar columna lastname
    await queryInterface.removeColumn('Users', 'lastname');

    // Quitar columna Image
    await queryInterface.removeColumn('Users', 'image');
  }
};

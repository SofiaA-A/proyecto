'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Sofia',
        email: 'sofia@gmail.com',
        password: bcrypt('tres2442'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Puedes agregar más usuarios aquí
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

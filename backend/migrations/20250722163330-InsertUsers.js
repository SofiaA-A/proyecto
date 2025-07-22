'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Sofia',
        lastname: 'Aguilera',
        email: 'sofia@gmail.com',
        image: '/images/User.png',
        password: bcrypt.hashSync('tres2442', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Carlos', 
        lastname: 'Torres',
        email: 'carlos@gmail.com',
        image: '/images/User.png',
        password: bcrypt.hashSync('tres2442', 10),
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

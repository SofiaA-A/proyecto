'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cars', [
      {
    brand: 'Chevrolet',
    model: 'S10 MAX',
    plate: 'DJSEJA',
    image: '/images/S10 MAX.jpg',
    year: 2023,
    latlong: Sequelize.fn('ST_GeomFromText', 'POINT(-103.45288 20.69882)', 4326),
    user_id: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    brand: 'BMW',
    model: 'Cabrio',
    plate: 'AASG321',
    image: '/images/Cabrio.jpg',
    year: 2023,
    latlong: Sequelize.fn('ST_GeomFromText', 'POINT(-103.45288 20.69882)', 4326),
    user_id: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cars', null, {});
  }
};

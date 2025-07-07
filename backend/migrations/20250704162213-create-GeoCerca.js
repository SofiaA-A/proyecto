'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('geocercas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      center: {
        type: Sequelize.GEOGRAPHY('POINT', 4326),
        allowNull: false
      },
      radius: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Radio en metros'
      },
      status: {
        type: Sequelize.STRING(10),
        defaultValue: 'outside',
        allowNull: false,
        comment: "Estado: 'inside' o 'outside'"
      },
      car_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cars',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // Índice espacial en center
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_geocercas_center ON geocercas USING GIST(center);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('geocercas');
  }
};

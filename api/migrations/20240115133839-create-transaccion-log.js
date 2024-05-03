'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaccion_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaccion_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'transacciones',
              key: 'id'
          },
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
      },
      evento: {
          type: Sequelize.STRING,
          allowNull: false
      },
      request: {
          type: Sequelize.TEXT,
          allowNull: true
      },
      http_code_response: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      response: {
          type: Sequelize.TEXT,
          allowNull: true
      },
      fecha_alta: {
          type: Sequelize.DATE,
          allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaccion_logs');
  }
};
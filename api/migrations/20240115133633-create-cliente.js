'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipo_documento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numero_documento:{
        type: Sequelize.BIGINT,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prefijo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      telefono: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      fecha_nacimiento: {
          type: Sequelize.DATE,
          allowNull: true
      },
      pais: {
          type: Sequelize.STRING,
          allowNull: true
      },
      departamento: {
          type: Sequelize.STRING,
          allowNull: true
      },
      ciudad: {
          type: Sequelize.STRING,
          allowNull: true
      },
      direccion: {
          type: Sequelize.STRING,
          allowNull: true
      },
      numero: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      estado: {
          type: Sequelize.STRING,
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
    await queryInterface.dropTable('clientes');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transacciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cliente_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'clientes',
              key: 'id'
          },
          onUpdate: 'NO ACTION',
          onDelete: 'NO ACTION',
      },
      tipo_transaccion: {
          type: Sequelize.ENUM('INSCRIPCION', 'PAGO'),
          allowNull: false
      },
      tipo_donacion: {
          type: Sequelize.ENUM('regular', 'oneoff'),
          allowNull: false
      },
      response_url: {
          type: Sequelize.STRING,
          allowNull: false
      },
      utm_source: {
          type: Sequelize.STRING,
          allowNull: true
      },
      utm_medium: {
          type: Sequelize.STRING,
          allowNull: true
      },
      utm_campaign: {
          type: Sequelize.STRING,
          allowNull: true
      },
      utm_term: {
          type: Sequelize.STRING,
          allowNull: true
      },
      utm_content: {
          type: Sequelize.STRING,
          allowNull: true
      },
      monto: {
          type: Sequelize.DECIMAL(15,2),
          allowNull: false
      },
      estado: {
          type: Sequelize.STRING(35),
          allowNull: false
      },
      metodo_pago: {
          type: Sequelize.STRING,
          allowNull: true
      },
      nombre_apellido_tarjetahabiente: {
          type: Sequelize.STRING(200),
          allowNull: true
      },
      tipo_documento_tarjetahabiente: {
          type: Sequelize.STRING(50),
          allowNull: true
      },
      numero_documento_tarjetahabiente: {
          type: Sequelize.BIGINT,
          allowNull: true
      },
      token_tarjeta: {
          type: Sequelize.STRING(40),
          allowNull: true
      },
      numero_enmascarado_tarjeta: {
          type: Sequelize.STRING(20),
          allowNull: true
      },
      banco: {
          type: Sequelize.STRING,
          allowNull: true
      },
      tipo_cuenta: {
          type: Sequelize.ENUM('CAJA_DE_AHORROS', 'CUENTA_CORRIENTE'),
          allowNull: true
      },
      numero_cuenta: {
          type: Sequelize.INTEGER,
          allowNull: true
      },
      order_signature: {
          type: Sequelize.STRING,
          allowNull: true
      },
      request_session_id: {
          type: Sequelize.STRING,
          allowNull: true
      },
      request_direccion_ip: {	
          type: Sequelize.STRING,
          allowNull: true
      },
      request_cookie: {
          type: Sequelize.STRING,
          allowNull: true
      },
      request_user_agent: {
          type: Sequelize.STRING,
          allowNull: true
      },
      payu_order_id: {
          type: Sequelize.BIGINT,
          allowNull: true
      },
      payu_transaction_id: {
          type: Sequelize.STRING,
          allowNull: true
      },
      payu_transaction_status: {
          type: Sequelize.STRING,
          allowNull: true
      },
      payu_response_code: {
          type: Sequelize.STRING,
          allowNull: true
      },
      payu_bank_response_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payu_bank_response_message: {
          type: Sequelize.STRING,
          allowNull: true
      },
      payu_fecha_transaccion: {
          type: Sequelize.DATE,
          allowNull: true
      },
      salesforce_staging_id: {
          type: Sequelize.STRING,
          allowNull: true
      },
      salesforce_regular_givin_id: {
          type: Sequelize.STRING,
          allowNull: true
      },
      salesforce_regular_givin_numero: {
          type: Sequelize.STRING,
          allowNull: true
      },
      salesforce_opportunity_id: {
          type: Sequelize.STRING,
          allowNull: true
      },
      salesforce_transaction_id: {
          type: Sequelize.STRING,
          allowNull: true
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
    await queryInterface.dropTable('transacciones');
  }
};
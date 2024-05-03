import { DataTypes } from "sequelize";
import sequelize from "@/config/db-config";

const Transaction = sequelize.define(
  "Transaccion",
  { 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'clientes',
          key: 'id'
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
  },
  tipo_transaccion: {
      type: DataTypes.ENUM('INSCRIPCION', 'PAGO'),
      allowNull: false
  },
  tipo_donacion: {
      type: DataTypes.ENUM('regular', 'oneoff'),
      allowNull: false
  },
  response_url: {
      type: DataTypes.STRING,
      allowNull: false
  },
  utm_source: {
      type: DataTypes.STRING,
      allowNull: true
  },
  utm_medium: {
      type: DataTypes.STRING,
      allowNull: true
  },
  utm_campaign: {
      type: DataTypes.STRING,
      allowNull: true
  },
  utm_term: {
      type: DataTypes.STRING,
      allowNull: true
  },
  utm_content: {
      type: DataTypes.STRING,
      allowNull: true
  },
  monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
  },
  estado: {
      type: DataTypes.STRING,
      allowNull: false
  },
  metodo_pago: {
      type: DataTypes.STRING,
      allowNull: true
  },
  nombre_apellido_tarjetahabiente: {
      type: DataTypes.STRING,
      allowNull: true
  },
  tipo_documento_tarjetahabiente: {
      type: DataTypes.STRING,
      allowNull: true
  },
  numero_documento_tarjetahabiente: {
      type: DataTypes.BIGINT,
      allowNull: true
  },
  token_tarjeta: {
      type: DataTypes.STRING,
      allowNull: true
  },
  numero_enmascarado_tarjeta: {
      type: DataTypes.STRING,
      allowNull: true
  },
  banco: {
      type: DataTypes.STRING,
      allowNull: true
  },
  tipo_cuenta: {
      type: DataTypes.ENUM('CAJA_DE_AHORROS', 'CUENTA_CORRIENTE'),
      allowNull: true
  },
  numero_cuenta: {
      type: DataTypes.INTEGER,
      allowNull: true
  },
  order_signature: {
      type: DataTypes.STRING,
      allowNull: true
  },
  request_session_id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  request_direccion_ip: {	
      type: DataTypes.STRING,
      allowNull: true
  },
  request_cookie: {
      type: DataTypes.STRING,
      allowNull: true
  },
  request_user_agent: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payu_order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
  },
  payu_transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payu_transaction_status: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payu_response_code: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payu_bank_response_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payu_bank_response_message: {
      type: DataTypes.STRING,
      allowNull: true
  },
  payu_fecha_transaccion: {
      type: DataTypes.DATE,
      allowNull: true
  },
  salesforce_staging_id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  salesforce_regular_givin_id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  salesforce_regular_givin_numero: {
      type: DataTypes.STRING,
      allowNull: true
  },
  salesforce_opportunity_id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  salesforce_transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
  },
  {
    // Additional options for the model go here
    tableName: "transacciones", // Explicitly set the table name
  }
);

export default Transaction;

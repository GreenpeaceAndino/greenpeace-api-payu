import sequelize from "@/config/db-config";
import { DataTypes } from "sequelize";
import Transaccion from "@/modules/transaccion/transaccion.model";

const Logs = sequelize.define(
  "Logs",
  {
    transaccion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Transacciones',
          key: 'id'
      }
    },
    evento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    request: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    http_code_response: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_alta: {
        type: DataTypes.DATE,
        allowNull: false
    },
  },
  {
    // Additional options for the model go here
    tableName: "transaccion_logs", // Explicitly set the table name
  }
);

export default Logs;

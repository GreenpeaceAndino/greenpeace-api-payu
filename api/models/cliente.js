'use strict';
import { DataTypes } from "sequelize";
import sequelize from "@/config/db-config";
const Cliente = sequelize.define(
  "Cliente",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo_documento: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero_documento:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prefijo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true
    },
  },
  {
    // Additional options for the model go here
    // For example, you can set the table name explicitly:
    tableName: "clientes",
  }
);

export default Cliente;
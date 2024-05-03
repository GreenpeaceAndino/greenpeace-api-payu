import { DataTypes, Model } from "sequelize";
import sequelize from "@/config/db-config";

export interface ClienteI {
  id?: number;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: number;
  email: string;
  prefijo: number;
  telefono: number;
  fecha_nacimiento: Date;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  numero: number;
  estado: string;
};

export interface ClienteInstance extends Model<ClienteI> {}

export const ClienteModel = sequelize.define<ClienteInstance>(
  "Cliente",
  { 
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
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
      type: DataTypes.BIGINT,
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
      type: DataTypes.BIGINT,
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

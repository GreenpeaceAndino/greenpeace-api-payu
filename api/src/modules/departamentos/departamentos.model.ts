import { DataTypes, Model } from "sequelize";
import sequelize from "@/config/db-config";

interface DepartamentoI {
  id: number;
  codigo: string;
  descripcion: string;
}

interface DepartamentoInstance extends Model<DepartamentoI>, DepartamentoI {}

const Departamento = sequelize.define<DepartamentoInstance>(
  "Departamento",
  { 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    // Additional options for the model go here
    tableName: "departamentos", // Explicitly set the table name
    timestamps: false
  }
);

export default Departamento;
import { DataTypes, Model } from "sequelize";
import sequelize from "@/config/db-config";

interface TipoDocumentoI {
  id: number;
  codigo: string;
  descripcion: string;
}

interface TipoDocumentoInstance extends Model<TipoDocumentoI>, TipoDocumentoI {}

const TipoDocumento = sequelize.define<TipoDocumentoInstance>(
  "TipoDocumento",
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
    tableName: "tipos_documento", // Explicitly set the table name
    timestamps: false
  }
);

export default TipoDocumento;
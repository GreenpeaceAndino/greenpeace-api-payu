import InscripcionDTO from "@/modules/inscripcion/dtos/inscripcionRequestDTO";
import {ClienteModel, ClienteInstance} from "@/modules/cliente/cliente.model";
import sequelize from "@/config/db-config";
import { parse } from "path";

class InscripcionService {

    async create(data: InscripcionDTO): Promise<void | null> {
        // Chequear si el rut existe en la tabla "Cliente"
        const cliente = await ClienteModel.findOne({
            where: { numero_documento: data.numero_documento_cliente },
            attributes: ["id"],
        });
        if (cliente !== null) {
            console.log("Existe el nuip.");
        } else {
            //create cliente
            const result = await sequelize.transaction(async (t) => {
                const cliente = await ClienteModel.create(
                  {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    tipo_documento: data.tipo_documento_cliente,
                    numero_documento: parseInt(data.numero_documento_cliente),
                    email: data.email,
                    prefijo: parseInt(data.prefijo),
                    telefono: parseInt(data.telefono),
                    fecha_nacimiento: data.fecha_nacimiento,
                    pais: data.pais,
                    departamento: data.departamento,
                    ciudad: data.ciudad,
                    direccion: data.direccion,
                    numero: data.numero,
                    estado: "CREADO",
                  },
                  { transaction: t }
                );
                return cliente;
            });
            console.log("RESULTATO CREAR CLIENTE: " + result);
        }
    }
}

export default InscripcionService;

import InscripcionDTO from "@/modules/inscripcion/dtos/inscripcionRequestDTO";
import express, { NextFunction } from "express";
import {ClienteModel, ClienteInstance}  from "@/modules/cliente/cliente.model";
import TransaccionModel from "@/modules/transaccion/transaccion.model";
import LogsEvents from "../logs/enums/logsEvents";
import createLog from "../logs/createLog";
import sequelize from "@/config/db-config";

class ClienteService {
    async findOrCreate(data: InscripcionDTO): Promise<ClienteInstance | null> {
        // Chequear si el rut existe en la tabla "Cliente"
        const cliente = await ClienteModel.findOne({
            where: { numero_documento: data.numero_documento_cliente, tipo_documento: data.tipo_documento_cliente}
        });
        if (cliente !== null) {
            console.log("Existe el nuip.");
            return cliente;
        } else {
            console.log("No existe el nuip.")
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
            console.log("RESULTADO CREAR CLIENTE: " + JSON.stringify(result));
            return result;
        }
    }
}

export default ClienteService;

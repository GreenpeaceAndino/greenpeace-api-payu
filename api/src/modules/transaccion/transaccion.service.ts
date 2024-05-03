import InscripcionDTO from "@/modules/inscripcion/dtos/inscripcionRequestDTO";
import express, { NextFunction } from "express";
import TransaccionModel from "@/modules/transaccion/transaccion.model";
import LogsEvents from "../logs/enums/logsEvents";
import createLog from "../logs/createLog";
import sequelize from "@/config/db-config";
import {ClienteModel, ClienteInstance} from "../cliente/cliente.model";
import { container } from "tsyringe";
import DonationTypes from "../inscripcion/enums/donationType.enum";
import TipoDocumento from "../tipos_documento/tipos_documento.model";
import { estadosTransaccion } from "./enums/transaccion.estados.enum";

class TransaccionService {
    async create_from_inscripcion(data: InscripcionDTO, cliente_id: string): Promise<any | null> {
        console.log("DATA:+-+ " + JSON.stringify(data.tipo_donacion));
        const tipo_documento = await TipoDocumento.findOne({where: {codigo: data.tipo_documento_tarjetahabiente}});
        const transaccion = await TransaccionModel.create({
            cliente_id: cliente_id,
            response_url: "https://[dominio]/[aplicacion]/[UTM]/finalizarInscripcion/[IdTransaccion]",
            tipo_transaccion: "INSCRIPCION",
            tipo_donacion: data.tipo_donacion,
            monto: data.monto,
            estado: estadosTransaccion.CREADA,
            utm_campaign: data.utm_campaign,
            utm_content: data.utm_content,  
            utm_medium: data.utm_medium,
            utm_source: data.utm_source,
            utm_term: data.utm_term,
            nombre_apellido_tarjetahabiente: data.nombre_apellido_tarjetahabiente,
            tipo_documento_tarjetahabiente: tipo_documento?.descripcion,
            numero_documento_tarjetahabiente: data.numero_documento_tarjetahabiente, 
            metodo_pago: data.metodo_pago, 
        });
        
        console.log("RESULTADO CREAR TRANSACCION: " + JSON.stringify(transaccion));

        createLog(transaccion.get("id"), LogsEvents.TRANSACCION_CREADA_CORRECTAMENTE);

        const dataLog = {...data};
        dataLog.cvv = 0;
        dataLog.numero_tarjeta = 0;
        createLog(transaccion.get("id"), LogsEvents.LOG_INPUT, JSON.stringify(dataLog));
        return transaccion;
    }

    async create_from_salesforce(data: any, cliente_id: number = 0): Promise<any | null> {
        if(cliente_id === 0){
            console.log("Error al crear la transaccion, no se encontro el cliente.");
            return null;
        }
        
        const transaccion = await TransaccionModel.create({
            cliente_id: cliente_id,
            tipo_transaccion: "PAGO",
            tipo_donacion: DonationTypes.MENSUAL,
            monto: data.Amount,
            estado: estadosTransaccion.CREADA,
            response_url:"",
            salesforce_regular_givin_id: data.s360a__RegularGiving__c,
            salesforce_regular_givin_numero: data.s360a__RegularGiving__r.Name,
            token_tarjeta: data.s360a__RegularGiving__r.Credit_Card_Token_RG__c,
            utm_campaign: data.s360a__RegularGiving__r.UTM_Campaign__c,
            salesforce_opportunity_id: data.attributes.url.split("/").reverse()[0],
            metodo_pago: data.s360a__RegularGiving__r.PayU_Card_RG__c,
            nombre_apellido_tarjetahabiente: data.s360a__RegularGiving__r.Account_Name__c,
            tipo_documento_tarjetahabiente: data.s360a__RegularGiving__r.Account_Holder_Tipo_de_Documento_Col__c,
            numero_documento_tarjetahabiente: data.s360a__RegularGiving__r.Account_Holder_CC__c,
        });
        console.log("RESULTADO CREAR TRANSACCION: " + JSON.stringify(transaccion));

        createLog(transaccion.get("id"), LogsEvents.TRANSACCION_PAGO_CREADA_CORRECTAMENTE, JSON.stringify(transaccion));

        return transaccion;
    }
}

export default TransaccionService;

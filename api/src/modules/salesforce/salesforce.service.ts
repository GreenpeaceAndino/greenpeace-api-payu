import axios from "axios";
import StagingDTO from "./dtos/stagingDTO";
import LogsEvents from "../logs/enums/logsEvents";
import createLog from "../logs/createLog";
import { cli } from "winston/lib/winston/config";
import {ClienteModel, ClienteInstance}  from "@/modules/cliente/cliente.model";import InscripcionRequestDTO from "../inscripcion/dtos/inscripcionRequestDTO";
import { deprecate } from "util";
import valuesAuthSF from "./enums/valuesAuthSF.enum";
import staticParameters from "./staticParameters";
import ResponseStagingSuceess from "./dtos/responseStagingSuccess";
import Departamento from "../departamentos/departamentos.model";
import TipoDocumento from "../tipos_documento/tipos_documento.model";
import DonationTypes from "../inscripcion/enums/donationType.enum";
import sendEmail from "../inscripcion/email/sendEmail";
import { createEmailBodyInscripcion, emailSubjectInscripcion } from "../inscripcion/email/templateHtml";
import { createEmailSuccessBody, successEmailSubject } from "../scheduled_app/email/successEmailTemplate";
import { estadosTransaccion } from "../transaccion/enums/transaccion.estados.enum";

class SalesforceService {
    async auth(): Promise<string | null> {
        console.log("INICIANDO AUTENTICACION SALESFORCE")
        const requestBody = new URLSearchParams({
          grant_type: valuesAuthSF.GRANT_TYPE,
          client_id: valuesAuthSF.CLIENT_ID,
          client_secret: valuesAuthSF.CLIENT_SECRET,
          username: valuesAuthSF.USERNAME,
          password: valuesAuthSF.PASSWORD,
        });

        console.log("REQUEST BODY: " + requestBody);
      
        const token = await axios
          .post(valuesAuthSF.ENDPOINT, requestBody)
          .then(function (response) {
            console.log(response.data);
            console.log(response.data.access_token);
            // Handle the response here
            console.log("SUCCESS");
            return response.data.access_token;
          })
          .catch(function (error) {
            console.error(error);
            // Handle errors here
            return null;
          });
        console.log("FINALIZANDO AUTENTICACION SALESFORCE")
        return token;
    }

    async create_staging(data: InscripcionRequestDTO, transaccion: any, cliente: ClienteInstance, transaccion_payu: any): Promise<any | null> {
        console.log("INICIANDO CREACION STAGING")
        const stagingDTO = await this.populate_staging_dto(data, cliente, transaccion, transaccion_payu);
        console.log("STAGING DTO: " + JSON.stringify(stagingDTO));
        const token = await this.auth();

        const staging_response = await axios.post(String(process.env.API_URL_CREATE_STAGING),
                                                    stagingDTO, 
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        },
                                                    }).catch((error) => {
                                                        console.log("ERROR EN LA CREACION DE STAGING " + this.stringify(error.response));
                                                    }).then((response) => {
                                                        console.log("RESPUESTA CREACION STAGING " + this.stringify(response?.data));
                                                        return response?.data;
                                                    });
        await this.handle_creacion_staging_response(staging_response, transaccion, stagingDTO, cliente);
        
        console.log("FINALIZANDO CREACION STAGING")
        return staging_response;
    }

    async create_transaccion(record: any, transaccion_payu: any, cliente: ClienteInstance, transaccion: any): Promise<any | null> {
        console.log("INICIANDO CREACION TRANSACCION EN SALESFORCE")
        const token = await this.auth();
        var today = new Date();

        // Obtener el año, mes y día de la fecha actual
        var year = today.getFullYear();
        var month = (today.getMonth() + 1).toString().padStart(2, '0'); // Añade un 0 delante si el mes es menor que 10
        var day = today.getDate().toString().padStart(2, '0'); // Añade un 0 delante si el día es menor que 10

        // Formatear la fecha en el formato deseado
        var formattedDate = year + '-' + month + '-' + day;
        const opportunity_id = record.attributes?.url.split("/").reverse()[0];
        const transaccion_sf = {
            s360a__TransactionType__c: staticParameters.transactionType,
            s360a__PaymentMethod__c: staticParameters.paymentMethod,
            s360a__Amount__c: record.Amount,
            CurrencyIsoCode: staticParameters.currency,
            s360a__Opportunity__c: opportunity_id,
            s360a__Status2__c: transaccion_payu.transactionResponse.state === "APPROVED" ? staticParameters.transaccionStatusSuccess : staticParameters.transaccionStatusFailed,
            s360a__PaidDate__c: formattedDate,
            s360a__Processed__c: transaccion_payu.transactionResponse.operationDate,
            s360a__FailureReason__c: transaccion_payu.transactionResponse.state === "APPROVED" ? null : transaccion_payu.transactionResponse.paymentNetworkResponseErrorMessage,
        }   

        console.log("TRANSACCION SF REQUEST: " + JSON.stringify(transaccion_sf));
        
        const transaccion_response = await axios.post(String(process.env.API_URL_NEW_TRANSACTION_ENDPOINT), transaccion_sf,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then((response) => {
                        console.log("RESPUESTA CREACION TRANSACCION " + this.stringify(response?.data));
                        return response;
                    }).catch((error) => {
                        console.log("ERROR EN EL SERVICIO" + error);
                    });

        await this.handle_creacion_transaccion_response(transaccion_response, transaccion, record, transaccion_sf, cliente);

        console.log("FINALIZANDO CREACION TRANSACCION EN SALESFORCE")
        return transaccion_response;
    }

    async handle_creacion_staging_response(response: any, transaccion: any, data: StagingDTO, cliente: ClienteInstance): Promise<any | null>{
        
        if (response.id) {
            const updated_transaccion = await transaccion.update({
                    estado: estadosTransaccion.CONFIRMADA_SF,
                    salesforce_staging_id: response.id
                },
                {where: { id: transaccion.id }}
            );
            ClienteModel.update({
                    estado: "ACTIVO_SF", 
                },
                {where: { id: transaccion.cliente_id }}
            );  

            const bodyInscripcion = createEmailBodyInscripcion(
                cliente.dataValues, 
                response, 
                new Date().toISOString().split("T")[0],
                transaccion); 
            
            sendEmail(
              cliente.dataValues.email,
              bodyInscripcion,
              emailSubjectInscripcion
            );
            createLog(updated_transaccion.id, LogsEvents.CLIENTE_CREADO_EN_SALESFORCE, data, response);
        } else {
            const updated_transaccion = await transaccion.update({estado: estadosTransaccion.ERROR_SF}, {where: { id: transaccion.id }});

                //VER HTTPCODE
            createLog(updated_transaccion.id, LogsEvents.ERROR_EN_LA_RESPUESTA_DEL_SERVICIO, data, response);
        }
    }

    async populate_staging_dto(requestData: InscripcionRequestDTO, cliente: ClienteInstance, transaccion: any, transaccion_payu: any): Promise<StagingDTO>{
        const today = new Date();
        const departamento = await Departamento.findOne({where: {codigo: cliente.dataValues.departamento}});
        const tipo_documento = await TipoDocumento.findOne({where: {codigo: requestData.tipo_documento_tarjetahabiente}});
        const tipo_documento_cliente = await TipoDocumento.findOne({where: {codigo: cliente.dataValues.tipo_documento}});

        const stagingDTO = new StagingDTO(); 
            stagingDTO.s360aie__CampaignID__c = staticParameters.campaign_id;
            stagingDTO.s360aie__Country_of_Ownership__c = staticParameters.country;
            stagingDTO.s360aie__ActionType__c = transaccion.tipo_donacion === DonationTypes.MENSUAL ? staticParameters.actionTypeMensual : staticParameters.actionTypeUnica;
            
            stagingDTO.s360aie__ActionTypeSuccess__c = staticParameters.actionTypeSuccess
            stagingDTO.s360aie__Contact_Source_Picklist__c = "Web";
            
            stagingDTO.s360aie__Contact_First_Name__c = cliente.dataValues.nombre;
            stagingDTO.s360aie__Contact_Last_Name__c = cliente.dataValues.apellido;
            stagingDTO.Tipo_de_Documento_Col__c = tipo_documento_cliente?.descripcion || "";
            stagingDTO.Cedula_de_Ciudadan_a__c = cliente.dataValues.numero_documento.toString();
            stagingDTO.s360aie__Contact_Primary_Country__c = cliente.dataValues.pais;
            stagingDTO.s360aie__Contact_Primary_CountryCode__c = staticParameters.countryCode;
            stagingDTO.s360aie__Contact_Primary_Address__c = cliente.dataValues.direccion;
            stagingDTO.s360aie__Contact_Primary_Suburb_Town__c = cliente.dataValues.ciudad;
            
            stagingDTO.s360aie__Contact_Primary_State_County__c = departamento?.descripcion || "";
            stagingDTO.s360aie__Contact_Primary_State_CountyCode__c = departamento?.codigo || "";
            stagingDTO.CodeLocalMobile__c = cliente.dataValues.prefijo.toString();
            stagingDTO.s360aie__Contact_Phone_Mobile_Int__c = true;
            stagingDTO.s360aie__Contact_Phone_Mobile__c = cliente.dataValues.telefono.toString();
            stagingDTO.s360aie__Contact_Email_Personal__c = cliente.dataValues.email;
            stagingDTO.s360aie__Regular_Giving_Frequency__c = transaccion.tipo_donacion === DonationTypes.MENSUAL ? "12" : "none";
            stagingDTO.CurrencyIsoCode = staticParameters.currency;
            stagingDTO.s360aie__Regular_Giving_Amount__c = transaccion.monto;
            stagingDTO.s360aie__Regular_Giving_Payment_Method__c = staticParameters.paymentMethod;
            stagingDTO.PaymentMethodSubType__c = "";
            stagingDTO.s360aie__Regular_Giving_Start_Date__c = transaccion_payu.transactionResponse.operationDate;
            stagingDTO.AccountType__c = staticParameters.accountType;
            stagingDTO.Account_Holder_Tipo_de_Doc_Col__c = tipo_documento?.descripcion || "";
            stagingDTO.Account_Holder_CC__c = transaccion.numero_documento_tarjetahabiente ? transaccion.numero_documento_tarjetahabiente : cliente.dataValues.numero_documento;
            stagingDTO.s360aie__Transaction_CC_Account_Name__c = transaccion.nombre_apellido_tarjetahabiente ? transaccion.nombre_apellido_tarjetahabiente : cliente.dataValues.nombre + " " + cliente.dataValues.apellido;
            stagingDTO.s360aie__Regular_Giving_Preferred_Debit_Date__c = "28";
            if(new Date().getDate() < 28) {
                stagingDTO.s360aie__Regular_Giving_Preferred_Debit_Date__c = new Date().getDate().toString();
            }
            stagingDTO.First_6_PayU__c = transaccion.numero_enmascarado_tarjeta.toString().substring(0, 6);
            stagingDTO.CardNumberLastFourDigitsOnly__c = transaccion.numero_enmascarado_tarjeta.toString().substring(transaccion.numero_enmascarado_tarjeta.toString().length - 4);
            stagingDTO.PayU_Card__c = transaccion.metodo_pago;
            stagingDTO.paymentNetworkResponseCode__c = transaccion_payu.transactionResponse.paymentNetworkResponseCode;
            stagingDTO.paymentNetworkResponseErrorMessage__c = transaccion_payu.transactionResponse.paymentNetworkResponseErrorMessage;
            stagingDTO.Credit_Card_Token__c = transaccion.token_tarjeta;
            stagingDTO.Reference_Code__c = transaccion.id;
            stagingDTO.gpi__utm_campaign__c = requestData.utm_campaign;
            stagingDTO.gpi__utm_content__c = requestData.utm_content;
            stagingDTO.gpi__utm_medium__c = requestData.utm_medium;
            stagingDTO.gpi__utm_source__c = requestData.utm_source;
            stagingDTO.gpi__utm_term__c = requestData.utm_term;
            stagingDTO.s360aie__Transaction_Close_Date__c = transaccion_payu.transactionResponse.operationDate;
            stagingDTO.s360aie__Transaction_Amount__c = transaccion.monto;
            stagingDTO.s360aie__Transaction_Already_Paid__c = true;
            stagingDTO.s360aie__Transaction_Payment_Method__c = staticParameters.paymentMethod;
            stagingDTO.s360aie__Transaction_CC_Type__c = staticParameters.paymentMethod;
            stagingDTO.s360aie__DDC_Signup_Date__c = (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()).toString();
            stagingDTO.s360aie__ProcessName__c = staticParameters.processName;
            stagingDTO.s360aie__Incomplete__c = true;
            stagingDTO.RecordTypeId = staticParameters.recordTypeId;
            stagingDTO.s360aie__Contact_Date_of_Birth2__c = cliente.dataValues.fecha_nacimiento.toISOString();
            
            return stagingDTO;
    }

    async handle_creacion_transaccion_response(response: any, transaccion: any, record: any, transaccion_sf: any, cliente: ClienteInstance): Promise<any | null>{
        let estadoAnterior = transaccion.estado;
        if (response.data.errors?.length === 0) {
            const updated_transaccion = await transaccion.update({
                    salesforce_transaction_id: response.data.id,
                    estado: estadoAnterior === "APPROVED" ? estadosTransaccion.FINALIZADA_SF_OK : estadosTransaccion.FINALIZADA_SF_ERROR
                },
                {where: { id: transaccion.id }}
            );

            createLog(transaccion.get("id"), LogsEvents.TRANSACCION_PAGO_FINALIZADA_SALESFORCE, transaccion_sf, response.data, response.http_code);
        } else if(response.errors?.length > 0) {
            const updated_transaccion = await transaccion.update({estado: estadosTransaccion.FINALIZADA_SF_ERROR}, {where: { id: transaccion.id }});

            createLog(transaccion.get("id"), LogsEvents.ERROR_EN_LA_RESPUESTA_DEL_SERVICIO, transaccion_sf, response.data, response.http_code);
        }
    }

    public stringify(obj:any) {
        let cache: any = [] ;
        let str = JSON.stringify(obj, function(key, value) {
          if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        });
        cache = null; // reset the cache
        return str;
    }
}

export default SalesforceService;
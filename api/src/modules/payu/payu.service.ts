import InscripcionDTO from "@/modules/inscripcion/dtos/inscripcionRequestDTO";
import express, { NextFunction } from "express";
import PayUModel from "@/modules/transaccion/transaccion.model";
import LogsEvents from "../logs/enums/logsEvents";
import createLog from "../logs/createLog";
import sequelize from "@/config/db-config";
import axios from "axios";
import {TokenizarTarjetaRequestDTO} from "./dtos/TokenizarTarjetaRequestDTO";
import TransaccionModel from "@/modules/transaccion/transaccion.model";
import {TransaccionConTarjetaDTO} from "./dtos/TransaccionConTarjetaDTO";
import crypto from "crypto";
import {ClienteModel, ClienteInstance}  from "@/modules/cliente/cliente.model";
import { payuStaticParameters } from "./payu.staticParameters";
import { TokenizarTarjetaResponseDTO } from "./dtos/TokenizarTarjetaResponseDTO";
import { estadosTransaccion } from "../transaccion/enums/transaccion.estados.enum";

class PayUService {
    async tokenizar_tarjeta(data: TokenizarTarjetaRequestDTO, transaccion: any): Promise<TokenizarTarjetaResponseDTO | null> {
        console.log("INICIANDO TOKENIZACION DE TARJETA")
        console.log("TOKENIZAR REQUEST " + this.stringify(data));

        console.log("URL PAYU API: " + process.env.URL_PAYU_API);
        const tokenizacion_response = await axios.post<TokenizarTarjetaResponseDTO>(String(process.env.URL_PAYU_API), data)
                                                .then(response => {
                                                    console.log("RESPUESTA DE TOKENIZACION " + this.stringify(response.data));
                                                    return response.data;
                                                });

        await this.handle_tokenizacion_response(tokenizacion_response, transaccion, data);
        
        console.log("FINALIZANDO TOKENIZACION DE TARJETA")
        return tokenizacion_response;
    }

    async handle_tokenizacion_response(response: TokenizarTarjetaResponseDTO, transaccion: any , data: TokenizarTarjetaRequestDTO): Promise<any | null>{
        console.log("ENTRANDO A HANDLE")
        console.log("RESPUESTA DE TOKENIZACION: " + this.stringify(response));

        if (response.code === "SUCCESS") {
          console.log("ENTRANDO A SUCCESS")
            const updated_transaccion = await transaccion.update({
                    token_tarjeta: response.creditCardToken.creditCardTokenId,
                    numero_enmascarado_tarjeta: response.creditCardToken.maskedNumber,
                    estado: estadosTransaccion.INICIALIZADA
                },
                {where: { id: transaccion.id }}
            );

            createLog(updated_transaccion.id, LogsEvents.TRANSACCION_INICIALIZADA, JSON.stringify(data), JSON.stringify(response));
            
        } else if(response.code === "ERROR") {
            const updated_transaccion = await transaccion.update({estado: estadosTransaccion.ERROR}, {where: { id: transaccion.id }});

            createLog(updated_transaccion.id, LogsEvents.ERROR_EN_LA_RESPUESTA_DEL_SERVICIO, null, response);
        }
    }

    async enviar_transaccion(transactionDTO: TransaccionConTarjetaDTO, transaccion: any, cliente: ClienteInstance): Promise<any | null> {
        console.log("INICIANDO ENVIO DE TRANSACCION PAYU")
        const transaccion_response = await axios.post(String(process.env.URL_PAYU_API), transactionDTO)
                                                    .then(response => {
                                                        return response.data;
                                                    });

        console.log("FINALIZANDO ENVIO DE TRANSACCION PAYU");
        return transaccion_response
    }

    async handle_transaccion_response(response: any, transactionDTO: TransaccionConTarjetaDTO, transaccion: any, cliente: ClienteInstance): Promise<any | null>{
        console.log("CODIGO DE RESPUESTA: " + response.code);
        if (response.code === "SUCCESS" && response.transactionResponse.responseCode === "APPROVED")
        {
            const updated_transaccion = await transaccion.update({
                    estado: estadosTransaccion.CONFIRMADA_PAYU,
                    payu_order_id: response.transactionResponse.orderId,
                    payu_transaction_id: response.transactionResponse.transactionId,
                    payu_response_code: response.transactionResponse.responseCode,
                    payu_bank_response_code: response.transactionResponse.paymentNetworkResponseCode,
                    payu_bank_response_message: response.transactionResponse.paymentNetworkResponseErrorMessage,
                    payu_fecha_transaccion: response.transactionResponse.operationDate,
                }, 
                {where: { id: transaccion.id }}
            );

            cliente.update({estado: "ACTIVO_PAYU"}, {where: { id: cliente.dataValues.id }});
            
            transactionDTO.transaction.creditCard.number = "";
            transactionDTO.transaction.creditCard.expirationDate = "";
            transactionDTO.transaction.creditCard.securityCode = "";

            createLog(updated_transaccion.id, LogsEvents.TRANSACCION_CONFIRMADA, transactionDTO, response, response.http_code);
        } else if(response.code === "ERROR" || response.transactionResponse.responseCode !== "APPROVED") {
            const updated_transaccion = await transaccion.update({estado: estadosTransaccion.ERROR}, {where: { id: transaccion.id }});

            createLog(updated_transaccion.id, LogsEvents.ERROR_EN_LA_RESPUESTA_DEL_SERVICIO, transactionDTO, response, response.http_code);  
        }
    }

    async handle_transaccion_from_salesforce_response(response: any, transactionDTO: any, transaccion: any, cliente: ClienteInstance): Promise<any | null>{
      console.log("CODIGO DE RESPUESTA: " + response.code);
      if (response.code === "SUCCESS" && response.transactionResponse.responseCode === "APPROVED")
      {
          const updated_transaccion = await transaccion.update({
                  estado: response.transactionResponse.responseCode,
                  payu_order_id: response.transactionResponse.orderId,
                  payu_transaction_id: response.transactionResponse.transactionId,
                  payu_response_code: response.transactionResponse.responseCode,
                  payu_bank_response_code: response.transactionResponse.paymentNetworkResponseCode,
                  payu_bank_response_message: response.transactionResponse.paymentNetworkResponseErrorMessage,
                  payu_fecha_transaccion: response.transactionResponse.operationDate,
              }, 
              {where: { id: transaccion.id }}
          );

          cliente.update({estado: "ACTIVO_PAYU"}, {where: { id: cliente.dataValues.id }});
          
          transactionDTO.transaction.creditCard.number = "";
          transactionDTO.transaction.creditCard.expirationDate = "";
          transactionDTO.transaction.creditCard.securityCode = "";

          createLog(updated_transaccion.id, LogsEvents.TRANSACCION_CONFIRMADA, transactionDTO, response, response.http_code);
      } else if(response.code === "ERROR" || response.transactionResponse.responseCode !== "APPROVED") {
          const updated_transaccion = await transaccion.update({estado: estadosTransaccion.ERROR}, {where: { id: transaccion.id }});

          createLog(updated_transaccion.id, LogsEvents.ERROR_EN_LA_RESPUESTA_DEL_SERVICIO, transactionDTO, response, response.http_code);  
      }
  }

    async enviar_transaccion_from_salesforce(record: any, transaccion: any, cliente: ClienteInstance): Promise<any> {
      console.log("INICIANDO ENVIO DE TRANSACCION PAYU DESDE SALESFORCE")
        const referenceCode = record.s360a__RegularGiving__r.UTM_Campaign__c + " - " + cliente.dataValues.numero_documento + " - " + record.attributes.url.split("/").reverse()[0];
        const transaccionConTarjetaDTO = {
            language: payuStaticParameters.language,
            command: payuStaticParameters.command_transaccion,
            merchant: payuStaticParameters.merchant,
            transaction: {
              order: {
                accountId: process.env.PAYU_ACCOUNT_ID,
                referenceCode: referenceCode,
                description: record.s360a__RegularGiving__r.UTM_Campaign__c + " - " + cliente.dataValues.numero_documento,
                language: payuStaticParameters.language,
                signature: this.getSignature(record.Amount, referenceCode),
                additionalValues: {
                  TX_VALUE: {
                    value: record.Amount,
                    currency: payuStaticParameters.currency
                  },
                  TX_TAX: {
                    value: 0,
                    currency: payuStaticParameters.currency
                  },
                  TX_TAX_RETURN_BASE: {
                    value: 0,
                    currency: payuStaticParameters.currency
                  },
                },
                buyer: {
                  merchantBuyerId: transaccion.cliente_id.toString(),
                  fullName: cliente.dataValues.nombre + " " + cliente.dataValues.apellido,
                  emailAddress: cliente.dataValues.email,
                  contactPhone: cliente.dataValues.prefijo + "" + cliente.dataValues.telefono,
                  dniNumber: cliente.dataValues.numero_documento.toString(),
                },
              },
              creditCardTokenId: record.s360a__RegularGiving__r.Credit_Card_Token_RG__c,
              creditCard: {
                processWithoutCvv2: "true"
              },
              payer: {
                emailAddress: cliente.dataValues.email,
                merchantPayerId: transaccion.cliente_id,
                fullName: record.s360a__RegularGiving__r.Account_Name__c,
                contactPhone: cliente.dataValues.prefijo + "" + cliente.dataValues.telefono,
                dniNumber: record.s360a__RegularGiving__r.Account_Holder_CC__c
              },
              extraParameters: {
                INSTALLMENTS_NUMBER: 1
              },
              type: payuStaticParameters.transactionType,
              paymentMethod: transaccion.metodo_pago,
              paymentCountry: payuStaticParameters.paymentCountry,
              deviceSessionId: "vghs6tvkcleq7i9i6f56",
              ipAddress: "172.182.28.77",
              cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
              userAgent: "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0",
            },
            test: process.env.PAYU_TEST_MODE === "true" ? true : false
          };
      
          console.log("REQUEST TRANSACCION CON TARJETA: " +  JSON.stringify(transaccionConTarjetaDTO))
          console.log({"TRANSACCION: ": this.stringify(transaccion), "CLIENTE: ": this.stringify(cliente), "TOKEN_TARJETA: ": record.s360a__RegularGiving__r.Credit_Card_Token_RG__c});
      
          const updated_transaccion = await transaccion.update({
            order_signature: transaccionConTarjetaDTO.transaction.order.signature,
            request_session_id: transaccionConTarjetaDTO.transaction.deviceSessionId,
            request_direccion_ip: transaccionConTarjetaDTO.transaction.ipAddress,
            request_user_agent: transaccionConTarjetaDTO.transaction.userAgent,
            request_cookie: transaccionConTarjetaDTO.transaction.cookie,
            estado: estadosTransaccion.CONFIRMACION_PENDIENTE
          }, {where: { id: transaccion.id }});

          const response = await this.enviar_transaccion(transaccionConTarjetaDTO, updated_transaccion, cliente);
          await this.handle_transaccion_from_salesforce_response(response, transaccionConTarjetaDTO, updated_transaccion, cliente);

          console.log("RESPUESTA DE TRANSACCION CON TARJETA: " + JSON.stringify(response));
          console.log("FINALIZANDO ENVIO DE TRANSACCION PAYU DESDE SALESFORCE")
        return response;
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

    public getSignature(monto: any, referenceCode: string): string {
      return crypto.createHash('md5')
        .update(`${process.env.PAYU_API_KEY}~${process.env.PAYU_ID_COMERCIO}~${referenceCode}~${monto}~COP`)
        .digest('hex');
    }

    public ofuscateCardNumber(cardNumber: any): string {
        const cardNumberString = cardNumber.toString();
        const firstFour = cardNumberString.substring(0, 4);
        const lastFour = cardNumberString.substring(cardNumberString.length - 4, cardNumberString.length);
        const masked = firstFour + "XXXXXXXX" + lastFour;
        return masked;
    }
}

export default PayUService;

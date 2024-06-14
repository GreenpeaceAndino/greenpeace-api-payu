import express, { NextFunction } from "express";
import InscripcionDTO from "@/modules/inscripcion/dtos/inscripcionRequestDTO";
import InscripcionService from "./inscripcion.service";
import Tarjetas from "./tarjetas";
import ClienteService from "../cliente/cliente.service";
import PayUService from "../payu/payu.service";
import {TokenizarTarjetaRequestDTO} from "../payu/dtos/TokenizarTarjetaRequestDTO";
import {TransaccionConTarjetaDTO} from "../payu/dtos/TransaccionConTarjetaDTO";
import TransaccionService from "../transaccion/transaccion.service";
import SalesforceService from "../salesforce/salesforce.service";
import StagingDTO from "../salesforce/dtos/stagingDTO";
import crypto from "crypto";
import {ClienteModel, ClienteInstance}  from "@/modules/cliente/cliente.model";
import { payuStaticParameters } from "../payu/payu.staticParameters";
import { estadosTransaccion } from "../transaccion/enums/transaccion.estados.enum";

export class InscripcionController {
  protected service: any;
  protected cliente_service: any;
  protected transaccion_service: any;
  protected payu_service: any;
  protected salesforce_service: any;

  public constructor() {
    this.service = new InscripcionService();
    this.cliente_service = new ClienteService();
    this.transaccion_service = new TransaccionService();
    this.payu_service = new PayUService();
    this.salesforce_service = new SalesforceService();
  }

  public async incripcion(
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("requestData (1)", res.locals.validatedBody);
      const requestData: InscripcionDTO = res.locals.validatedBody;
      console.log("requestData (2)", res.locals.validatedBody);
      await this.validateTarjeta(requestData, res);
      requestData.numero_documento_tarjetahabiente = requestData.numero_documento_tarjetahabiente.replace(/\./g, "");
      requestData.numero_documento_cliente = requestData.numero_documento_cliente.replace(/\./g, "");
      console.log("(3)");
      
      const deviceData = this.getDeviceData(req);
      console.log("(4)");
      const cliente = await this.cliente_service.findOrCreate(requestData);
      console.log("(5)");
      
      const transaccion = await this.transaccion_service.create_from_inscripcion(requestData, cliente.id);
      console.log("(6)");
      
      const token_tarjeta = await this.tokenizar_tarjeta(requestData, cliente, transaccion);
      console.log("(7)");
      
      const transaccion_payu = await this.enviar_transaccion_payu(requestData, token_tarjeta, transaccion, cliente, deviceData);
      console.log("(8)");
      
      if(transaccion_payu.code === "SUCCESS" && transaccion_payu.transactionResponse.responseCode === "APPROVED") {
        const staging = await this.salesforce_service.create_staging(requestData, transaccion, cliente, transaccion_payu);
        if(staging){
          res.status(200).json({
            "messages": [
                "Inscripcion Exitosa"
            ]
          });
        }
      }else{
        res.status(400).json({
          "messages": [
              "Error en la Transacción. Disculpe las molestias ocasionadas. Por favor, intente más tarde"
          ]
        });
      }
    } catch (error) {
      console.log("ERROR" + error);
      res
        .status(400)
        .json({
          "messages": [
            "Error de conexión. Disculpe las molestias ocasionadas. Por favor, intente más tarde"
          ]
        });
    }
  }

  public getDeviceData(req: express.Request): any {
    console.log("SOCKET: " + this.payu_service.stringify(req.socket));
    const result = {
      deviceSessionId: crypto.randomBytes(16).toString("hex"),
      ipAddress: req.socket.remoteAddress?.split(":").pop(),
      cookie: crypto.randomBytes(16).toString("hex"),
      userAgent: req.headers["user-agent"]
    }
    console.log("DEVICE DATA: " + JSON.stringify(result));
    return result
  }

  public async tokenizar_tarjeta(requestData: InscripcionDTO, cliente: ClienteInstance, transaccion: any): Promise<any | null> {
    const tokenizarTarjetaRequestDTO = {
      language: payuStaticParameters.language,
      command: payuStaticParameters.command_tokenizar_tarjeta,
      merchant: payuStaticParameters.merchant,
      creditCardToken: {
        payerId: cliente.dataValues.id?.toString() || "0",
        name: requestData.nombre_apellido_tarjetahabiente,
        identificationNumber: requestData.numero_documento_tarjetahabiente,
        paymentMethod: requestData.metodo_pago,
        number: requestData.numero_tarjeta,
        expirationDate: requestData.fecha_vencimiento_tarjeta,
      }
    };
    
    const response = await this.payu_service.tokenizar_tarjeta(tokenizarTarjetaRequestDTO, transaccion);

    return response;
  }

  public async enviar_transaccion_payu(requestData: InscripcionDTO ,token_tarjeta: any, transaccion: any, cliente: ClienteInstance, deviceData: any): Promise<any | null> {
    const referenceCode = requestData.utm_campaign + " - " + cliente.dataValues.numero_documento.toString() + " - " + transaccion.id.toString();
    console.log("REFERENCE CODE: " + referenceCode);
    const transaccionConTarjetaDTO = {
      language: payuStaticParameters.language,
      command: payuStaticParameters.command_transaccion,
      merchant: payuStaticParameters.merchant,
      transaction: {
        order: {
          accountId: process.env.PAYU_ACCOUNT_ID,
          referenceCode: referenceCode,
          description: requestData.utm_campaign + " - " + cliente.dataValues.numero_documento,
          language: payuStaticParameters.language,
          signature: this.payu_service.getSignature(transaccion.monto, referenceCode),
          additionalValues: {
            TX_VALUE: {
              value: transaccion.monto,
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
        payer: {
          merchantPayerId: transaccion.cliente_id.toString(),
          fullName: transaccion.nombre_apellido_tarjetahabiente,
          emailAddress: cliente.dataValues.email,
          contactPhone: cliente.dataValues.prefijo + "" + cliente.dataValues.telefono,
          dniNumber: requestData.numero_documento_tarjetahabiente.toString(),
        },
        creditCardTokenId: token_tarjeta.creditCardToken.creditCardTokenId,
        creditCard: {
          expirationDate: requestData.fecha_vencimiento_tarjeta,
          name: "APPROVED", //requestData.nombre_apellido_tarjetahabiente,
          processWithoutCvv2: false,
          securityCode: requestData.cvv,
        },
        extraParameters: {
          INSTALLMENTS_NUMBER: 1
        },
        type: payuStaticParameters.transactionType,
        paymentMethod: transaccion.metodo_pago,
        paymentCountry: payuStaticParameters.paymentCountry,
        deviceSessionId: deviceData.deviceSessionId,
        ipAddress: deviceData.ipAddress,
        cookie: deviceData.cookie,
        userAgent: deviceData.userAgent,
      },
      test: process.env.PAYU_TEST_MODE === "true" ? true : false
    };

    console.log("REQUEST TRANSACCION CON TARJETA: " +  JSON.stringify(transaccionConTarjetaDTO))

    const updated_transaccion = await transaccion.update({
      order_signature: transaccionConTarjetaDTO.transaction.order.signature,
      request_session_id: transaccionConTarjetaDTO.transaction.deviceSessionId,
      request_direccion_ip: transaccionConTarjetaDTO.transaction.ipAddress,
      request_user_agent: transaccionConTarjetaDTO.transaction.userAgent,
      request_cookie: transaccionConTarjetaDTO.transaction.cookie,
      estado: estadosTransaccion.CONFIRMACION_PENDIENTE
    }, {where: { id: transaccion.id }});
    
    const response = await this.payu_service.enviar_transaccion(transaccionConTarjetaDTO, updated_transaccion, cliente);
    await this.payu_service.handle_transaccion_response(response, transaccionConTarjetaDTO, updated_transaccion, cliente);

    console.log("RESPUESTA DE TRANSACCION CON TARJETA: " + JSON.stringify(response));

    return response;
  }

  public async validateTarjeta(
    requestData: InscripcionDTO,
    res: express.Response
  ): Promise<void | null> {
    const cardLengths = Tarjetas[requestData.metodo_pago];
      if (
        requestData.metodo_pago != "PSE" &&
        (requestData.numero_tarjeta.toString().length < cardLengths.min_length ||
        requestData.numero_tarjeta.toString().length > cardLengths.max_length)
      ) {
        res.status(400).json({
                "messages": [
                    "Request validation errors."
                ],
                "validationErrors": {
                    "numero_tarjeta": [
                        "Número de tarjeta inválido."
                    ]
                }
            });
      } else {
        return;
      }
  } 
}

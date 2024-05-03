import {ClienteModel, ClienteInstance} from "@/modules/cliente/cliente.model";
import TransaccionService from "../transaccion/transaccion.service";
import PayUService from "../payu/payu.service";
import SalesforceService from "../salesforce/salesforce.service";
import { createEmailSuccessBody, successEmailSubject } from "./email/successEmailTemplate";
import sendEmail from "../inscripcion/email/sendEmail";
import sendEmailError from "./email/sendEmailError";
import { estadosTransaccion } from "../transaccion/enums/transaccion.estados.enum";

const finishAndSendEmail = async (record: any, transaccion: any, cliente: ClienteInstance) => {
  const date = new Date().toISOString().split("T")[0];
  transaccion.reload();
  if(transaccion.estado === estadosTransaccion.FINALIZADA_SF_OK){
    const emailBody = createEmailSuccessBody(record, transaccion, cliente, date);
    sendEmail(cliente.dataValues.email, emailBody, successEmailSubject);
  }
}

const checkCreateRecords = async (token: string, data: PagosResponse) => {
  const records = data.records;
  console.log("El valor de records es: " + records);

  for (const record of records) {
    try {
      const transaccion_service = new TransaccionService();
      const payu_service = new PayUService();
      const salesforce_service = new SalesforceService();

      const cliente = await ClienteModel.findOne({
        where: {
          numero_documento: record.s360a__Contact__r.Cedula_de_Ciudadan_a__c,
        }
      });
      if (!cliente) {
        console.log("No se encontro el cliente con el numero de documento: " + record.s360a__Contact__r.Cedula_de_Ciudadan_a__c + "Continua el siguiente record");
        continue;
      }
    
      const transaccion = await transaccion_service.create_from_salesforce(record, cliente.dataValues.id);
0
      const transaccion_payu = await payu_service.enviar_transaccion_from_salesforce(record, transaccion, cliente);
      if(transaccion_payu.code === "SUCCESS"){
        const transaccion_salesforce = await salesforce_service.create_transaccion(record, transaccion_payu, cliente, transaccion);
      
        //finishAndSendEmail(record, transaccion, cliente);
      }
      console.log("Termino la operacion para este record:." + record.Id);
    } catch (error) {
      console.log(error);
      sendEmailError(error);
    }
  }
};

export default checkCreateRecords;

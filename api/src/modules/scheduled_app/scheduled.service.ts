import SalesforceService from "../salesforce/salesforce.service";
import getPagos from "./api/get/getPagos";
import checkCreateRecords from "./checkCreateRecords";
import sendEmail from "../inscripcion/email/sendEmail";
import {
  errorEmailRecipient,
  errorEmailSubject,
} from "./email/errorEmailTemplate";
import sendEmailError from "./email/sendEmailError";

const createScheduledAppRG = async () => {
  // Implementation here
  try {
    // Obtencion del token
    const salesforceService = new SalesforceService();
    const token = await salesforceService.auth();
    if (!token) {
      console.log("No se recibió token");
      throw new Error(
        `Error al obtener token de Salesforce, para la scheduled app de RG.`
      );
    }
    
    console.log(`El token recibido es: ${token}`);

    const responsePagos = await getPagos(token);
    const confirmedRecords = checkCreateRecords(token, responsePagos);
    return confirmedRecords;
  } catch (error) {
    console.error(error);

    sendEmailError(error);
    console.log("Ocurrio un error en la ejecucion del createScheduledAppRG.");
    return null;
  }
};

export default createScheduledAppRG;

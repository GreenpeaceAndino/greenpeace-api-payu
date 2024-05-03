import sendEmail from "@/modules/inscripcion/email/sendEmail";
import {
  createEmailErrorBody,
  errorEmailRecipient,
  errorEmailSubject,
} from "./errorEmailTemplate";

const sendEmailError = (error: any) => {
  const body = createEmailErrorBody(error);
  sendEmail(errorEmailRecipient, body, errorEmailSubject);
};

export default sendEmailError;

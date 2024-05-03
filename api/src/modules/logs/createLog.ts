import LogsEvents from "./enums/logsEvents";
import LogModel from "./logs.model";
import payu_service from "./../payu/payu.service"
const service = new payu_service();

type LogEntry = {
  fecha_alta: Date;
  transaccion_id: string
  evento: string;
  request?: string | null;
  http_code_response?: number | null;
  response?: string | null;
};
const createLog = async (
  transaccionId: any,
  logEvent: LogsEvents,
  request?: any,
  response?: any,
  httpCodeResponse?: number
) => {
  const logData: LogEntry = {
    transaccion_id: transaccionId,
    evento: logEvent,
    request: request ? service.stringify(request) : null,
    fecha_alta: new Date(),
    response: response ? service.stringify(response) : null,
    http_code_response: httpCodeResponse,
  };
  await LogModel.create(logData);
};



export default createLog;

import createScheduledAppRG from "./scheduled.service"

class ProcessPaymentsService {
  async executeScheduledService(): Promise<string> {
    //Scheduled app Regular Giving
    const createAppRG = createScheduledAppRG();
    console.log("TEST PROCESS--------" + process.env.API_URL_GET_PAGOS);
    return "Se estan procesando los pagos One off y los Regular Giving.";
  }
}

export default ProcessPaymentsService;

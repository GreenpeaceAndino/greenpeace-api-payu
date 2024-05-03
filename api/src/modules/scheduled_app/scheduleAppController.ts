import express, { NextFunction } from "express";
import ProcessPaymentsService from "./processPayments.service";

class ScheduleAppController {
  protected service: any;
  protected processPaymentsService: ProcessPaymentsService; // Servicio Inscripcion

  public constructor() {
    //this.service = container.resolve('IInscripcionService');
    this.processPaymentsService = new ProcessPaymentsService();
  }

  public async runScheduledApp(
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response =
        await this.processPaymentsService.executeScheduledService();
      if (response !== null) {
        res.status(201).json(response);
      } else {
        res
          .status(400)
          .json("Ocurrio un error. Por favor, intente mas tarde.");
      }
    } catch (error) {
      res
        .status(400)
        .json({
          messages: [
            "Error en la Aplicación. Disculpe las molestias ocasionadas. Por favor, intente más tarde",
          ],
        });
    }
  }
}

export default ScheduleAppController;

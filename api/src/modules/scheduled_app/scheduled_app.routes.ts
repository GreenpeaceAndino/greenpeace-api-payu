import { validate } from "@/commons/middlewares/validation.middleware";
import express, { Router } from "express";

import { container } from "tsyringe";
import ScheduleAppController from "./scheduleAppController";

//container.register('IInscripcionService', { useClass: ImscripcionService });
const scheduleAppController: ScheduleAppController =
  new ScheduleAppController();

const router: Router = express.Router();

router
  .route("/")
  .get(scheduleAppController.runScheduledApp.bind(scheduleAppController));

export default router ;

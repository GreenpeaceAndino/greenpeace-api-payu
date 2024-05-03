import express from "express";
import scheduledRouter from "@/modules/scheduled_app/scheduled_app.routes";
import InscripcionRouter from "@/modules/inscripcion/inscripcion.routes";
const router = express.Router();

router.use("/processPayments", scheduledRouter);

router.use("/inscripcion", InscripcionRouter);

export default router;

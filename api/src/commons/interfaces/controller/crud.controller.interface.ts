import { IReadController } from "./read.controller.interface";
import { IWriteController } from "./write.controller.interface";

export interface ICrudController extends IReadController, IWriteController {
}
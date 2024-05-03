import { IReadService } from "./read.service.interface";
import { IWriteService } from "./write.service.interface";

export interface ICrudService<T> extends IReadService<T>, IWriteService<T> {
}
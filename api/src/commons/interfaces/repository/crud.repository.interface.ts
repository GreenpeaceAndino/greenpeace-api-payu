import { IReadRepository } from "./read.repository.interface";
import { IWriteRepository } from "./write.repository.interface";

export interface ICrudRepository<T> extends IReadRepository<T>, IWriteRepository<T> {
}
export interface IWriteService<T> {
  create(item: T): Promise<T>;
  update(id: string,  item: T): Promise<void>;
  delete(id: string): Promise<void>;
}
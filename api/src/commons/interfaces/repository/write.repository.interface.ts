export interface IWriteRepository<T> {
  create(item: T): Promise<T>;
  update(id: string, item: T): Promise<void>;
  delete(id: string): Promise<void>;
}
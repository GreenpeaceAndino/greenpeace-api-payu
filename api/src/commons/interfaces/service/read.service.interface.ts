export interface IReadService<T> {
  getAll(): Promise<Array<T>>;
  getById(id: string): Promise<T>;
}
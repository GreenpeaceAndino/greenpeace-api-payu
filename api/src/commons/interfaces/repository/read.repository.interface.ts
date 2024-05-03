export interface IReadRepository<T> {
  getAll(): Promise<Array<T>>;
  getSome(offset?: number, limit?: number, sort?: any, query?: any): Promise<{ count: number, data: Array<T> }>;
  getById(id: string): Promise<T>;
}
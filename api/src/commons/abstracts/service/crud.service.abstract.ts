import { ICrudRepository } from '@/commons/interfaces/repository/crud.repository.interface';
import { ICrudService } from '@/commons/interfaces/service/crud.service.interface';

export abstract class CrudServiceAbsctract<Schema> implements ICrudService<Schema> {
  protected repository: any;

  public constructor(repository: any) {
    this.repository = <ICrudRepository<Schema>> repository;
  }

  public async getAll(): Promise<Array<Schema>> {
    return this.repository.getAll();
  }

  public async getById(id: string): Promise<Schema> {
    return this.repository.getById(id);
  }

  public async create(item: Schema): Promise<Schema> {
    return this.repository.create(item);
  }

  public async update(id: string,  item: Schema): Promise<void> {
    this.repository.update(id, item);
  }

  public async delete(id: string): Promise<void> {
    this.repository.delete(id);
  }
}
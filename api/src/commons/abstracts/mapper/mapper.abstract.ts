import { ResponseDtoAbstract } from '../dto/response.dto';

export abstract class MapperAbstract {
  public static newInstance<T extends ResponseDtoAbstract>(newEntityClass: new () => T, entity: any): T {
    let newEntity = new newEntityClass();

    newEntity.id = entity.id;

    return newEntity;
  }
}
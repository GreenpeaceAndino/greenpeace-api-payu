import { Expose } from 'class-transformer';

export abstract class ResponseDtoAbstract {
  public constructor(init?:Partial<ResponseDtoAbstract>) {
    Object.assign(this, init);
  }

  @Expose()
  public id: number;

  /*@Expose()
  public createdAt: string;

  @Expose()
  public updatedAt: string;*/
}
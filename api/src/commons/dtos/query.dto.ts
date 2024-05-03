import { Expose } from "class-transformer";
import { IsNumber, IsObject, IsOptional, IsPositive } from "class-validator";

export class QueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Expose()
  public offset?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Expose()
  public limit?: number;

  @IsObject()
  @IsOptional()
  @Expose()
  public sort?: any;

  @IsObject()
  @IsOptional()
  @Expose()
  public filter: any;
}
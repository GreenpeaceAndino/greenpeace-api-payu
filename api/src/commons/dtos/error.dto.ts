export class ErrorDto {
  public messages: string[];
  public validationErrors?: any;

  constructor(data: Partial<ErrorDto>) {
    Object.assign(this, data);
  }
}
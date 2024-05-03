import { validate as classValidate, ValidationError } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import express, { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorDto } from '../dtos/error.dto';

export function validate<T>(dtoClass: any, skipMissingProperties = false, excludeExtraneousValues = true) {
  return function (req: express.Request, res: express.Response, next: NextFunction) {
      const output: any = plainToInstance(dtoClass, req.body, { excludeExtraneousValues, exposeUnsetFields: false });
      classValidate(output, { skipMissingProperties })
        .then((errors: ValidationError[]) => {
          if (errors.length > 0) {
            let errorsObject = errorFormatter(errors);
            const errorDto = new ErrorDto({
              messages: ['Request validation errors.'],
              validationErrors: errorsObject
            });
            res.status(StatusCodes.BAD_REQUEST).send(errorDto);
            return;
          } else {
            res.locals.validatedBody = output;
            next();
          }
      });
  };
};

function errorFormatter(errors: ValidationError[], resultObject: any = {}): any {
  errors.forEach((error: ValidationError) => {
    if(!error?.constraints && error?.children?.length) {  // Tiene hijos
      if(error.children.length > 0) { // Es array
        resultObject[error.property] = [];
        error.children.forEach(arrayError => {
          let arrayObject: any = {};
          arrayObject[arrayError.property] = {};
          if(arrayError.children?.length) {
            let arrayErrorsObj = errorFormatter(arrayError.children, arrayObject[arrayError.property]);
            resultObject[error.property].push(arrayErrorsObj);
          } else {
            let errorObj: any = {};
            errorObj[arrayError.property] = Object.values(<Object> arrayError.constraints);
            resultObject[error.property] = {...resultObject[error.property], ...errorObj};
          }
        })
       }
    } else {  // No tiene hijos
      resultObject[error.property] = Object.values(<Object> error.constraints);
    }
  });
  return resultObject;
}
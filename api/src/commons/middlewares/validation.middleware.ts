import { validate as classValidate, ValidationError } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import express, { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorDto } from '../dtos/error.dto';
import { errorEmailRecipient } from '@/modules/scheduled_app/email/errorEmailTemplate';

export function validate<T>(dtoClass: any, skipMissingProperties = false, excludeExtraneousValues = true) {
  return function (req: express.Request, res: express.Response, next: NextFunction) {
      console.log('VALIDATE (1)')
      const output: any = plainToInstance(dtoClass, req.body, { excludeExtraneousValues, exposeUnsetFields: false });
      classValidate(output, { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        console.log('VALIDATE (2)')
        if (errors.length > 0) {
          console.log('VALIDATE (2.1)')
            let errorsObject = errorFormatter(errors);
            const errorDto = new ErrorDto({
              messages: ['Request validation errors.'],
              validationErrors: errorsObject
            });
            res.status(StatusCodes.BAD_REQUEST).send(errorDto);
            return;
          } else {
            console.log('VALIDATE (2.2)')
            res.locals.validatedBody = output;
            next();
          }
      })
      .catch((error: any) => {
        console.log('Error', error);
        console.log('VALIDATE (3)')
        res.status(StatusCodes.BAD_REQUEST).send({
          messages: ['Undefined error'],
          validationError: {},
        });
      });
  };
};

function errorFormatter(errors: ValidationError[], resultObject: any = {}): any {
  console.log('Errors', errorEmailRecipient)
  console.log('ResultObj', errorEmailRecipient)
  errors.forEach((error: ValidationError) => {
    console.log("Error", error)
    if(!error?.constraints && error?.children?.length) {  // Tiene hijos
      console.log("Error (1)")
      if(error.children.length > 0) { // Es array
        console.log("Error (2)")
        resultObject[error.property] = [];
        error.children.forEach(arrayError => {
          console.log("arrayError", arrayError)
          let arrayObject: any = {};
          console.log("arrayError.property", arrayError.property)
          arrayObject[arrayError.property] = {};
          if(arrayError.children?.length) {
            console.log('arrayError.children?.length', arrayError.children?.length)
            let arrayErrorsObj = errorFormatter(arrayError.children, arrayObject[arrayError.property]);
            resultObject[error.property].push(arrayErrorsObj);
          } else {
            console.log('arrayError.property', arrayError.property)
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

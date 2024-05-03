import express, { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorDto } from '../dtos/error.dto';

export function errorHandler(error: Error, req: express.Request, res: express.Response, next: NextFunction) {
  //logger.error(error.stack || error);

  const errorDto = new ErrorDto({
    messages: [error.message]
  });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorDto);
  next(error);
}
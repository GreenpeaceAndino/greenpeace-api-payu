import express, { NextFunction } from 'express';

export interface IWriteController {
  create(req: express.Request, res: express.Response, next: NextFunction): Promise<void>;
  update(req: express.Request, res: express.Response, next: NextFunction): Promise<void>;
  delete(req: express.Request, res: express.Response, next: NextFunction): Promise<void>;
}
import express, { NextFunction } from 'express';

export interface IReadController {
  getAll(req: express.Request, res: express.Response, next: NextFunction): Promise<void>;
  getSome(req: express.Request, res: express.Response, next: NextFunction): Promise<void>;
  getById(req: express.Request, res: express.Response, next: NextFunction): Promise<void>;
}
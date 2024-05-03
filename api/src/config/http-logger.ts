import morgan from 'morgan';
import { Request, Response } from 'express';
import * as config from '@/config/config';
import logger from './logger';

const getIpFormat = () => (config.ENVIRONMENT_IS_PRODUCTION ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const warningResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

const successHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 300,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

const warningHandler = morgan(warningResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400 || res.statusCode >= 500,
  stream: { write: (message: string) => logger.warn(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 500,
  stream: { write: (message: string) => logger.error(message.trim()) },
});

export default {
  successHandler,
  warningHandler,
  errorHandler
};
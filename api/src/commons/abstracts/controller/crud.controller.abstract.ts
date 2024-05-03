import express, { NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ICrudService } from '@/commons/interfaces/service/crud.service.interface';
import { ICrudController } from '@/commons/interfaces/controller/crud.controller.interface';
import { QueryDto } from '@/commons/dtos/query.dto';

export abstract class CrudControllerAbstract<Schema, RequestDto> implements ICrudController {
  protected service: any;
  protected mapper: any;

  public constructor(service: any, mapper: any) {
    this.service = <ICrudService<Schema>> service;
    this.mapper = mapper;
  }

  public async getAll(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    try {
      const items: Array<Schema> = await this.service.getAll();
      const itemsDto: Array<RequestDto> = items.map(item => this.mapper.modelToDto(item));
      res.status(StatusCodes.OK).json(itemsDto);
    } catch(error) {
      next(error);
    }
  }

  public async getSome(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    try {
      const queryDto: QueryDto = res.locals.validatedBody;
      const response: { count: number, data: Array<Schema> } = await this.service.getSome(queryDto.offset, queryDto.limit, queryDto.sort, queryDto.filter);
      const responseWithDto: { count: number, data: Array<RequestDto> } = { count: response.count, data: response.data.map(item => this.mapper.modelToDto(item)) };
      res.status(StatusCodes.OK).json(responseWithDto);
    } catch(error) {
      next(error);
    }
  }

  public async getById(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    try {
      const item: Schema = await this.service.getById(req.params.id);
      if(item) {
        const itemDto: RequestDto = this.mapper.modelToDto(item);
        res.status(StatusCodes.OK).json(itemDto);
      } else {
        res.status(StatusCodes.NOT_FOUND).send();
      }
    } catch(error) {
      next(error);
    }
  }

  public async create(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    try {
      const itemDto: RequestDto = res.locals.validatedBody;
      const item: Schema = this.mapper.dtoToModel(itemDto);
      const newItem: Schema = await this.service.create(item);
      const itemResponseDto = this.mapper.modelToDto(newItem);
      res.status(StatusCodes.CREATED).json(itemResponseDto);
    } catch(error) {
      next(error);
    }
  }

  public async update(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    try {
      const itemDto: RequestDto = res.locals.validatedBody;
      const item: Schema = this.mapper.dtoToModel(itemDto);
      await this.service.update(req.params.id, item);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch(error) {
      next(error);
    }
  }

  public async delete(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    try {
      await this.service.delete(req.params.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch(error) {
      next(error);
    }
  }
}
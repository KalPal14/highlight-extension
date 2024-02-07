import { Router, Request, Response, NextFunction } from 'express';

import { IMiddleware } from '../middlewares/middleware.interface';
import { TController } from './controller.type';

export interface IRouteController {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'delete'>;
	func: TController;
	middlewares?: IMiddleware[];
}

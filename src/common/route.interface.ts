import { Router, Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.interface';

export interface IRouteController {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
	func: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: IMiddleware[];
}

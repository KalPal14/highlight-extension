import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { TController } from '../common/types/controller.type';

import { IRouteController } from './types/route.interface';

import { HTTPError } from '@/exceptions/http-error.class';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor() {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected send<T>(res: Response, code: number, msg: T): Response<T> {
		res.contentType('application/json');
		return res.status(code).send(msg);
	}

	protected ok<T>(res: Response, msg: T): Response<T> {
		return this.send(res, 200, msg);
	}

	protected created<T>(res: Response, msg: T): Response<T> {
		return this.send(res, 201, msg);
	}

	protected bindRoutes(routes: IRouteController[]): void {
		routes.forEach((route) => {
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const handler: TController = async (req, res, next) => {
				try {
					await route.func.bind(this)(req, res, next);
				} catch {
					next(new HTTPError(500, 'Unexpected error'));
				}
			};
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this._router[route.method](route.path, pipeline);
		});
	}
}

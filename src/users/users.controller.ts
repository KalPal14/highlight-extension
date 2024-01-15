import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

import { BaseController } from '@/common/base.controller';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor() {
		super();
		this.bindRoutes([
			{
				path: '/test',
				method: 'get',
				func: this.test,
			},
		]);
	}

	async test(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, {
			msg: 'TEST!!!',
		});
	}
}

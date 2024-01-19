import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '@/common/base.controller';
import TYPES from '@/types.inversify';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {
		super();
		this.bindRoutes([
			{
				path: '/test',
				method: 'get',
				func: this.test,
			},
		]);
	}

	async test({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const users = await this.usersService.test();

		this.ok(res, {
			users,
		});
	}
}

import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '@/common/base.controller';
import TYPES from '@/types.inversify';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import { USERS_PATH } from '@/constants/routes/users';
import { UsersTestDto } from './dto/users-test.dto';
import { ValidateMiddleware } from '@/middlewares/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {
		super();
		this.bindRoutes([
			{
				path: USERS_PATH.test,
				method: 'get',
				func: this.test,
				middlewares: [new ValidateMiddleware(UsersTestDto)],
			},
		]);
	}

	async test(
		{ body }: Request<{}, {}, UsersTestDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const users = await this.usersService.test();

		this.ok(res, {
			body,
			users,
		});
	}
}

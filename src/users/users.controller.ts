import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '@/common/base.controller';
import TYPES from '@/types.inversify';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import { USERS_PATH } from '@/common/constants/routes/users';
import { UsersRegisterDto } from './dto/users-register.dto';
import { ValidateMiddleware } from '@/common/middlewares/validate.middleware';
import { HTTPError } from '@/errors/http-error.class';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {
		super();
		this.bindRoutes([
			{
				path: USERS_PATH.login,
				method: 'post',
				func: this.login,
				// middlewares: [new ValidateMiddleware(UsersTestDto)],
			},
			{
				path: USERS_PATH.register,
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UsersRegisterDto)],
			},
			{
				path: USERS_PATH.logout,
				method: 'post',
				func: this.logout,
				// middlewares: [new ValidateMiddleware(UsersTestDto)],
			},
		]);
	}

	async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, 'login');
	}

	async register(
		{ body }: Request<{}, {}, UsersRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.createUser(body);

		if (result instanceof HTTPError) {
			next(result);
			return;
		}

		this.created(res, result);
	}

	async logout({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, 'logout');
	}
}

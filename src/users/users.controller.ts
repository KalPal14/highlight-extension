import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { BaseController } from '@/common/base.controller';
import TYPES from '@/types.inversify';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import { USERS_PATH } from '@/common/constants/routes/users';
import { UsersRegisterDto } from './dto/users-register.dto';
import { ValidateMiddleware } from '@/common/middlewares/validate.middleware';
import { IConfigService } from '@/common/services/config.service.interface';
import { UserModel } from '@prisma/client';
import { UsersLoginDto } from './dto/users-login.dto';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.UsersService) private usersService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super();
		this.bindRoutes([
			{
				path: USERS_PATH.login,
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UsersLoginDto)],
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

	private async signJwt({ id, email, username }: UserModel): Promise<string> {
		return new Promise((resolve, reject) => {
			const jwtKey = this.configService.get('JWT_KEY');
			if (jwtKey instanceof Error) {
				reject(jwtKey.message);
				return;
			}

			sign({ id, email, username }, jwtKey, { algorithm: 'HS256' }, (err, token) => {
				if (err) {
					reject(err.message);
				} else {
					resolve(token as string);
				}
			});
		});
	}

	async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.validateUser(body);

		if (result instanceof Error) {
			next(result);
			return;
		}

		this.signJwt(result)
			.then((jwt) => this.ok(res, { jwt }))
			.catch((err) => this.send(res, 500, { err }));
	}

	async register(
		{ body }: Request<{}, {}, UsersRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.createUser(body);

		if (result instanceof Error) {
			next(result);
			return;
		}

		this.signJwt(result)
			.then((jwt) => this.created(res, { jwt }))
			.catch((err) => this.send(res, 500, { err }));
	}

	async logout({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, 'logout');
	}
}

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import {
	HTTPError,
	RouteGuard,
	ValidateMiddleware,
	IConfigService,
	TController,
	BaseController,
} from '~libs/express-core';
import { hideEmail, IJwtPayload, TEmail } from '~libs/common';
import { UpdateUserDto, LoginDto, RegistrationDto } from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';
import { USERS_ENDPOINTS } from '~/iam/common/constants/routes/users';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersService } from '~/iam/services/users-service/users.service.interface';

import IUserInfo from './types/user-info.interface';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.UsersService) private usersService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super();
		this.bindRoutes([
			{
				path: USERS_ENDPOINTS.getUserInfo,
				method: 'get',
				func: this.getUserInfo,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: USERS_ENDPOINTS.login,
				method: 'post',
				func: this.login,
				middlewares: [new RouteGuard('guest'), new ValidateMiddleware(LoginDto)],
			},
			{
				path: USERS_ENDPOINTS.register,
				method: 'post',
				func: this.register,
				middlewares: [new RouteGuard('guest'), new ValidateMiddleware(RegistrationDto)],
			},
			{
				path: USERS_ENDPOINTS.logout,
				method: 'post',
				func: this.logout,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: USERS_ENDPOINTS.update,
				method: 'patch',
				func: this.update,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdateUserDto)],
			},
		]);
	}

	getUserInfo: TController = async ({ user }, res) => {
		const result = await this.usersService.get(user.id);
		this.ok(res, this.layoutUserInfoRes(result));
	};

	login: TController<null, LoginDto> = async ({ body }, res) => {
		const result = await this.usersService.validate(body);
		this.generateJwt(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					...this.layoutUserInfoRes(result),
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	register: TController<null, RegistrationDto> = async ({ body }, res) => {
		const result = await this.usersService.create(body);
		this.generateJwt(result)
			.then((jwt) => {
				this.created(res, {
					jwt,
					...this.layoutUserInfoRes(result),
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	logout: TController = async (req, res, next) => {
		try {
			res.clearCookie('token');
			this.ok(res, {
				msg: 'You have successfully logged out',
			});
		} catch {
			next(new HTTPError(500, 'Failed to log out'));
		}
	};

	update: TController<null, UpdateUserDto> = async ({ user, body }, res) => {
		const result = await this.usersService.update(user, body);

		if (body.username || body.email) {
			this.generateJwt(result)
				.then((jwt) => {
					this.ok(res, {
						jwt,
						email: result.email,
					});
				})
				.catch((err) => this.send(res, 500, { err }));
		} else {
			this.ok(res, this.layoutUserInfoRes(result));
		}
	};

	private layoutUserInfoRes(user: UserModel): IUserInfo {
		return {
			id: user.id,
			email: hideEmail(user.email as TEmail),
			username: user.username,
			passwordUpdatedAt: user.passwordUpdatedAt,
		};
	}

	private async generateJwt({ id, email, username }: IJwtPayload): Promise<string> {
		return new Promise((resolve, reject) => {
			const jwtKey = this.configService.get('JWT_KEY');

			sign(
				{ id, email, username },
				jwtKey,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err.message);
					} else {
						resolve(token as string);
					}
				}
			);
		});
	}
}

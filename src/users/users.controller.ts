import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '@/common/base.controller';
import TYPES from '@/types.inversify';
import { IUsersController } from './users.controller.interface';
import { IConfigService } from '@/services/config.service.interface';
import { IPrismaService } from '@/services/prisma.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: IPrismaService,
	) {
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
		const users = await this.prismaService.client.user.findMany();

		this.ok(res, {
			users,
		});
	}
}

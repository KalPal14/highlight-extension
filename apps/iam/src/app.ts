import 'reflect-metadata';
import { Server, createServer } from 'http';

import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import bodyParser from 'body-parser';

import { ILogger, IExceptionFilter, IConfigService, JwtAuthMiddleware } from '~libs/express-core';
import { USERS_BASE_ROUTE } from '~libs/routes/iam';

import { TYPES } from '~/iam/common/constants/types';
import { IUsersController } from '~/iam/controllers/users-controller/users.controller.interface';

import { TPrismaService } from './common/types/prisma-service.interface';

@injectable()
export default class App {
	app: Express;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: IUsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: TPrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.app = express();
	}

	useMiddleware(): void {
		const jwtSecret = this.configService.get('JWT_KEY');
		const clientUrls = this.configService.get('H_EXT_FE_URLS').split(', ');

		this.app.use(
			cors({
				origin: clientUrls,
				methods: ['GET', 'PATCH', 'POST', 'DELETE'],
				allowedHeaders: ['Content-Type', 'Authorization'],
			})
		);
		this.app.use(bodyParser.json());

		const jwtAuthMiddleware = new JwtAuthMiddleware(jwtSecret);
		this.app.use(jwtAuthMiddleware.execute.bind(jwtAuthMiddleware));
	}

	useRoutes(): void {
		this.app.use(USERS_BASE_ROUTE, this.usersController.router);
	}

	useExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptions();
		await this.prismaService.connect();

		if (process.env.NODE_ENV === 'test') return;

		const port = this.configService.get('IAM_PORT');
		this.server = createServer(this.app);
		this.server.listen(port, () => {
			this.logger.log(`The server is running on port ${port}`);
		});
	}
}

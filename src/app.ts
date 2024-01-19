import 'reflect-metadata';
import express, { Express } from 'express';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import bodyParser from 'body-parser';

import { USERS_ROUTER_PATH } from '@/constants/routes/users';
import TYPES from '@/types.inversify';
import { ILogger } from '@/services/logger.service.interface';
import { IUsersController } from '@/users/users.controller.interface';
import { IExceptionFilter } from '@/errors/exception.filter.interface';
import { IPrismaService } from '@/services/prisma.service.interface';
import { IConfigService } from '@/services/config.service.interface';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: IUsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: IPrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(bodyParser.json());
	}

	useRoutes(): void {
		this.app.use(USERS_ROUTER_PATH, this.usersController.router);
	}

	useExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptions();
		await this.prismaService.connect();
		this.server = createServer(
			{
				key: readFileSync('key.pem'),
				cert: readFileSync('cert.pem'),
			},
			this.app,
		);
		this.server.listen(this.port, () => {
			this.logger.log(`The server is running on port ${this.port}`);
		});
	}

	close(): void {
		this.server.close();
	}
}

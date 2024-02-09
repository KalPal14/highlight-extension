import 'reflect-metadata';
import express, { Express } from 'express';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { USERS_ROUTER_PATH } from '@/common/constants/routes/users';
import { HIGHLIGHTS_ROUTER_PATH } from '@/common/constants/routes/highlights';
import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.service.interface';
import { IUsersController } from '@/users/users.controller.interface';
import { IExceptionFilter } from '@/errors/exception.filter.interface';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import { IConfigService } from '@/common/services/config.service.interface';
import { JwtAuthMiddleware } from './common/middlewares/jwt-auth.middleware';
import { IHighlightsController } from '@/highlights/highlights.controller.interface';
import { PAGES_ROUTER_PATH } from './common/constants/routes/pages';
import { IPagesController } from './pages/pagea.controller.interface';

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
		@inject(TYPES.HighlightsController) private highlightsController: IHighlightsController,
		@inject(TYPES.PagesController) private pagesController: IPagesController,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		const jwtSecret = this.configService.get('JWT_KEY');
		const cookieSecret = this.configService.get('COOCKIE_KEY');

		this.app.use(bodyParser.json());
		this.app.use(cookieParser(cookieSecret));

		const jwtAuthMiddleware = new JwtAuthMiddleware(jwtSecret);
		this.app.use(jwtAuthMiddleware.execute.bind(jwtAuthMiddleware));
	}

	useRoutes(): void {
		this.app.use(USERS_ROUTER_PATH, this.usersController.router);
		this.app.use(HIGHLIGHTS_ROUTER_PATH, this.highlightsController.router);
		this.app.use(PAGES_ROUTER_PATH, this.pagesController.router);
	}

	useExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(port?: number): Promise<void> {
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
		this.server.listen(port || this.port, () => {
			this.logger.log(`The server is running on port ${port || this.port}`);
		});
	}

	close(): void {
		this.server.close();
	}
}

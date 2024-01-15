import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';
import { inject, injectable } from 'inversify';

import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.interface';
import { IUsersController } from '@/users/users.controller.interface';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: IUsersController,
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
	}

	init(): void {
		this.useRoutes();
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
}

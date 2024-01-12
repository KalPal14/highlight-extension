import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';
import { inject, injectable } from 'inversify';

import TYPES from '@/types.inversify';
import { ILogger } from '@/common/services/logger.interface';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send('Hello!!!');
		});
	}

	init(): void {
		try {
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
		} catch (err) {
			if (err instanceof Error) {
				this.logger.err(`Failed to start the server.`, err.message);
				return;
			}
			this.logger.err(`Failed to start the server`);
		}
	}
}

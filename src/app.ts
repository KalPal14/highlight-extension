import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction } from 'express';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';
import { injectable } from 'inversify';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor() {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
			res.status(200).send('Hello!!!');
		});
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
			console.log(`The server is running on port ${this.port}`);
		});
	}
}

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import TYPES from '@/types.inversify';
import { HTTPError } from './http-error.class';
import { ILogger } from '@/services/logger.service.interface';
import { IExceptionFilter } from './exception.filter.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.loggerService.err(`[${err.context}] Err ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
			return;
		}
		this.loggerService.err(err.message);
		res.status(500).send({ err: err.message });
	}
}

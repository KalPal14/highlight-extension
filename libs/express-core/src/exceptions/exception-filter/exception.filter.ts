import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { ILogger } from '~libs/express-core/services/logger-service/logger.service.interface';
import { EXPRESS_CORE_TYPES } from '~libs/express-core';
import { HttpException, HttpValidationException } from '~libs/common';

import { IExceptionFilter } from './exception.filter.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(EXPRESS_CORE_TYPES.LoggerService) private loggerService: ILogger) {}

	catch(
		err: Error | HttpException | HttpValidationException,
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		if (err instanceof HttpException || err instanceof HttpValidationException) {
			this.loggerService.err(`Err ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.payload });
			return;
		}
		this.loggerService.err(err.message);
		res.status(500).send({ err: 'Unexpected error' });
	}
}

import { Request, Response, NextFunction } from 'express';

import { HttpException, HttpValidationException } from '~libs/common';

export interface IExceptionFilter {
	catch: (
		err: Error | HttpException | HttpValidationException,
		req: Request,
		res: Response,
		next: NextFunction
	) => void;
}

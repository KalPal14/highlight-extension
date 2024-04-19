import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.interface';
import { JwtPayload, VerifyErrors, verify } from 'jsonwebtoken';
import { IJwtPayload } from '../types/jwt-payload.interface';

export class JwtAuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.headers.authorization) return next();
		const jwt = req.headers.authorization.split(' ')[1];
		if (!jwt) return next();
		verify(
			jwt,
			this.secret,
			(err: VerifyErrors | null, payload: string | JwtPayload | undefined) => {
				if (err || !payload || typeof payload === 'string') {
					return next();
				}
				req.user = payload as IJwtPayload;
				next();
			},
		);
	}
}

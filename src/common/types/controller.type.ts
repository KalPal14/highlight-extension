import { Request, Response, NextFunction } from 'express';

export type TController<Params = any, ResBody = any, ReqBody = any, ReqQuery = any> = (
	req: Request<Params, ResBody, ReqBody, ReqQuery>,
	res: Response<ResBody>,
	next: NextFunction,
) => Promise<void>;

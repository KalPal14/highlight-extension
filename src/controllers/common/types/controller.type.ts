import { Request, Response, NextFunction } from 'express';

import { IObject } from '@/common/types/object.interface';

export type TController<
	Params extends IObject<string> = any,
	ResBody extends IObject<any> = any,
	ReqBody extends IObject<any> = any,
	ReqQuery extends IObject<any> = any,
> = (
	req: Request<Params, ResBody, ReqBody, ReqQuery>,
	res: Response<ResBody>,
	next: NextFunction,
) => Promise<void>;

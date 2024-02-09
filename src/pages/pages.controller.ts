import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { BaseController } from '@/common/base.controller';
import { IPagesController } from './pagea.controller.interface';
import TYPES from '@/types.inversify';
import { IPagesServise } from './pages.service.interface';
import { PAGES_PATH } from '@/common/constants/routes/pages';
import { AuthGuard } from '@/common/middlewares/auth.guard';
import { GetPageDto } from './dto/get-page.dto';
import { ValidateMiddleware } from '@/common/middlewares/validate.middleware';
import { HTTPError } from '@/errors/http-error.class';

@injectable()
export class PagesController extends BaseController implements IPagesController {
	constructor(@inject(TYPES.PagesServise) private pagesServise: IPagesServise) {
		super();
		this.bindRoutes([
			{
				path: PAGES_PATH.getPage,
				method: 'get',
				func: this.getPage,
				middlewares: [new AuthGuard(), new ValidateMiddleware(GetPageDto)],
			},
		]);
	}

	async getPage(
		{ body, user }: Request<{}, {}, GetPageDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.pagesServise.getPageInfo(body, user);

		if (!result) {
			return next(new HTTPError(404, 'There is no such page'));
		}

		this.ok(res, result);
	}
}

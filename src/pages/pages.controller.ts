import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { BaseController } from '@/common/base.controller';
import { IPagesController } from './pagea.controller.interface';
import TYPES from '@/types.inversify';
import { IPagesServise } from './pages.service.interface';
import { PAGES_PATH } from '@/common/constants/routes/pages';
import { RouteGuard } from '@/common/middlewares/route.guard';
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
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(GetPageDto, 'query')],
			},
			{
				path: PAGES_PATH.getPages,
				method: 'get',
				func: this.getPages,
				middlewares: [new RouteGuard('user')],
			},
		]);
	}

	async getPage({ user, query }: Request<{}, {}, {}, GetPageDto>, res: Response): Promise<void> {
		const result = await this.pagesServise.getPageInfo(query.url, user.id);

		if (!result) {
			this.ok(res, { page: null });
			return;
		}

		this.ok(res, result);
	}

	async getPages({ user }: Request, res: Response): Promise<void> {
		const result = await this.pagesServise.getPagesInfo(user.id);

		this.ok(res, result);
	}
}

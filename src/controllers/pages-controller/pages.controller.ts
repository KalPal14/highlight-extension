import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../base-controller/base.controller';

import { IPagesController } from './pages.controller.interface';

import { PAGES_PATH } from '@/common/constants/routes/pages';
import TYPES from '@/common/constants/types.inversify';
import { GetPageDto } from '@/dto/pages/get-page.dto';
import { RouteGuard } from '@/middlewares/route-guard/route.guard';
import { ValidateMiddleware } from '@/middlewares/validate.middleware';
import { IPagesServise } from '@/services/pages-service/pages.service.interface';

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
			this.ok(res, { id: null });
			return;
		}

		this.ok(res, result);
	}

	async getPages({ user }: Request, res: Response): Promise<void> {
		const result = await this.pagesServise.getPagesInfo(user.id);

		this.ok(res, result);
	}
}

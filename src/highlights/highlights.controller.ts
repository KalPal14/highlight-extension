import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '@/common/base.controller';
import { IHighlightsController } from './highlights.controller.interface';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import TYPES from '@/types.inversify';
import { HIGHLIGHTS_PATH } from '@/common/constants/routes/highlights';
import { ValidateMiddleware } from '@/common/middlewares/validate.middleware';
import { AuthGuard } from '@/common/middlewares/auth.guard';
import { HTTPError } from '@/errors/http-error.class';
import { IHighlightsService } from './highlights.service.interface';

@injectable()
export class HighlightsController extends BaseController implements IHighlightsController {
	constructor(@inject(TYPES.HighlightsService) private highlightsService: IHighlightsService) {
		super();
		this.bindRoutes([
			{
				path: HIGHLIGHTS_PATH.create,
				method: 'post',
				func: this.createHighlight,
				middlewares: [new AuthGuard(), new ValidateMiddleware(CreateHighlightDto)],
			},
		]);
	}

	async createHighlight(
		{ body, user }: Request<{}, {}, CreateHighlightDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.highlightsService.createHighlight(body, user);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.created(res, result);
	}
}

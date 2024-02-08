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
import { UpdateHighlightDto } from './dto/update-highlight.dto';

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
			{
				path: HIGHLIGHTS_PATH.update,
				method: 'patch',
				func: this.updateHighlight,
				middlewares: [new AuthGuard(), new ValidateMiddleware(UpdateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_PATH.delete,
				method: 'delete',
				func: this.deleteHighlight,
				middlewares: [new AuthGuard()],
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

	async updateHighlight(
		{ params, body }: Request<{ id: string }, {}, UpdateHighlightDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!Object.keys(body).length) {
			return next(new HTTPError(422, 'Highlight change data is empty'));
		}

		const result = await this.highlightsService.updateHighlight(Number(params.id), body);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.ok(res, result);
	}

	async deleteHighlight(
		{ params }: Request<{ id: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.highlightsService.deleteHighlight(Number(params.id));

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.ok(res, result);
	}
}

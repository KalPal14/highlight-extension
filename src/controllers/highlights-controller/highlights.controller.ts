import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../base-controller/base.controller';

import { IHighlightsController } from './highlights.controller.interface';

import { HIGHLIGHTS_PATH } from '@/common/constants/routes/highlights';
import TYPES from '@/common/constants/types.inversify';
import { CreateHighlightDto } from '@/dto/highlights/create-highlight.dto';
import { GetHighlightsDto } from '@/dto/highlights/get-highlights.dto';
import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';
import { HTTPError } from '@/exceptions/http-error.class';
import { RouteGuard } from '@/middlewares/route-guard/route.guard';
import { ValidateMiddleware } from '@/middlewares/validate.middleware';
import { IHighlightsService } from '@/services/highlights-service/highlights.service.interface';

@injectable()
export class HighlightsController extends BaseController implements IHighlightsController {
	constructor(@inject(TYPES.HighlightsService) private highlightsService: IHighlightsService) {
		super();
		this.bindRoutes([
			{
				path: HIGHLIGHTS_PATH.get,
				method: 'get',
				func: this.getHighlights,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(GetHighlightsDto, 'query')],
			},
			{
				path: HIGHLIGHTS_PATH.create,
				method: 'post',
				func: this.createHighlight,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(CreateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_PATH.update,
				method: 'patch',
				func: this.updateHighlight,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_PATH.delete,
				method: 'delete',
				func: this.deleteHighlight,
				middlewares: [new RouteGuard('user')],
			},
		]);
	}

	async getHighlights(
		{ query }: Request<{}, {}, {}, GetHighlightsDto>,
		res: Response,
	): Promise<void> {
		const result = await this.highlightsService.getHighlights(JSON.parse(query.ids));

		this.ok(res, result);
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

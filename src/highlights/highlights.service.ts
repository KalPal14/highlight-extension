import { inject, injectable } from 'inversify';
import { HighlightModel, PageModel } from '@prisma/client';

import { CreateHighlightDto } from './dto/create-highlight.dto';
import { IHighlightsService } from './highlights.service.interface';
import TYPES from '@/types.inversify';
import { IHighlightsRepository } from './highlights.repository.interface';
import { IPagesRepository } from '@/pages/pages.repository.interface';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { IPagesServise } from '@/pages/pages.service.interface';
import { Highlight } from './highlight.entity';

@injectable()
export class HighlightsService implements IHighlightsService {
	constructor(
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository,
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.PagesServise) private pagesServise: IPagesServise,
	) {}

	async createHighlight(
		createHighlightDto: CreateHighlightDto,
		user: IJwtPayload,
	): Promise<HighlightModel> {
		const { pageUrl, text, note, color } = createHighlightDto;
		let existingPage = await this.pagesRepository.findByUrl(pageUrl, user.id);
		if (!existingPage) {
			existingPage = (await this.pagesServise.createPage(createHighlightDto, user)) as PageModel;
		}

		const newHighlight = new Highlight(existingPage.id, text, color, note);
		return await this.highlightsRepository.create(newHighlight);
	}
}

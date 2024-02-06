import { inject, injectable } from 'inversify';
import { PageModel } from '@prisma/client';

import { CreateHighlightDto } from '@/highlights/dto/create-highlight.dto';
import TYPES from '@/types.inversify';
import { IPagesServise } from './pages.service.interface';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { Page } from './page.entity';
import { IPagesRepository } from './pages.repository.interface';

@injectable()
export class PagesServise implements IPagesServise {
	constructor(@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository) {}

	async createPage(
		{ pageUrl }: CreateHighlightDto,
		{ id }: IJwtPayload,
	): Promise<PageModel | Error> {
		const existingPage = await this.pagesRepository.findByUrl(pageUrl, id);
		if (existingPage) {
			return Error('This page already exists');
		}

		const newPage = new Page(id, pageUrl);
		return await this.pagesRepository.create(newPage);
	}
}

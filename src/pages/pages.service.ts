import { inject, injectable } from 'inversify';
import { PageModel } from '@prisma/client';

import { CreateHighlightDto } from '@/highlights/dto/create-highlight.dto';
import TYPES from '@/types.inversify';
import { IPagesServise, TPageInfo } from './pages.service.interface';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { Page } from './page.entity';
import { IPagesRepository } from './pages.repository.interface';

@injectable()
export class PagesServise implements IPagesServise {
	constructor(@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository) {}

	async createPage(pageUrl: string, { id }: IJwtPayload): Promise<PageModel | Error> {
		const existingPage = await this.pagesRepository.findByUrl(pageUrl, id);
		if (existingPage) {
			return Error('This page already exists');
		}

		const newPage = new Page(id, pageUrl).getData();
		return await this.pagesRepository.create(newPage);
	}

	async getPageInfo(url: string, userId: number): Promise<PageModel | null> {
		return await this.pagesRepository.findByUrl(url, userId, true);
	}

	async getPagesInfo(userId: number): Promise<TPageInfo[]> {
		const pages = await this.pagesRepository.findAll(userId, true);
		return pages.map(({ id, userId, url, highlights = [] }) => {
			const highlightsWithNote = highlights.filter(({ note }) => note);
			return {
				id,
				userId,
				url,
				highlightsCount: highlights.length,
				notesCount: highlightsWithNote.length,
			};
		});
	}
}

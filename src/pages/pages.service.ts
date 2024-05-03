import { inject, injectable } from 'inversify';
import { PageModel } from '@prisma/client';

import { IPagesServise } from './pages.service.interface';
import { Page } from './page.entity';
import { IPagesRepository } from './pages.repository.interface';
import { TPageAllInfo } from './page-all-info.type';
import { TPageShortInfo } from './page-short-info.type';

import TYPES from '@/types.inversify';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { IHighlightsRepository } from '@/highlights/highlights.repository.interface';

@injectable()
export class PagesServise implements IPagesServise {
	constructor(
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository,
	) {}

	async createPage(pageUrl: string, { id }: IJwtPayload): Promise<PageModel | Error> {
		const existingPage = await this.pagesRepository.findByUrl(pageUrl, id);
		if (existingPage) {
			return Error('This page already exists');
		}

		const newPage = new Page(id, pageUrl).getData();
		return await this.pagesRepository.create(newPage);
	}

	async getPageInfo(url: string, userId: number): Promise<TPageAllInfo | null> {
		const page = await this.pagesRepository.findByUrl(url, userId, false);

		if (!page) {
			return null;
		}

		return {
			...page,
			highlights: await this.highlightsRepository.findAllByPageUrl(page.id),
		};
	}

	async getPagesInfo(userId: number): Promise<TPageShortInfo[]> {
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

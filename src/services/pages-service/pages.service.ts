import { inject, injectable } from 'inversify';
import { PageModel } from '@prisma/client';

import { IPagesServise } from './pages.service.interface';
import { TPageAllInfo } from './types/page-all-info.type';
import { TPageShortInfo } from './types/page-short-info.type';

import TYPES from '@/common/constants/types.inversify';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { Page } from '@/entities/page-entity/page.entity';
import { IHighlightsRepository } from '@/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '@/repositories/pages-repository/pages.repository.interface';

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
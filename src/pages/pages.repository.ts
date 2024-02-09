import { inject, injectable } from 'inversify';

import { PageModel } from '@prisma/client';

import { IPagesRepository, TDeepPageModel } from './pages.repository.interface';
import { Page } from './page.entity';
import TYPES from '@/types.inversify';
import { IPrismaService } from '@/common/services/prisma.service.interface';

@injectable()
export class PagesRepository implements IPagesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create({ userId, url }: Page): Promise<PageModel> {
		return await this.prismaService.client.pageModel.create({
			data: {
				userId,
				url,
			},
		});
	}

	async findByUrl(
		url: string,
		userId: number,
		includeHighlights: boolean = false,
	): Promise<PageModel | null> {
		return await this.prismaService.client.pageModel.findFirst({
			where: {
				userId,
				url,
			},
			include: {
				highlights: includeHighlights,
			},
		});
	}

	async findAll(userId: number, includeHighlights: boolean = false): Promise<TDeepPageModel[]> {
		return await this.prismaService.client.pageModel.findMany({
			where: {
				userId,
			},
			include: {
				highlights: includeHighlights,
			},
		});
	}
}

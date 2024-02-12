import { inject, injectable } from 'inversify';

import { PageModel } from '@prisma/client';

import { IPagesRepository } from './pages.repository.interface';
import { Page } from './page.entity';
import TYPES from '@/types.inversify';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import { TPageDeepModel } from './page-deep-model.interface';

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
	): Promise<TPageDeepModel | null> {
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

	async findAll(userId: number, includeHighlights: boolean = false): Promise<TPageDeepModel[]> {
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

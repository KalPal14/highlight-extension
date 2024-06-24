import { inject, injectable } from 'inversify';
import { PageModel } from '@prisma/client';

import { IPagesRepository } from './pages.repository.interface';
import { TPageDeepModel } from './types/page-deep-model.type';

import TYPES from '@/common/constants/types.inversify';
import { IPage } from '@/entities/page-entity/page.entity.interface';
import { IPrismaService } from '@/utils/services/prisma-service/prisma.service.interface';

@injectable()
export class PagesRepository implements IPagesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create({ userId, url }: IPage): Promise<PageModel> {
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

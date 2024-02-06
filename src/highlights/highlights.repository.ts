import { inject, injectable } from 'inversify';

import { HighlightModel } from '@prisma/client';

import { Highlight } from './highlight.entity';
import { IHighlightsRepository } from './highlights.repository.interface';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import TYPES from '@/types.inversify';

@injectable()
export class HighlightsRepository implements IHighlightsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create({ pageId, text, note, color }: Highlight): Promise<HighlightModel> {
		return await this.prismaService.client.highlightModel.create({
			data: {
				pageId,
				text,
				note,
				color,
			},
		});
	}
}

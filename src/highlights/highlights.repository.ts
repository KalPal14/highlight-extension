import { inject, injectable } from 'inversify';

import { HighlightModel } from '@prisma/client';

import { IHighlightsRepository } from './highlights.repository.interface';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import TYPES from '@/types.inversify';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { IHighlight } from './highlight.entity.interface';

@injectable()
export class HighlightsRepository implements IHighlightsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create(highlight: IHighlight): Promise<HighlightModel> {
		return await this.prismaService.client.highlightModel.create({
			data: highlight,
		});
	}

	async update(
		id: number,
		payload: Omit<UpdateHighlightDto, 'startContainer' | 'endContainer'>,
	): Promise<HighlightModel> {
		return await this.prismaService.client.highlightModel.update({
			where: { id },
			data: payload,
		});
	}

	async findById(id: number): Promise<HighlightModel | null> {
		return await this.prismaService.client.highlightModel.findFirst({
			where: { id },
		});
	}

	async delete(id: number): Promise<HighlightModel> {
		return await this.prismaService.client.highlightModel.delete({
			where: { id },
		});
	}
}

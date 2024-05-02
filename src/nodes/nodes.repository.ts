import { inject, injectable } from 'inversify';

import { INode } from './node.entity.interface';
import { INodesRepository } from './nodes.repository.interface';

import { NodeModel } from '@prisma/client';
import TYPES from '@/types.inversify';
import { IPrismaService } from '@/common/services/prisma.service.interface';

@injectable()
export class NodesRepository implements INodesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create({ text, indexNumber, sameElementsAmount }: INode): Promise<NodeModel> {
		return await this.prismaService.client.nodeModel.create({
			data: {
				text,
				indexNumber,
				sameElementsAmount,
			},
		});
	}

	async update(id: number, payload: Partial<INode>): Promise<NodeModel> {
		return await this.prismaService.client.nodeModel.update({
			where: { id },
			data: {
				...payload,
			},
		});
	}

	async findById(id: number): Promise<NodeModel | null> {
		return await this.prismaService.client.nodeModel.findFirst({
			where: { id },
		});
	}

	async delete(id: number): Promise<NodeModel> {
		return await this.prismaService.client.nodeModel.delete({
			where: { id },
		});
	}
}

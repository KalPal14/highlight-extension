import { inject, injectable } from 'inversify';
import { NodeModel } from '@prisma/client';

import TYPES from '@/types.inversify';
import { INodesRepository } from './nodes.repository.interface';
import { INodesService } from './nodes.service.interface';
import { INode } from './node.entity.interface';

@injectable()
export class NodesService implements INodesService {
	constructor(@inject(TYPES.NodesRepository) private nodesRepository: INodesRepository) {}

	async getNode(id: number): Promise<NodeModel | null> {
		return await this.nodesRepository.findById(id);
	}

	async createNode(nodeData: INode): Promise<NodeModel> {
		return await this.nodesRepository.create(nodeData);
	}

	async updateNode(id: number, payload: Partial<INode>): Promise<NodeModel | Error> {
		const existingNode = await this.nodesRepository.findById(id);
		if (!existingNode) {
			return Error('There is no node with this ID');
		}

		return this.nodesRepository.update(existingNode.id, payload);
	}

	async deleteNode(id: number): Promise<NodeModel | Error> {
		const existingNode = await this.nodesRepository.findById(id);
		if (!existingNode) {
			return Error('There is no node with this ID');
		}

		return this.nodesRepository.delete(id);
	}
}

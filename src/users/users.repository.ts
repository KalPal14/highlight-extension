import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { User } from '@prisma/client';

import TYPES from '@/types.inversify';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async getAllUsers(): Promise<User[]> {
		return await this.prismaService.client.user.findMany();
	}
}

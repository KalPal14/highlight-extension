import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';

import TYPES from '@/types.inversify';
import { IPrismaService } from '@/common/services/prisma.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { User } from './user.entity';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async findByEmail(email: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}

	async findByUsername(username: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findFirst({
			where: {
				username,
			},
		});
	}

	async create({ email, username, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				username,
				password,
			},
		});
	}
}

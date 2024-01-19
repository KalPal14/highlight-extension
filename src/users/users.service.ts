import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { User } from '@prisma/client';

import { IUsersService } from './users.service.interface';
import TYPES from '@/types.inversify';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository) {}

	async test(): Promise<User[]> {
		return await this.usersRepository.getAllUsers();
	}
}

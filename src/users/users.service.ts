import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';

import { UsersRegisterDto } from './dto/users-register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import TYPES from '@/types.inversify';
import { IUsersRepository } from './users.repository.interface';
import { IConfigService } from '@/common/services/config.service.interface';
import { HTTPError } from '@/errors/http-error.class';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {}

	async createUser(user: UsersRegisterDto): Promise<UserModel | Error> {
		const newUser = new User(user.username, user.email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(user.password, Number(salt));

		let existingUser = await this.usersRepository.findByEmail(newUser.email);
		if (existingUser) {
			return new HTTPError(422, 'User with this email already exists');
		}
		existingUser = await this.usersRepository.findByUsername(newUser.username);
		if (existingUser) {
			return new HTTPError(422, 'User with this username already exists');
		}

		return await this.usersRepository.create(newUser);
	}
}

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
import { UsersLoginDto } from './dto/users-login.dto';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {}

	async createUser({ username, email, password }: UsersRegisterDto): Promise<UserModel | Error> {
		const newUser = new User(username, email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

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

	async validateUser({ userIdentifier, password }: UsersLoginDto): Promise<UserModel | Error> {
		let existingUser = null;

		if (userIdentifier.includes('@')) {
			existingUser = await this.usersRepository.findByEmail(userIdentifier);
			if (!existingUser) {
				return new HTTPError(422, 'There is no user with this email');
			}
		} else {
			existingUser = await this.usersRepository.findByUsername(userIdentifier);
			if (!existingUser) {
				return new HTTPError(422, 'There is no user with this username');
			}
		}

		const user = new User(existingUser.username, existingUser.email, existingUser.password);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			return new HTTPError(422, 'Incorrect password');
		}
		return existingUser;
	}
}

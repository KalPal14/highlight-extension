import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IJwtPayload } from '~libs/common';
import { HTTPError } from '~libs/express-core';
import { UpdateUserDto, UsersLoginDto, UsersRegisterDto } from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';

import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.UserFactory) private userFactory: IUserFactory
	) {}

	async get(id: number): Promise<UserModel> {
		const user = await this.usersRepository.findBy({ id });
		if (!user) {
			throw new HTTPError(422, `user #${id} not found`);
		}

		return user;
	}

	async create(registerDto: UsersRegisterDto): Promise<UserModel> {
		let existingUser = await this.usersRepository.findBy({ email: registerDto.email });
		if (existingUser) {
			throw new HTTPError(422, 'user with this email already exists');
		}
		existingUser = await this.usersRepository.findBy({ username: registerDto.username });
		if (existingUser) {
			throw new HTTPError(422, 'user with this username already exists');
		}

		const newUser = await this.userFactory.create(registerDto);
		return this.usersRepository.create(newUser);
	}

	async validate({ userIdentifier, password }: UsersLoginDto): Promise<UserModel> {
		let existingUser = null;
		if (userIdentifier.includes('@')) {
			existingUser = await this.usersRepository.findBy({ email: userIdentifier });
			if (!existingUser) {
				throw new HTTPError(422, 'There is no user with this email');
			}
		} else {
			existingUser = await this.usersRepository.findBy({ username: userIdentifier });
			if (!existingUser) {
				throw new HTTPError(422, 'There is no user with this username');
			}
		}

		const user = this.userFactory.createWithHashPassword(existingUser);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			throw new HTTPError(422, 'Incorrect password');
		}
		return existingUser;
	}

	async update(user: IJwtPayload, dto: UpdateUserDto): Promise<UserModel> {
		let updatedPassword: string | undefined;
		let passwordUpdatedAt: Date | undefined;
		if (dto.password) {
			await this.validate({ userIdentifier: user.email, password: dto.password.currentPassword });
			updatedPassword = await this.userFactory
				.create({ ...user, password: dto.password.newPassword })
				.then(({ password }) => password);
			passwordUpdatedAt = new Date();
		}

		try {
			return await this.usersRepository.update(user.id, {
				username: dto.username,
				email: dto.email,
				password: updatedPassword,
				passwordUpdatedAt,
			});
		} catch (err: any) {
			if (err.code === 'P2002') {
				throw new HTTPError(400, `User with this ${err.meta.target} already exists`);
			}
			throw new Error();
		}
	}
}

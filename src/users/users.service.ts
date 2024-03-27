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
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {}

	async getUserInfo(id: number): Promise<UserModel | null> {
		return await this.usersRepository.findById(id);
	}

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

		const user = new User(
			existingUser.username,
			existingUser.email,
			existingUser.colors,
			existingUser.password,
		);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			return new HTTPError(422, 'Incorrect password');
		}
		return existingUser;
	}

	async updateUser(id: number, payload: UpdateUserDto): Promise<UserModel> {
		return await this.usersRepository.update(id, payload);
	}

	async changePassword(
		{ id, email, username }: IJwtPayload,
		{ password, newPassword }: ChangePasswordDto,
	): Promise<UserModel | Error> {
		const validatedUser = await this.validateUser({ userIdentifier: email || username, password });
		if (validatedUser instanceof Error) {
			return Error(validatedUser.message);
		}
		if (password === newPassword) {
			return Error('The new password cannot be the same as the old one');
		}

		const user = new User(validatedUser.username, validatedUser.email, validatedUser.colors);
		const salt = this.configService.get('SALT');
		await user.setPassword(newPassword, Number(salt));
		return await this.usersRepository.update(id, {
			password: user.password,
		});
	}

	async changeEmail(
		{ id, email }: IJwtPayload,
		{ newEmail }: ChangeEmailDto,
	): Promise<UserModel | Error> {
		if (newEmail === email) {
			return Error('The new email cannot be the same as the old one');
		}
		const isNewEmailExisting = await this.usersRepository.findByEmail(newEmail);
		if (isNewEmailExisting) {
			return Error(
				`You cannot change your email to ${newEmail}. An account with this email already exists`,
			);
		}

		return await this.usersRepository.update(id, {
			email: newEmail,
		});
	}

	async changeUsername(
		{ id, username }: IJwtPayload,
		{ newUsername }: ChangeUsernameDto,
	): Promise<UserModel | Error> {
		if (newUsername === username) {
			return Error('The new username cannot be the same as the old one');
		}
		const isNewUsernameExisting = await this.usersRepository.findByUsername(newUsername);
		if (isNewUsernameExisting) {
			return Error(
				`You cannot change your username to ${newUsername}. An account with this username already exists`,
			);
		}

		return await this.usersRepository.update(id, {
			username: newUsername,
		});
	}
}

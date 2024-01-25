import 'reflect-metadata';
import { Container } from 'inversify';

import { UsersService } from './users.service';
import TYPES from '@/types.inversify';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IConfigService } from '@/common/services/config.service.interface';
import { USER_SPEC } from '@/common/constants/spec/users';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';
import { HTTPError } from '@/errors/http-error.class';

const usersRepositoryMock: IUsersRepository = {
	findByEmail: jest.fn(),
	findByUsername: jest.fn(),
	create: jest.fn(),
};

const configServiceMock: IConfigService = {
	get: jest.fn(),
};

const container = new Container();
let usersService: IUsersService;
let usersRepository: IUsersRepository;
let configService: IConfigService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(usersRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	configService = container.get<IConfigService>(TYPES.ConfigService);
});

describe('Users Service', () => {
	it('registration - success', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(null);
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(null);
		usersRepositoryMock.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				id: USER_SPEC.id,
				email: user.email,
				username: user.username,
				password: user.password,
			}),
		);

		const result = await usersService.createUser({
			email: USER_SPEC.email,
			username: USER_SPEC.username,
			password: USER_SPEC.password,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(1);
		expect(result.email).toBe(USER_SPEC.email);
		expect(result.username).toBe(USER_SPEC.username);
		expect(result.password).not.toBe(USER_SPEC.password);
	});

	it('registration - wrong: user with this email already exists', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockImplementation((user) => user);
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(null);
		usersRepositoryMock.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				id: USER_SPEC.id,
				email: user.email,
				username: user.username,
				password: user.password,
			}),
		);

		const result = await usersService.createUser({
			email: USER_SPEC.email,
			username: USER_SPEC.username,
			password: USER_SPEC.password,
		});

		expect(result).toBeInstanceOf(HTTPError);
	});

	it('registration - wrong: user with this username already exists', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(null);
		usersRepositoryMock.findByUsername = jest.fn().mockImplementation((user) => user);
		usersRepositoryMock.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				id: USER_SPEC.id,
				email: user.email,
				username: user.username,
				password: user.password,
			}),
		);

		const result = await usersService.createUser({
			email: USER_SPEC.email,
			username: USER_SPEC.username,
			password: USER_SPEC.password,
		});

		expect(result).toBeInstanceOf(HTTPError);
	});
});

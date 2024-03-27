import 'reflect-metadata';
import { Container } from 'inversify';
import bcryptjs from 'bcryptjs';

import { UsersService } from './users.service';
import TYPES from '@/types.inversify';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IConfigService } from '@/common/services/config.service.interface';
import {
	RIGHT_USER,
	WRONG_USER,
	UPDATED_USER,
	RIGHT_USER_JWT,
} from '@/common/constants/spec/users';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';
import { HTTPError } from '@/errors/http-error.class';

const usersRepositoryMock: IUsersRepository = {
	findByEmail: jest.fn(),
	findByUsername: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
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
				id: RIGHT_USER.id,
				email: user.email,
				username: user.username,
				password: user.password,
				colors: RIGHT_USER.colors,
			}),
		);

		const result = await usersService.createUser({
			email: RIGHT_USER.email,
			username: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(1);
		expect(result.email).toBe(RIGHT_USER.email);
		expect(result.username).toBe(RIGHT_USER.username);
		expect(result.password).not.toBe(RIGHT_USER.password);
	});

	it('registration - wrong: user with this email already exists', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockImplementation((user) => user);
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(null);
		usersRepositoryMock.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				id: RIGHT_USER.id,
				email: user.email,
				username: user.username,
				password: user.password,
				colors: RIGHT_USER.colors,
			}),
		);

		const result = await usersService.createUser({
			email: RIGHT_USER.email,
			username: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(result).toBeInstanceOf(HTTPError);
	});

	it('registration - wrong: user with this username already exists', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(null);
		usersRepositoryMock.findByUsername = jest.fn().mockImplementation((user) => user);
		usersRepositoryMock.create = jest.fn().mockImplementation(
			(user: User): UserModel => ({
				id: RIGHT_USER.id,
				email: user.email,
				username: user.username,
				password: user.password,
				colors: RIGHT_USER.colors,
			}),
		);

		const result = await usersService.createUser({
			email: RIGHT_USER.email,
			username: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(result).toBeInstanceOf(HTTPError);
	});

	it('validate user - success: by email', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue({
			...RIGHT_USER,
			password: RIGHT_USER.passwordHash,
		});

		const result = await usersService.validateUser({
			userIdentifier: RIGHT_USER.email,
			password: RIGHT_USER.password,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(RIGHT_USER.id);
		expect(result.username).toBe(RIGHT_USER.username);
		expect(result.password).toBeDefined();
		expect(result.password).not.toBe(RIGHT_USER.password);
	});

	it('validate user - success: by username', async () => {
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue({
			...RIGHT_USER,
			password: RIGHT_USER.passwordHash,
		});

		const result = await usersService.validateUser({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(RIGHT_USER.id);
		expect(result.email).toBe(RIGHT_USER.email);
		expect(result.password).toBeDefined();
		expect(result.password).not.toBe(RIGHT_USER.password);
	});

	it('validate user - wrong: invalid mail', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(null);

		const result = await usersService.validateUser({
			userIdentifier: WRONG_USER.email,
			password: RIGHT_USER.password,
		});

		expect(result).toBeInstanceOf(Error);
	});

	it('validate user - wrong: invalid username', async () => {
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(null);

		const result = await usersService.validateUser({
			userIdentifier: WRONG_USER.username,
			password: RIGHT_USER.password,
		});

		expect(result).toBeInstanceOf(Error);
	});

	it('validate user - wrong: invalid password', async () => {
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(RIGHT_USER);

		const result = await usersService.validateUser({
			userIdentifier: RIGHT_USER.email,
			password: WRONG_USER.password,
		});

		expect(result).toBeInstanceOf(Error);
	});

	it('change password - success', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(USER);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);
		const hashSpy = jest.spyOn(bcryptjs, 'hash');

		const result = await usersService.changePassword(RIGHT_USER_JWT, {
			password: RIGHT_USER.password,
			newPassword: UPDATED_USER.password,
		});
		const hashSpyResult = await hashSpy.mock.results[1].value;

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result).toEqual({
			...USER,
			password: hashSpyResult,
		});
	});

	it('change password - wrong: same password and old password', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(USER);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changePassword(RIGHT_USER_JWT, {
			password: RIGHT_USER.password,
			newPassword: RIGHT_USER.password,
		});

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBeDefined();
		}
	});

	it('change password - wrong: wrong old password', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(USER);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changePassword(RIGHT_USER_JWT, {
			password: WRONG_USER.password,
			newPassword: UPDATED_USER.password,
		});

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBeDefined();
		}
	});

	it('change email - success', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(null);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changeEmail(RIGHT_USER_JWT, {
			newEmail: UPDATED_USER.email,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.username).toBe(RIGHT_USER.username);
		expect(result.email).toBe(UPDATED_USER.email);
	});

	it('change email - wrong: same email and newEmail', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(null);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changeEmail(RIGHT_USER_JWT, {
			newEmail: RIGHT_USER.email,
		});

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBeDefined();
		}
	});

	it('change email - wrong: there is already another account with a new email', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByEmail = jest.fn().mockReturnValue(UPDATED_USER);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changeEmail(RIGHT_USER_JWT, {
			newEmail: UPDATED_USER.email,
		});

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBeDefined();
		}
	});

	it('change username - success', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(null);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changeUsername(RIGHT_USER_JWT, {
			newUsername: UPDATED_USER.username,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.username).toBe(UPDATED_USER.username);
		expect(result.email).toBe(RIGHT_USER.email);
	});

	it('change username - wrong: same username and newUsername', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(null);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changeUsername(RIGHT_USER_JWT, {
			newUsername: RIGHT_USER.username,
		});

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBeDefined();
		}
	});

	it('change username - wrong: there is already another account with a new username', async () => {
		const { passwordHash, ...USER } = { ...RIGHT_USER, password: RIGHT_USER.passwordHash };
		usersRepositoryMock.findByUsername = jest.fn().mockReturnValue(UPDATED_USER);
		usersRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<User>): UserModel => ({
				...USER,
				...payload,
			}),
		);

		const result = await usersService.changeUsername(RIGHT_USER_JWT, {
			newUsername: UPDATED_USER.username,
		});

		expect(result).toBeInstanceOf(Error);
		if (result instanceof Error) {
			expect(result.message).toBeDefined();
		}
	});
});

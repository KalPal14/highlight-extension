import 'reflect-metadata';
import { Container } from 'inversify';

import { UsersService } from './users.service';
import TYPES from '@/types.inversify';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { USERS_SPEC } from '@/constants/spec/users';

const usersRepositoryMock: IUsersRepository = {
	getAllUsers: jest.fn(),
};

const container = new Container();
let usersService: IUsersService;
let usersRepository: IUsersRepository;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(usersRepositoryMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

describe('UsersService', () => {
	it('test', async () => {
		usersRepository.getAllUsers = jest.fn().mockReturnValue([
			{
				id: USERS_SPEC.id,
				email: USERS_SPEC.email,
				name: USERS_SPEC.name,
			},
		]);

		const result = await usersService.test();

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(USERS_SPEC.id);
		expect(result[0].email).toBe(USERS_SPEC.email);
		expect(result[0].name).toBe(USERS_SPEC.name);
	});
});

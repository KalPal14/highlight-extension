import { User } from '@prisma/client';

export interface IUsersService {
	test: () => Promise<User[]>;
}

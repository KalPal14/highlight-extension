import { User } from '@prisma/client';

export interface IUsersRepository {
	getAllUsers: () => Promise<User[]>;
}

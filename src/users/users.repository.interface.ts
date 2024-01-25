import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface IUsersRepository {
	findByEmail: (email: string) => Promise<UserModel | null>;
	findByUsername: (username: string) => Promise<UserModel | null>;

	create: (user: User) => Promise<UserModel>;
}

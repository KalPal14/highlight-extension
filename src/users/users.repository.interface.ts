import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUsersRepository {
	findByEmail: (email: string) => Promise<UserModel | null>;
	findByUsername: (username: string) => Promise<UserModel | null>;

	create: (user: User) => Promise<UserModel>;
	update: (id: number, payload: UpdateUserDto) => Promise<UserModel>;
}

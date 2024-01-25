import { UserModel } from '@prisma/client';

import { UsersRegisterDto } from './dto/users-register.dto';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
}

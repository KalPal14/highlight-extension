import { UserModel } from '@prisma/client';

import { UsersRegisterDto } from './dto/users-register.dto';
import { UsersLoginDto } from './dto/users-login.dto';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
	validateUser: (user: UsersLoginDto) => Promise<UserModel | Error>;
}

import { UserModel } from '@prisma/client';

import { UsersRegisterDto } from './dto/users-register.dto';
import { UsersLoginDto } from './dto/users-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
	validateUser: (user: UsersLoginDto) => Promise<UserModel | Error>;
	updateUser: (id: number, payload: UpdateUserDto) => Promise<UserModel>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel | Error>;
}

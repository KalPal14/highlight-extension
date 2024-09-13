import { IJwtPayload } from '~libs/common';
import { UpdateUserDto, UsersLoginDto, UsersRegisterDto } from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	get: (id: number) => Promise<UserModel>;
	create: (registerDto: UsersRegisterDto) => Promise<UserModel>;
	validate: (loginDto: UsersLoginDto) => Promise<UserModel>;
	update: (user: IJwtPayload, updateDto: UpdateUserDto) => Promise<UserModel>;
}

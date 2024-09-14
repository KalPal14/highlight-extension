import { IJwtPayload } from '~libs/common';
import { UpdateUserDto, LoginDto, RegistrationDto } from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	get: (id: number) => Promise<UserModel>;
	create: (registerDto: RegistrationDto) => Promise<UserModel>;
	validate: (loginDto: LoginDto) => Promise<UserModel>;
	update: (user: IJwtPayload, updateDto: UpdateUserDto) => Promise<UserModel>;
}

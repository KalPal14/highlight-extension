import { Router } from 'express';

import { TController } from '@/common/types/controller.type';
import { UsersLoginDto } from './dto/users-login.dto';
import { UsersRegisterDto } from './dto/users-register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';

export interface IUsersController {
	router: Router;

	login: TController<{}, {}, UsersLoginDto>;
	register: TController<{}, {}, UsersRegisterDto>;
	logout: TController;

	getUserInfo: TController;

	updateUser: TController<{}, {}, UpdateUserDto>;
	changePassword: TController<{}, {}, ChangePasswordDto>;
	changeEmail: TController<{}, {}, ChangeEmailDto>;
	changeUsername: TController<{}, {}, ChangeUsernameDto>;
}

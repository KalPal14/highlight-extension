import { Router } from 'express';

import { TController } from '../common/types/controller.type';

import { ChangeEmailDto } from '@/dto/users/change-email.dto';
import { ChangePasswordDto } from '@/dto/users/change-password.dto';
import { ChangeUsernameDto } from '@/dto/users/change-username.dto';
import { UpdateUserDto } from '@/dto/users/update-user.dto';
import { UsersLoginDto } from '@/dto/users/users-login.dto';
import { UsersRegisterDto } from '@/dto/users/users-register.dto';

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

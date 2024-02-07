import { Router } from 'express';

import { TController } from '@/common/types/controller.type';
import { UsersLoginDto } from './dto/users-login.dto';
import { UsersRegisterDto } from './dto/users-register.dto';

export interface IUsersController {
	router: Router;

	login: TController<{}, {}, UsersLoginDto>;
	register: TController<{}, {}, UsersRegisterDto>;
	logout: TController;
}

import { Router } from 'express';

import { TController } from '~libs/express-core';
import { UpdateUserDto, UsersLoginDto, UsersRegisterDto } from '~libs/dto/iam';

export interface IUsersController {
	router: Router;

	getUserInfo: TController;

	login: TController<null, UsersLoginDto>;
	register: TController<null, UsersRegisterDto>;
	logout: TController;

	update: TController<null, UpdateUserDto>;
}

export const USERS_ROUTER_PATH = '/users';

export const USERS_PATH = {
	login: '/login',
	register: '/register',
	logout: '/logout',
	updateUser: '/update-user',
	changePassword: '/change-password',
	changeEmail: '/change-email',
	changeUsername: '/change-username',
	getUserInfo: '/get-info',
};

export const USERS_FULL_PATH = {
	login: USERS_ROUTER_PATH + USERS_PATH.login,
	register: USERS_ROUTER_PATH + USERS_PATH.register,
	logout: USERS_ROUTER_PATH + USERS_PATH.logout,
	updateUser: USERS_ROUTER_PATH + USERS_PATH.updateUser,
	changePassword: USERS_ROUTER_PATH + USERS_PATH.changePassword,
	changeEmail: USERS_ROUTER_PATH + USERS_PATH.changeEmail,
	changeUsername: USERS_ROUTER_PATH + USERS_PATH.changeUsername,
	getUserInfo: USERS_ROUTER_PATH + USERS_PATH.getUserInfo,
};

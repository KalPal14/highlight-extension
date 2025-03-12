export const USERS_BASE_ROUTE = `/users`;

export const USERS_ENDPOINTS = {
	login: `/login`,
	register: `/register`,
	logout: `/logout`,
	update: `/update`,
	getUserInfo: `/get-info`,
};

export const USERS_URLS: Record<keyof typeof USERS_ENDPOINTS, any> = {
	login: `${USERS_BASE_ROUTE}/login`,
	register: `${USERS_BASE_ROUTE}/register`,
	logout: `${USERS_BASE_ROUTE}/logout`,
	update: `${USERS_BASE_ROUTE}/update`,
	getUserInfo: `${USERS_BASE_ROUTE}/get-info`,
};

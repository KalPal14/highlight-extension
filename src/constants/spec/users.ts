export interface IUSERS_SPEC {
	id: number;
	email: string;
	name: string;

	wrongId: number;
	wrongEmail: string;
	wrongName: string;
}

export const USERS_SPEC: IUSERS_SPEC = {
	id: 1,
	email: 'alex@gmai.com',
	name: 'Alex',

	wrongId: 500,
	wrongEmail: 'wrong@gmail.com',
	wrongName: 'Wrong',
};

import { UserModel } from '@prisma/client';

export const USER_SPEC = {
	id: 1,
	email: 'alex@test.com',
	username: 'alex_test',
	password: '123123',
	passwordHash: '$2a$13$kk2.WnMMchuXJEETn1dak.fQDgjLMu.3mO44dGv50C5qx1/oP.9wa',

	wrongId: 500,
	wrongEmail: 'wrong@test.com',
	wrongUsername: 'wrong_name',
	wrongPassword: 'wrong_password',
	wrongPasswordHash: '$2a$13$kk2.WnMMchuXJEETn1dak.fQDgjLMu.3mO44dGv50C5qx1/oP.9w4',

	invalidUsername: 'test test',
};

export const RIGHT_USER_MODEL: UserModel = {
	id: USER_SPEC.id,
	email: USER_SPEC.email,
	username: USER_SPEC.username,
	password: USER_SPEC.passwordHash,
};

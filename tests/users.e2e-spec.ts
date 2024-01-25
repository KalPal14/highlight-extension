import 'reflect-metadata';
import request from 'supertest';

import { app } from '@/main';
import App from '@/app';
import { USER_SPEC } from '@/common/constants/spec/users';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';

let application: App;

beforeAll(async () => {
	application = await app;
});

describe('Users', () => {
	it('Registration - wrong: user already exists', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: USER_SPEC.email,
			username: USER_SPEC.username,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Registration - wrong: invalid request body', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: USER_SPEC.email,
			username: USER_SPEC.invalidFormatUsername,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(422);
	});
});

afterAll(() => {
	application.close();
});

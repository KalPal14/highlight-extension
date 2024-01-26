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
			username: USER_SPEC.invalidUsername,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - success: by email', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.email,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});

	it('Login - success: by username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.username,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});

	it('Login - wrong: invalid email', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.wrongEmail,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: invalid username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.wrongUsername,
			password: USER_SPEC.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: invalid password', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.username,
			password: USER_SPEC.wrongPassword,
		});

		expect(res.statusCode).toBe(422);
	});
});

afterAll(() => {
	application.close();
});

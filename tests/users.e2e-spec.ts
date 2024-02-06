import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '@/main';
import App from '@/app';
import { USER_SPEC } from '@/common/constants/spec/users';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';

let application: App;

beforeAll(async () => {
	application = await bootstrap(8052);
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
		const cookies = res.headers['set-cookie'][0];

		expect(res.statusCode).toBe(200);
		expect(cookies).toContain('token=');
	});

	it('Login - success: by username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.username,
			password: USER_SPEC.password,
		});
		const cookies = res.headers['set-cookie'][0];

		expect(res.statusCode).toBe(200);
		expect(cookies).toContain('token=');
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

	it('Logout - success', async () => {
		const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.username,
			password: USER_SPEC.password,
		});
		const cookies = loginRes.headers['set-cookie'][0];

		const res = await request(application.app).post(USERS_FULL_PATH.logout).set('Cookie', cookies);

		expect(res.statusCode).toBe(200);
	});

	it('Logout - wrong: user is not authorized', async () => {
		await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: USER_SPEC.username,
			password: USER_SPEC.password,
		});

		const res = await request(application.app).post(USERS_FULL_PATH.logout);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});

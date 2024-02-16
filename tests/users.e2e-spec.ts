import 'reflect-metadata';
import request from 'supertest';
import bcryptjs from 'bcryptjs';

import { bootstrap } from '@/main';
import App from '@/app';
import {
	RIGHT_USER,
	WRONG_USER,
	INVALID_USER,
	GET_NEW_USER,
	GET_UPDATED_USER,
	UPDATED_USER,
} from '@/common/constants/spec/users';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';

let application: App;

beforeAll(async () => {
	application = await bootstrap(8052);
});

describe('Users', () => {
	it('Registration - wrong: user already exists', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: RIGHT_USER.email,
			username: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Registration - wrong: invalid request body', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: RIGHT_USER.email,
			username: INVALID_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - success: by email', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.email,
			password: RIGHT_USER.password,
		});
		const cookies = res.headers['set-cookie'][0];

		expect(res.statusCode).toBe(200);
		expect(cookies).toContain('token=');
	});

	it('Login - success: by username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});
		const cookies = res.headers['set-cookie'][0];

		expect(res.statusCode).toBe(200);
		expect(cookies).toContain('token=');
	});

	it('Login - wrong: invalid email', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: WRONG_USER.email,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: invalid username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: WRONG_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: invalid password', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: WRONG_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: user is already logged in', async () => {
		const resFirstLogin = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});
		const cookies = resFirstLogin.headers['set-cookie'][0];
		const res = await request(application.app)
			.post(USERS_FULL_PATH.login)
			.set('Cookie', cookies)
			.send({
				userIdentifier: RIGHT_USER.username,
				password: RIGHT_USER.password,
			});

		expect(res.statusCode).toBe(401);
	});

	it('Logout - success', async () => {
		const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});
		const cookies = loginRes.headers['set-cookie'][0];

		const res = await request(application.app).post(USERS_FULL_PATH.logout).set('Cookie', cookies);

		expect(res.statusCode).toBe(200);
	});

	it('Logout - wrong: user is not authorized', async () => {
		await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		const res = await request(application.app).post(USERS_FULL_PATH.logout);

		expect(res.statusCode).toBe(401);
	});

	it('Update user - success', async () => {
		const NEW_USER = GET_NEW_USER();
		const UPDATED_USER = GET_UPDATED_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});
		const cookies = regRes.headers['set-cookie'][0];

		const res = await request(application.app)
			.patch(USERS_FULL_PATH.updateUser)
			.set('Cookie', cookies)
			.send({
				colors: UPDATED_USER.colors,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: regRes.body.id,
			password: regRes.body.password,
			email: NEW_USER.email,
			username: NEW_USER.username,
			colors: UPDATED_USER.colors,
		});
	});

	it('Update user - wrong: user is not authorized', async () => {
		const UPDATED_USER = GET_UPDATED_USER();

		const res = await request(application.app).patch(USERS_FULL_PATH.updateUser).send({
			colors: UPDATED_USER.colors,
		});

		expect(res.statusCode).toBe(401);
		expect(res.body.err).toBeDefined();
	});

	it('Update user - wrong: incorrect data format', async () => {
		const NEW_USER = GET_NEW_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});
		const cookies = regRes.headers['set-cookie'][0];

		const res = await request(application.app)
			.patch(USERS_FULL_PATH.updateUser)
			.set('Cookie', cookies)
			.send({
				colors: INVALID_USER.colors,
			});

		expect(res.statusCode).toBe(422);
		expect(res.body[0].property).toBeDefined();
	});

	it('Change password - success', async () => {
		const hashSpy = jest.spyOn(bcryptjs, 'hash');
		const NEW_USER = GET_NEW_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});
		const cookies = regRes.headers['set-cookie'][0];

		const res = await request(application.app)
			.patch(USERS_FULL_PATH.changePassword)
			.set('Cookie', cookies)
			.send({
				password: NEW_USER.password,
				newPassword: UPDATED_USER.password,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.msg).toBeDefined();
	});
});

afterAll(() => {
	application.close();
});

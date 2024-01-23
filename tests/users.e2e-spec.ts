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
	it('users test', async () => {
		const res = await request(application.app).get(USERS_FULL_PATH.test);

		expect(res.statusCode).toBe(200);
		expect(res.body.users).toHaveLength(2);
		expect(res.body.users[0].id).toBe(USER_SPEC.id);
		expect(res.body.users[0].email).toBe(USER_SPEC.email);
	});
});

afterAll(() => {
	application.close();
});

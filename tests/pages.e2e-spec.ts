import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '@/main';
import App from '@/app';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';
import { RIGHT_USER } from '@/common/constants/spec/users';
import { PAGES_FULL_PATH } from '@/common/constants/routes/pages';
import { RIGHT_PAGE, WRONG_PAGE } from '@/common/constants/spec/pages';

let application: App;
let cookies: string;

beforeAll(async () => {
	application = await bootstrap(8053);

	const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
		userIdentifier: RIGHT_USER.username,
		password: RIGHT_USER.password,
	});
	cookies = loginRes.headers['set-cookie'][0];
});

describe('Pages', () => {
	it('get page info - success', async () => {
		const res = await request(application.app)
			.get(PAGES_FULL_PATH.getPage)
			.send({
				url: RIGHT_PAGE.url,
			})
			.set('Cookie', cookies);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(RIGHT_PAGE.id);
		expect(res.body.userId).toBe(RIGHT_PAGE.userId);
		expect(res.body.highlights.length).toBeDefined();
	});

	it('get page info - wrong: trying to get a non-existent page', async () => {
		const res = await request(application.app)
			.get(PAGES_FULL_PATH.getPage)
			.send({
				url: WRONG_PAGE.url,
			})
			.set('Cookie', cookies);

		expect(res.statusCode).toBe(404);
		expect(res.body.err).toBeDefined();
	});

	it('get page info - wrong: not authorizede', async () => {
		const res = await request(application.app).get(PAGES_FULL_PATH.getPage).send({
			url: RIGHT_PAGE.url,
		});

		expect(res.statusCode).toBe(401);
		expect(res.body.err).toBeDefined();
	});
});

afterAll(() => {
	application.close();
});
import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '@/main';
import App from '@/app';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';
import { RIGHT_USER } from '@/common/constants/spec/users';
import { PAGES_FULL_PATH } from '@/common/constants/routes/pages';
import { RIGHT_PAGE, WRONG_PAGE } from '@/common/constants/spec/pages';

let application: App;
let jwt: string;

beforeAll(async () => {
	application = await bootstrap(8053);

	const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
		userIdentifier: RIGHT_USER.username,
		password: RIGHT_USER.password,
	});
	jwt = loginRes.body.jwt;
});

describe('Pages', () => {
	it('get page info - success', async () => {
		const res = await request(application.app)
			.get(PAGES_FULL_PATH.getPage)
			.query({
				url: RIGHT_PAGE.url,
			})
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(RIGHT_PAGE.id);
		expect(res.body.userId).toBe(RIGHT_PAGE.userId);
		expect(res.body.highlights.length).not.toBe(0);
		expect(res.body.highlights[0].startContainer.id).toBeDefined();
		expect(res.body.highlights[0].endContainer.id).toBeDefined();
	});

	it('get page info - wrong: trying to get a non-existent page', async () => {
		const res = await request(application.app)
			.get(PAGES_FULL_PATH.getPage)
			.query({
				url: WRONG_PAGE.url,
			})
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: null,
		});
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

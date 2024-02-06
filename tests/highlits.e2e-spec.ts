import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '@/main';
import App from '@/app';
import { HIGHLIGHTS_FULL_PATH } from '@/common/constants/routes/highlights';
import { PAGE_SPEC } from '@/common/constants/spec/pages';
import { HIGHLIGHT_SPEC } from '@/common/constants/spec/highlights';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';
import { USER_SPEC } from '@/common/constants/spec/users';

let application: App;
let cookies: string;

beforeAll(async () => {
	application = await bootstrap(8051);

	const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
		userIdentifier: USER_SPEC.username,
		password: USER_SPEC.password,
	});
	cookies = loginRes.headers['set-cookie'][0];
});

describe('Highlits', () => {
	it('create highlight - wrong: unauthorized user', async () => {
		const res = await request(application.app).post(HIGHLIGHTS_FULL_PATH.create).send({
			pageUrl: PAGE_SPEC.url,
			text: HIGHLIGHT_SPEC.text,
			color: HIGHLIGHT_SPEC.color,
		});

		expect(res.statusCode).toBe(401);
	});

	it('create highlight - wrong: incorrect input data format', async () => {
		const res = await request(application.app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Cookie', cookies)
			.send({
				pageUrl: PAGE_SPEC.invalidUrl,
				text: HIGHLIGHT_SPEC.text,
				color: HIGHLIGHT_SPEC.color,
			});

		expect(res.statusCode).toBe(422);
	});

	it('create highlight - success: for an existing page', async () => {
		const res = await request(application.app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Cookie', cookies)
			.send({
				pageUrl: PAGE_SPEC.url,
				text: HIGHLIGHT_SPEC.text,
				color: HIGHLIGHT_SPEC.color,
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.text).toBe(HIGHLIGHT_SPEC.text);
		expect(res.body.pageId).toBe(HIGHLIGHT_SPEC.pageId);
	});
});

afterAll(() => {
	application.close();
});

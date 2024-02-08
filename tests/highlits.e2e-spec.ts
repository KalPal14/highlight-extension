import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '@/main';
import App from '@/app';
import { HIGHLIGHTS_FULL_PATH } from '@/common/constants/routes/highlights';
import { RIGHT_PAGE, INVALID_PAGE } from '@/common/constants/spec/pages';
import {
	RIGHT_HIGHLIGHT,
	UPDATED_HIGHLIGHT,
	WRONG_HIGHLIGHT,
} from '@/common/constants/spec/highlights';
import { USERS_FULL_PATH } from '@/common/constants/routes/users';
import { RIGHT_USER } from '@/common/constants/spec/users';

let application: App;
let cookies: string;

beforeAll(async () => {
	application = await bootstrap(8051);

	const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
		userIdentifier: RIGHT_USER.username,
		password: RIGHT_USER.password,
	});
	cookies = loginRes.headers['set-cookie'][0];
});

describe('Highlits', () => {
	it('create highlight - wrong: unauthorized user', async () => {
		const res = await request(application.app).post(HIGHLIGHTS_FULL_PATH.create).send({
			pageUrl: RIGHT_PAGE.url,
			text: RIGHT_HIGHLIGHT.text,
			color: RIGHT_HIGHLIGHT.color,
		});

		expect(res.statusCode).toBe(401);
	});

	it('create highlight - wrong: incorrect input data format', async () => {
		const res = await request(application.app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Cookie', cookies)
			.send({
				pageUrl: INVALID_PAGE.url,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(422);
	});

	it('create highlight - success: for an existing page', async () => {
		const res = await request(application.app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Cookie', cookies)
			.send({
				pageUrl: RIGHT_PAGE.url,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.text).toBe(RIGHT_HIGHLIGHT.text);
		expect(res.body.pageId).toBe(RIGHT_HIGHLIGHT.pageId);
	});

	it('update highlight - success', async () => {
		const res = await request(application.app)
			.patch(HIGHLIGHTS_FULL_PATH.update.replace(':id', UPDATED_HIGHLIGHT.id.toString()))
			.set('Cookie', cookies)
			.send({
				note: UPDATED_HIGHLIGHT.note as string | undefined,
				text: UPDATED_HIGHLIGHT.text,
				color: UPDATED_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(UPDATED_HIGHLIGHT);
	});

	it('update highlight - wrong: update a non-existent highlight', async () => {
		const res = await request(application.app)
			.patch(HIGHLIGHTS_FULL_PATH.update.replace(':id', WRONG_HIGHLIGHT.id!.toString()))
			.set('Cookie', cookies)
			.send({
				note: UPDATED_HIGHLIGHT.note as string | undefined,
				text: UPDATED_HIGHLIGHT.text,
				color: UPDATED_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.err).toBe('There is no highlight with this ID');
	});

	it('delete highlight - success', async () => {
		const createHighlightRes = await request(application.app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Cookie', cookies)
			.send({
				pageUrl: RIGHT_PAGE.url,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});
		const highlightId = createHighlightRes.body.id;
		console.log(highlightId);
		const res = await request(application.app)
			.delete(HIGHLIGHTS_FULL_PATH.delete.replace(':id', highlightId.toString()))
			.set('Cookie', cookies);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(createHighlightRes.body);
	});

	it('delete highlight - wrong: non-existent highlight', async () => {
		const res = await request(application.app)
			.delete(HIGHLIGHTS_FULL_PATH.delete.replace(':id', WRONG_HIGHLIGHT.id!.toString()))
			.set('Cookie', cookies);

		expect(res.statusCode).toBe(422);
		expect(res.body.err).toBe('There is no highlight with this ID');
	});
});

afterAll(() => {
	application.close();
});

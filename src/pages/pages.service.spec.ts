import 'reflect-metadata';
import { Container } from 'inversify';

import { IPagesRepository } from './pages.repository.interface';
import { IPagesServise } from './pages.service.interface';
import TYPES from '@/types.inversify';
import { PagesServise } from './pages.service';
import { Page } from './page.entity';
import { PageModel } from '@prisma/client';
import { PAGE_SPEC, RIGHT_PAGE_MODEL } from '@/common/constants/spec/pages';
import { HIGHLIGHT_SPEC } from '@/common/constants/spec/highlights';
import { USER_SPEC } from '@/common/constants/spec/users';

const pagesRepositoryMock: IPagesRepository = {
	create: jest.fn(),
	findByUrl: jest.fn(),
};

const container = new Container();
let pagesRepository: IPagesRepository;
let pagesServise: IPagesServise;

beforeAll(() => {
	container.bind<IPagesRepository>(TYPES.PagesRepository).toConstantValue(pagesRepositoryMock);
	container.bind<IPagesServise>(TYPES.PagesServise).to(PagesServise);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
});

describe('Pages Servise', () => {
	it('create page - success', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		pagesRepository.create = jest.fn().mockImplementation(
			(page: Page): PageModel => ({
				id: PAGE_SPEC.id,
				userId: page.userId,
				url: page.url,
			}),
		);

		const result = await pagesServise.createPage(
			{
				pageUrl: PAGE_SPEC.url,
				text: HIGHLIGHT_SPEC.text,
				color: HIGHLIGHT_SPEC.color,
			},
			{
				id: USER_SPEC.id,
				email: USER_SPEC.email,
				username: USER_SPEC.username,
			},
		);

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(PAGE_SPEC.id);
		expect(result.userId).toBe(PAGE_SPEC.userId);
		expect(result.url).toBe(PAGE_SPEC.url);
	});

	it('create page - wrong: this user already has a page with the same url', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE_MODEL);
		pagesRepository.create = jest.fn().mockImplementation(
			(page: Page): PageModel => ({
				id: PAGE_SPEC.id,
				userId: page.userId,
				url: page.url,
			}),
		);

		const result = await pagesServise.createPage(
			{
				pageUrl: PAGE_SPEC.url,
				text: HIGHLIGHT_SPEC.text,
				color: HIGHLIGHT_SPEC.color,
			},
			{
				id: USER_SPEC.id,
				email: USER_SPEC.email,
				username: USER_SPEC.username,
			},
		);

		expect(result).toBeInstanceOf(Error);
	});
});

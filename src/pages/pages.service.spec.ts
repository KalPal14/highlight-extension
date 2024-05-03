import 'reflect-metadata';
import { Container } from 'inversify';

import { IPagesRepository } from './pages.repository.interface';
import { IPagesServise } from './pages.service.interface';
import { PagesServise } from './pages.service';
import { IPage } from './page.entity.interface';

import TYPES from '@/types.inversify';
import { PageModel } from '@prisma/client';
import { RIGHT_PAGE, WRONG_PAGE } from '@/common/constants/spec/pages';
import { RIGHT_HIGHLIGHT } from '@/common/constants/spec/highlights';
import { RIGHT_USER, RIGHT_USER_JWT } from '@/common/constants/spec/users';
import { IHighlightsRepository } from '@/highlights/highlights.repository.interface';
import { RIGHT_END_NODE, RIGHT_START_NODE } from '@/common/constants/spec/nodes';

const pagesRepositoryMock: IPagesRepository = {
	create: jest.fn(),
	findByUrl: jest.fn(),
	findAll: jest.fn(),
};
const highlightsRepositoryMock: IHighlightsRepository = {
	create: jest.fn(),
	update: jest.fn(),
	findById: jest.fn(),
	findAllByPageUrl: jest.fn(),
	delete: jest.fn(),
};

const container = new Container();
let pagesRepository: IPagesRepository;
let highlightsRepository: IHighlightsRepository;
let pagesServise: IPagesServise;

beforeAll(() => {
	container.bind<IPagesRepository>(TYPES.PagesRepository).toConstantValue(pagesRepositoryMock);
	container
		.bind<IHighlightsRepository>(TYPES.HighlightsRepository)
		.toConstantValue(highlightsRepositoryMock);
	container.bind<IPagesServise>(TYPES.PagesServise).to(PagesServise);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	highlightsRepository = container.get<IHighlightsRepository>(TYPES.HighlightsRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
});

describe('Pages Servise', () => {
	it('create page - success', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		pagesRepository.create = jest.fn().mockImplementation(
			(page: IPage): PageModel => ({
				id: RIGHT_PAGE.id,
				userId: page.userId,
				url: page.url,
			}),
		);

		const result = await pagesServise.createPage(RIGHT_PAGE.url, RIGHT_USER_JWT);

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(RIGHT_PAGE.id);
		expect(result.userId).toBe(RIGHT_PAGE.userId);
		expect(result.url).toBe(RIGHT_PAGE.url);
	});

	it('create page - wrong: this user already has a page with the same url', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesRepository.create = jest.fn().mockImplementation(
			(page: IPage): PageModel => ({
				id: RIGHT_PAGE.id,
				userId: page.userId,
				url: page.url,
			}),
		);

		const result = await pagesServise.createPage(RIGHT_PAGE.url, RIGHT_USER_JWT);

		expect(result).toBeInstanceOf(Error);
	});

	it('get page info - success', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		highlightsRepository.findAllByPageUrl = jest.fn().mockReturnValue([
			{
				...RIGHT_HIGHLIGHT,
				startContainer: RIGHT_START_NODE,
				endContainer: RIGHT_END_NODE,
			},
		]);

		const result = await pagesServise.getPageInfo(RIGHT_PAGE.url, RIGHT_PAGE.userId);

		expect(result).toEqual({
			...RIGHT_PAGE,
			highlights: [
				{
					...RIGHT_HIGHLIGHT,
					startContainer: RIGHT_START_NODE,
					endContainer: RIGHT_END_NODE,
				},
			],
		});
	});

	it('get page info - success: user does not have a page with this URL', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		highlightsRepository.findAllByPageUrl = jest.fn().mockReturnValue(null);

		const result = await pagesServise.getPageInfo(WRONG_PAGE.url!, WRONG_PAGE.userId!);

		expect(result).toBe(null);
	});

	it('get pages info - success: user without highlights', async () => {
		pagesRepository.findAll = jest.fn().mockReturnValue([]);

		const result = await pagesServise.getPagesInfo(RIGHT_USER.id);

		expect(result).toHaveLength(0);
	});

	it('get pages info - success: user with highlights', async () => {
		pagesRepository.findAll = jest.fn().mockReturnValue([
			{
				...RIGHT_PAGE,
				highlights: [
					RIGHT_HIGHLIGHT,
					{
						...RIGHT_HIGHLIGHT,
						note: null,
					},
				],
			},
			{
				...RIGHT_PAGE,
				highlights: [RIGHT_HIGHLIGHT],
			},
		]);

		const result = await pagesServise.getPagesInfo(RIGHT_USER.id);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			id: RIGHT_PAGE.id,
			userId: RIGHT_PAGE.userId,
			url: RIGHT_PAGE.url,
			highlightsCount: 2,
			notesCount: 1,
		});
		expect(result[1]).toEqual({
			id: RIGHT_PAGE.id,
			userId: RIGHT_PAGE.userId,
			url: RIGHT_PAGE.url,
			highlightsCount: 1,
			notesCount: 1,
		});
	});
});

import 'reflect-metadata';
import { Container } from 'inversify';

import { IPagesRepository } from '@/pages/pages.repository.interface';
import { IHighlightsRepository } from './highlights.repository.interface';
import { IPagesServise } from '@/pages/pages.service.interface';
import { IHighlightsService } from './highlights.service.interface';
import TYPES from '@/types.inversify';
import { HighlightsService } from './highlights.service';
import { PAGE_SPEC, RIGHT_PAGE_MODEL } from '@/common/constants/spec/pages';
import { Highlight } from './highlight.entity';
import { HighlightModel } from '@prisma/client';
import { HIGHLIGHT_SPEC, RIGHT_HIGHLIGHT_MODEL } from '@/common/constants/spec/highlights';
import { USER_SPEC } from '@/common/constants/spec/users';

const highlightsRepositoryMock: IHighlightsRepository = {
	create: jest.fn(),
};
const pagesRepositoryMock: IPagesRepository = {
	create: jest.fn(),
	findByUrl: jest.fn(),
};
const pagesServiseMock: IPagesServise = {
	createPage: jest.fn(),
};

const container = new Container();
let pagesRepository: IPagesRepository;
let pagesServise: IPagesServise;
let highlightsRepository: IHighlightsRepository;
let highlightsService: IHighlightsService;

beforeAll(() => {
	container.bind<IPagesRepository>(TYPES.PagesRepository).toConstantValue(pagesRepositoryMock);
	container.bind<IPagesServise>(TYPES.PagesServise).toConstantValue(pagesServiseMock);
	container
		.bind<IHighlightsRepository>(TYPES.HighlightsRepository)
		.toConstantValue(highlightsRepositoryMock);
	container.bind<IHighlightsService>(TYPES.HighlightsService).to(HighlightsService);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
	highlightsRepository = container.get<IHighlightsRepository>(TYPES.HighlightsRepository);
	highlightsService = container.get<IHighlightsService>(TYPES.HighlightsService);
});

describe('Highlights Service', () => {
	it('create highlight - success: highlight without note for new page', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		pagesServise.createPage = jest.fn().mockReturnValue(RIGHT_PAGE_MODEL);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): HighlightModel => ({
				id: HIGHLIGHT_SPEC.id,
				pageId: highlight.pageId,
				text: highlight.text,
				color: highlight.color,
				note: highlight.note,
			}),
		);

		const result = await highlightsService.createHighlight(
			{
				pageUrl: PAGE_SPEC.url,
				text: HIGHLIGHT_SPEC.text,
				color: HIGHLIGHT_SPEC.color,
			},
			{
				id: USER_SPEC.id,
				username: USER_SPEC.username,
				email: USER_SPEC.email,
			},
		);

		expect(result).toEqual({
			...RIGHT_HIGHLIGHT_MODEL,
			note: null,
		});
	});
	it('create highlight - success: highlight with note for an existing page', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE_MODEL);
		pagesServise.createPage = jest.fn().mockReturnValue(Error);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): HighlightModel => ({
				id: HIGHLIGHT_SPEC.id,
				pageId: highlight.pageId,
				text: highlight.text,
				color: highlight.color,
				note: highlight.note,
			}),
		);

		const result = await highlightsService.createHighlight(
			{
				pageUrl: PAGE_SPEC.url,
				text: HIGHLIGHT_SPEC.text,
				color: HIGHLIGHT_SPEC.color,
				note: HIGHLIGHT_SPEC.note,
			},
			{
				id: USER_SPEC.id,
				username: USER_SPEC.username,
				email: USER_SPEC.email,
			},
		);

		expect(result).toEqual(RIGHT_HIGHLIGHT_MODEL);
	});
});

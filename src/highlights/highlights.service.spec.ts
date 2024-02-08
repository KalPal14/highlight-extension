import 'reflect-metadata';
import { Container } from 'inversify';

import { IPagesRepository } from '@/pages/pages.repository.interface';
import { IHighlightsRepository } from './highlights.repository.interface';
import { IPagesServise } from '@/pages/pages.service.interface';
import { IHighlightsService } from './highlights.service.interface';
import TYPES from '@/types.inversify';
import { HighlightsService } from './highlights.service';
import { RIGHT_PAGE } from '@/common/constants/spec/pages';
import { Highlight } from './highlight.entity';
import { HighlightModel } from '@prisma/client';
import {
	RIGHT_HIGHLIGHT,
	UPDATED_HIGHLIGHT,
	WRONG_HIGHLIGHT,
} from '@/common/constants/spec/highlights';
import { RIGHT_USER_JWT } from '@/common/constants/spec/users';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

const highlightsRepositoryMock: IHighlightsRepository = {
	create: jest.fn(),
	update: jest.fn(),
	findById: jest.fn(),
	delete: jest.fn(),
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
		pagesServise.createPage = jest.fn().mockReturnValue(RIGHT_PAGE);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): HighlightModel => ({
				id: RIGHT_HIGHLIGHT.id,
				pageId: highlight.pageId,
				text: highlight.text,
				color: highlight.color,
				note: highlight.note,
			}),
		);

		const result = await highlightsService.createHighlight(
			{
				pageUrl: RIGHT_PAGE.url,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			},
			RIGHT_USER_JWT,
		);

		expect(result).toEqual({
			...RIGHT_HIGHLIGHT,
			note: null,
		});
	});
	it('create highlight - success: highlight with note for an existing page', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesServise.createPage = jest.fn().mockReturnValue(Error);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): HighlightModel => ({
				id: RIGHT_HIGHLIGHT.id,
				pageId: highlight.pageId,
				text: highlight.text,
				color: highlight.color,
				note: highlight.note,
			}),
		);

		const result = await highlightsService.createHighlight(
			{
				pageUrl: RIGHT_PAGE.url,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
				note: RIGHT_HIGHLIGHT.note as string,
			},
			RIGHT_USER_JWT,
		);

		expect(result).toEqual(RIGHT_HIGHLIGHT);
	});

	it('update highlight - success', async () => {
		highlightsRepository.findById = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);
		highlightsRepository.update = jest.fn().mockImplementation(
			(id: number, payload: UpdateHighlightDto): HighlightModel => ({
				...RIGHT_HIGHLIGHT,
				...payload,
			}),
		);

		const result = await highlightsService.updateHighlight(RIGHT_HIGHLIGHT.id, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			text: UPDATED_HIGHLIGHT.text,
			color: UPDATED_HIGHLIGHT.color,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result).toEqual(UPDATED_HIGHLIGHT);
	});

	it('update highlight - wrong: no highlight with this ID', async () => {
		highlightsRepository.findById = jest.fn().mockReturnValue(null);
		highlightsRepository.update = jest.fn().mockImplementation(
			(id: number, payload: UpdateHighlightDto): HighlightModel => ({
				...RIGHT_HIGHLIGHT,
				...payload,
			}),
		);

		const result = await highlightsService.updateHighlight(WRONG_HIGHLIGHT.id!, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			text: UPDATED_HIGHLIGHT.text,
			color: UPDATED_HIGHLIGHT.color,
		});

		expect(result).toBeInstanceOf(Error);
	});
	it('delete highlight - success', async () => {
		highlightsRepository.findById = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);
		highlightsRepository.delete = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);

		const result = await highlightsService.deleteHighlight(RIGHT_HIGHLIGHT.id);

		expect(result).toEqual(RIGHT_HIGHLIGHT);
	});
	it('delete highlight - wrong:  no highlight with this ID', async () => {
		highlightsRepository.findById = jest.fn().mockReturnValue(null);
		highlightsRepository.delete = jest.fn();

		const result = await highlightsService.deleteHighlight(RIGHT_HIGHLIGHT.id);

		expect(result).toBeInstanceOf(Error);
	});
});

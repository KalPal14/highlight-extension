import 'reflect-metadata';
import { Container } from 'inversify';

import { IPagesRepository } from '@/pages/pages.repository.interface';
import { IHighlightsRepository } from './highlights.repository.interface';
import { IPagesServise } from '@/pages/pages.service.interface';
import { IHighlightsService } from './highlights.service.interface';
import TYPES from '@/types.inversify';
import { HighlightsService } from './highlights.service';
import { RIGHT_PAGE } from '@/common/constants/spec/pages';
import type { Highlight } from './highlight.entity';
import { HighlightModel } from '@prisma/client';
import {
	RIGHT_HIGHLIGHT,
	UPDATED_HIGHLIGHT,
	WRONG_HIGHLIGHT,
} from '@/common/constants/spec/highlights';
import { RIGHT_USER_JWT } from '@/common/constants/spec/users';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { RIGHT_END_NODE, RIGHT_START_NODE, UPDATED_END_NODE } from '@/common/constants/spec/nodes';
import { INodesService } from '@/nodes/nodes.service.interface';

const highlightsRepositoryMock: IHighlightsRepository = {
	create: jest.fn(),
	update: jest.fn(),
	findById: jest.fn(),
	delete: jest.fn(),
};
const pagesRepositoryMock: IPagesRepository = {
	create: jest.fn(),
	findByUrl: jest.fn(),
	findAll: jest.fn(),
};
const pagesServiseMock: IPagesServise = {
	createPage: jest.fn(),
	getPageInfo: jest.fn(),
	getPagesInfo: jest.fn(),
};
const nodesServiseMock: INodesService = {
	createNode: jest.fn(),
	updateNode: jest.fn(),
	deleteNode: jest.fn(),
	getNode: jest.fn(),
};

const container = new Container();
let pagesRepository: IPagesRepository;
let pagesServise: IPagesServise;
let highlightsRepository: IHighlightsRepository;
let highlightsService: IHighlightsService;
let nodesServise: INodesService;

beforeAll(() => {
	container.bind<IPagesRepository>(TYPES.PagesRepository).toConstantValue(pagesRepositoryMock);
	container.bind<IPagesServise>(TYPES.PagesServise).toConstantValue(pagesServiseMock);
	container
		.bind<IHighlightsRepository>(TYPES.HighlightsRepository)
		.toConstantValue(highlightsRepositoryMock);
	container.bind<INodesService>(TYPES.NodesService).toConstantValue(nodesServiseMock);
	container.bind<IHighlightsService>(TYPES.HighlightsService).to(HighlightsService);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
	highlightsRepository = container.get<IHighlightsRepository>(TYPES.HighlightsRepository);
	nodesServise = container.get<INodesService>(TYPES.NodesService);
	highlightsService = container.get<IHighlightsService>(TYPES.HighlightsService);
});

describe('Highlights Service', () => {
	it('create highlight - success: highlight without note for new page', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		pagesServise.createPage = jest.fn().mockReturnValue(RIGHT_PAGE);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): HighlightModel => ({
				id: RIGHT_HIGHLIGHT.id,
				pageId: highlight.pageId,
				startContainerId: highlight.startContainerId,
				endContainerId: highlight.endContainerId,
				startOffset: highlight.startOffset,
				endOffset: highlight.endOffset,
				text: highlight.text,
				color: highlight.color,
				note: highlight.note,
			}),
		);
		nodesServise.createNode = jest
			.fn()
			.mockReturnValueOnce(RIGHT_START_NODE)
			.mockReturnValueOnce(RIGHT_END_NODE);
		const createNodeSpy = jest.spyOn(nodesServise, 'createNode');

		const result = await highlightsService.createHighlight(
			{
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			},
			RIGHT_USER_JWT,
		);

		expect(createNodeSpy).toHaveBeenCalledTimes(2);
		expect(result).toEqual({
			...RIGHT_HIGHLIGHT,
			note: null,
		});
	});
	it('create highlight - success: highlight with note for an existing page', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesServise.createPage = jest.fn().mockReturnValue(Error);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): HighlightModel => ({
				id: RIGHT_HIGHLIGHT.id,
				pageId: highlight.pageId,
				startContainerId: highlight.startContainerId,
				endContainerId: highlight.endContainerId,
				startOffset: highlight.startOffset,
				endOffset: highlight.endOffset,
				text: highlight.text,
				color: highlight.color,
				note: highlight.note,
			}),
		);
		nodesServise.createNode = jest
			.fn()
			.mockReturnValueOnce(RIGHT_START_NODE)
			.mockReturnValueOnce(RIGHT_END_NODE);
		const createNodeSpy = jest.spyOn(nodesServise, 'createNode');

		const result = await highlightsService.createHighlight(
			{
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
				note: RIGHT_HIGHLIGHT.note as string,
			},
			RIGHT_USER_JWT,
		);

		expect(createNodeSpy).toHaveBeenCalledTimes(2);
		expect(result).toEqual(RIGHT_HIGHLIGHT);
	});

	it('update highlight - success', async () => {
		const { id: _endid, ...UPDATED_END_NODE_DATA } = UPDATED_END_NODE;
		nodesServise.updateNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);
		highlightsRepository.update = jest.fn().mockImplementation(
			(id: number, payload: UpdateHighlightDto): HighlightModel => ({
				...RIGHT_HIGHLIGHT,
				...payload,
			}),
		);
		const updateNodeSpy = jest.spyOn(nodesServise, 'updateNode');

		const result = await highlightsService.updateHighlight(RIGHT_HIGHLIGHT.id, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			text: UPDATED_HIGHLIGHT.text,
			color: UPDATED_HIGHLIGHT.color,
			endOffset: UPDATED_HIGHLIGHT.endOffset,
			endContainer: UPDATED_END_NODE_DATA,
		});

		expect(result).not.toBeInstanceOf(Error);
		expect(updateNodeSpy).toHaveBeenCalledWith(
			RIGHT_HIGHLIGHT.endContainerId,
			UPDATED_END_NODE_DATA,
		);
		if (result instanceof Error) return;
		expect(result).toEqual(UPDATED_HIGHLIGHT);
	});

	it('update highlight - wrong: no highlight with this ID', async () => {
		nodesServise.updateNode = jest.fn();
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
		nodesServise.deleteNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);
		highlightsRepository.delete = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);
		const deleteNodeSpy = jest.spyOn(nodesServise, 'deleteNode');

		const result = await highlightsService.deleteHighlight(RIGHT_HIGHLIGHT.id);

		expect(result).toEqual(RIGHT_HIGHLIGHT);
		expect(deleteNodeSpy).toHaveBeenCalledTimes(2);
	});
	it('delete highlight - wrong:  no highlight with this ID', async () => {
		nodesServise.deleteNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue(null);
		highlightsRepository.delete = jest.fn();

		const result = await highlightsService.deleteHighlight(RIGHT_HIGHLIGHT.id);

		expect(result).toBeInstanceOf(Error);
	});
});

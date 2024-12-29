import { UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';

import {
	IBaseHighlightRo,
	ICreateHighlightRo,
	IDeleteHighlightRo,
	IUpdateHighlightRo,
} from '~libs/ro/highlight-extension';
import { HIGHLIGHTS_URLS } from '~libs/routes/highlight-extension';
import {
	CreateHighlightDto,
	IndividualUpdateHighlightsDto,
	UpdateHighlightDto,
} from '~libs/dto/highlight-extension';
import { dispatchApiRequest, getPageUrl } from '~libs/client-core';

import { IChangeHighlightForm } from '~/highlight-extension-fe/pages/active-tab-highlights/ui/types/change-highlight-form.interface';
import {
	ICrossBrowserStateDescriptor,
	useCrossBrowserState,
} from '~/highlight-extension-fe/shared/model';
import { api } from '~/highlight-extension-fe/shared/api';

import { usePages } from '../../page';

import { THighlightField } from './types/highlight-field.type';
import { THighlightStatus } from './types/highlight-status.type';

interface IHighligtsHookReturn {
	data: {
		createdHighlight: ICrossBrowserStateDescriptor['createdHighlight'];
		deletedHighlight: ICrossBrowserStateDescriptor['deletedHighlight'];
		updatedHighlight: ICrossBrowserStateDescriptor['updatedHighlight'];
		scrollHighlightId: `web-highlight-${number}` | null;
		unfoundHighlightsIds: Record<string, number[] | undefined>;
	};
	actions: {
		getPageHighlights(url: string | null): Promise<IBaseHighlightRo[]>;
		createHighlight(dto: CreateHighlightDto): Promise<ICreateHighlightRo>;
		deleteHighlight: (id: number, pageUrl: string) => Promise<IDeleteHighlightRo>;
		updateHighlight(
			id: number,
			dto: UpdateHighlightDto,
			pageUrl?: string
		): Promise<IUpdateHighlightRo>;
		updateHighlightsOrder: (highlights: IBaseHighlightRo[]) => Promise<void>;
		setScrollHighlight(highlightId: number): Promise<void>;
		appendHighlightField: (
			pageUrl: string,
			append: UseFieldArrayAppend<IChangeHighlightForm, 'highlights'>
		) => void;
		removeHighlightField: (
			pageUrl: string,
			fields: THighlightField[],
			remove: UseFieldArrayRemove
		) => void;
		updeteHighlightField: (
			pageUrl: string,
			fields: THighlightField[],
			update: UseFieldArrayUpdate<IChangeHighlightForm, 'highlights'>
		) => void;
	};
	selectors: {
		selectHighlightsByStatus: (
			status: THighlightStatus,
			pageUrl: string,
			highlights: IBaseHighlightRo[]
		) => IBaseHighlightRo[];
	};
}

export function useHighlights(): IHighligtsHookReturn {
	const [createdHighlight, setCreatedHighlight] = useCrossBrowserState('createdHighlight');
	const [deletedHighlight, setDeletedHighlight] = useCrossBrowserState('deletedHighlight');
	const [updatedHighlight, setUpdatedHighlight] = useCrossBrowserState('updatedHighlight');
	const [scrollHighlightId, setScrollHighlightId] = useCrossBrowserState('scrollHighlightId');
	const [unfoundHighlightsIds] = useCrossBrowserState('unfoundHighlightsIds');

	const { getPage } = usePages().actions;

	async function getPageHighlights(url: string | null): Promise<IBaseHighlightRo[]> {
		if (!url) return [];

		const resp = await getPage(url);
		if (resp.id === null) return [];

		return resp.highlights;
	}

	async function createHighlight(dto: CreateHighlightDto): Promise<ICreateHighlightRo> {
		const highlight = await dispatchApiRequest.post<CreateHighlightDto, ICreateHighlightRo>(
			HIGHLIGHTS_URLS.create,
			dto
		);
		setCreatedHighlight({ highlight, pageUrl: getPageUrl() });
		return highlight;
	}

	async function deleteHighlight(id: number, pageUrl: string): Promise<IDeleteHighlightRo> {
		const highlight = await dispatchApiRequest.delete<null, IDeleteHighlightRo>(
			HIGHLIGHTS_URLS.delete(id)
		);
		setDeletedHighlight({ highlight, pageUrl });
		return highlight;
	}

	async function updateHighlight(
		id: number,
		dto: UpdateHighlightDto,
		pageUrl?: string
	): Promise<IUpdateHighlightRo> {
		const highlight = await dispatchApiRequest.patch<UpdateHighlightDto, IUpdateHighlightRo>(
			HIGHLIGHTS_URLS.delete(id),
			dto
		);
		setUpdatedHighlight({ highlight, pageUrl: getPageUrl(pageUrl) });
		return highlight;
	}

	async function updateHighlightsOrder(highlights: IBaseHighlightRo[]): Promise<void> {
		const updatedHighlightOrders = highlights
			.map(({ id, order }, index) => {
				if (order !== index + 1) {
					return { id, payload: { order: index + 1 } };
				}
				return null;
			})
			.filter((highlight) => highlight !== null);

		if (!updatedHighlightOrders.length) return;

		await api.patch<IndividualUpdateHighlightsDto, IUpdateHighlightRo[]>(
			HIGHLIGHTS_URLS.individualUpdateMany,
			{
				highlights: updatedHighlightOrders,
			}
		);
	}

	async function setScrollHighlight(id: number): Promise<void> {
		setScrollHighlightId(`web-highlight-${id}`);
	}

	function appendHighlightField(
		pageUrl: string,
		append: UseFieldArrayAppend<IChangeHighlightForm, 'highlights'>
	): void {
		if (!createdHighlight || pageUrl !== createdHighlight.pageUrl) return;
		append({ highlight: createdHighlight.highlight });
	}

	function removeHighlightField(
		pageUrl: string,
		fields: THighlightField[],
		remove: UseFieldArrayRemove
	): void {
		if (!deletedHighlight || pageUrl !== deletedHighlight.pageUrl) return;
		const index = findFieldIndex(deletedHighlight.highlight.id, fields);
		if (index === -1 || fields[index].highlight.id !== deletedHighlight.highlight.id) return;

		remove(index);
	}

	function updeteHighlightField(
		pageUrl: string,
		fields: THighlightField[],
		update: UseFieldArrayUpdate<IChangeHighlightForm, 'highlights'>
	): void {
		if (!updatedHighlight || pageUrl !== updatedHighlight.pageUrl) return;
		const index = findFieldIndex(updatedHighlight.highlight.id, fields);
		update(index, { highlight: updatedHighlight.highlight });
	}

	function findFieldIndex(id: number, fields: THighlightField[]): number {
		return fields.findIndex((field) => field.highlight.id === id);
	}

	function selectHighlightsByStatus(
		status: THighlightStatus,
		pageUrl: string,
		highlights: IBaseHighlightRo[]
	): IBaseHighlightRo[] {
		const activeTabUnfoundHighlightsIds = unfoundHighlightsIds[pageUrl] ?? [];
		switch (status) {
			case 'found':
				return highlights.filter(({ id }) => !activeTabUnfoundHighlightsIds.includes(id));
			case 'unfound':
				return highlights.filter(({ id }) => activeTabUnfoundHighlightsIds.includes(id));
			default:
				return highlights;
		}
	}

	return {
		data: {
			createdHighlight,
			deletedHighlight,
			updatedHighlight,
			scrollHighlightId,
			unfoundHighlightsIds,
		},

		actions: {
			getPageHighlights,
			createHighlight,
			deleteHighlight,
			updateHighlight,
			updateHighlightsOrder,
			setScrollHighlight,
			appendHighlightField,
			removeHighlightField,
			updeteHighlightField,
		},
		selectors: { selectHighlightsByStatus },
	};
}

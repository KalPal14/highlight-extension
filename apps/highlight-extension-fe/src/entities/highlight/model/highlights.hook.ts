import {
	IBaseHighlightRo,
	ICreateHighlightRo,
	IDeleteHighlightRo,
	IUpdateHighlightRo,
} from '~libs/ro/highlight-extension';
import { HIGHLIGHTS_URLS } from '~libs/routes/highlight-extension';
import { CreateHighlightDto, UpdateHighlightDto } from '~libs/dto/highlight-extension';
import { dispatchApiRequest, getPageUrl } from '~libs/client-core';

import {
	ICrossBrowserStateDescriptor,
	useCrossBrowserState,
} from '~/highlight-extension-fe/shared/model';

import { usePages } from '../../page';

interface IHighligtsHookReturn {
	data: {
		createdHighlight: ICrossBrowserStateDescriptor['createdHighlight'];
		deletedHighlight: ICrossBrowserStateDescriptor['deletedHighlight'];
		updatedHighlight: ICrossBrowserStateDescriptor['updatedHighlight'];
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
	};
}

export function useHighlights(): IHighligtsHookReturn {
	const [createdHighlight, setCreatedHighlight] = useCrossBrowserState('createdHighlight');
	const [deletedHighlight, setDeletedHighlight] = useCrossBrowserState('deletedHighlight');
	const [updatedHighlight, setUpdatedHighlight] = useCrossBrowserState('updatedHighlight');

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

	async function deleteHighlight(id: number, pageUrl?: string): Promise<IDeleteHighlightRo> {
		const highlight = await dispatchApiRequest.delete<null, IDeleteHighlightRo>(
			HIGHLIGHTS_URLS.delete(id)
		);
		setDeletedHighlight({ highlight, pageUrl: getPageUrl(pageUrl) });
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

	return {
		data: {
			createdHighlight,
			deletedHighlight,
			updatedHighlight,
		},

		actions: {
			getPageHighlights,
			createHighlight,
			deleteHighlight,
			updateHighlight,
		},
	};
}

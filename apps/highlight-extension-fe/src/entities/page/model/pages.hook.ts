import { GetPageDto, GetPagesDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { IBasePageRo, IUpdatePageRo, TGetPageRo, TGetPagesRo } from '~libs/ro/highlight-extension';
import { PAGES_URLS } from '~libs/routes/highlight-extension';
import { Exception } from '~libs/common';
import { dispatchApiRequest, getPageUrl } from '~libs/client-core';

import { api } from '~/highlight-extension-fe/shared/api';
import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';

import { useWorkspaces } from '../../workspace';

interface IPagesHookReturn {
	data: {
		updatedPages: { urls: string[]; updateTrigger?: boolean };
	};
	actions: {
		getPages(): Promise<TGetPagesRo>;
		getPage(url: string): Promise<TGetPageRo>;
		updatePage(
			pageToUpdate: IBasePageRo,
			updatePageDto: UpdatePageDto,
			merge: boolean | (() => void)
		): Promise<IUpdatePageRo | undefined>;
	};
}

export function usePages(): IPagesHookReturn {
	const { currentWorkspace } = useWorkspaces().data;

	const [updatedPages, setUpdatedPages] = useCrossBrowserState('updatedPages');

	async function getPages(): Promise<TGetPagesRo> {
		if (!currentWorkspace)
			throw new Exception('Workspace is not selected or the user is not authorized');

		const pages = await api.get<GetPagesDto, TGetPagesRo>(PAGES_URLS.getPagesShortInfo, {
			workspaceId: currentWorkspace.id.toString(),
		});
		return pages.filter(({ highlightsCount }) => highlightsCount);
	}

	async function getPage(url: string): Promise<TGetPageRo> {
		if (!currentWorkspace)
			throw new Exception('Workspace is not selected or the user is not authorized');

		return dispatchApiRequest.get<GetPageDto, TGetPageRo>(PAGES_URLS.get, {
			workspaceId: currentWorkspace.id.toString(),
			url: getPageUrl(url),
		});
	}

	async function updatePage(
		pageToUpdate: IBasePageRo,
		updatePageDto: UpdatePageDto,
		merge: boolean | (() => void)
	): Promise<IUpdatePageRo | undefined> {
		if (updatePageDto.url) {
			const existingPage = await getPage(updatePageDto.url);
			if (existingPage.id && existingPage.highlights.length) {
				if (typeof merge === 'function') {
					merge();
					return;
				}
				if (!merge)
					throw new Exception(`Can't update the url because there is another page with that url`);
			}
		}

		const resp = await api.patch<UpdatePageDto, IUpdatePageRo>(
			PAGES_URLS.update(pageToUpdate.id),
			updatePageDto
		);

		if (updatePageDto.url) {
			setUpdatedPages((prev) => ({
				urls: [pageToUpdate.url, updatePageDto.url!],
				updateTrigger: !prev.updateTrigger,
			}));
		}
		return resp;
	}

	return { data: { updatedPages }, actions: { getPages, getPage, updatePage } };
}

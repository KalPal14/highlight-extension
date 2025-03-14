import { GetPageDto } from '~libs/dto/highlight-extension';
import { TGetPageRo } from '~libs/ro/highlight-extension';
import { PAGES_URLS } from '~libs/routes/highlight-extension';
import { Exception } from '~libs/common';
import { dispatchApiRequest, getPageUrl } from '~libs/client-core';

import { useWorkspaces } from '../../workspace';

interface IPagesHookReturn {
	actions: {
		getPage(url: string): Promise<TGetPageRo>;
	};
}

export function usePages(): IPagesHookReturn {
	const { currentWorkspace } = useWorkspaces().data;

	async function getPage(url: string): Promise<TGetPageRo> {
		if (!currentWorkspace)
			throw new Exception('Workspace is not selected or the user is not authorized');

		return dispatchApiRequest.get<GetPageDto, TGetPageRo>(PAGES_URLS.get, {
			workspaceId: currentWorkspace.id.toString(),
			url: getPageUrl(url),
		});
	}

	return { actions: { getPage } };
}

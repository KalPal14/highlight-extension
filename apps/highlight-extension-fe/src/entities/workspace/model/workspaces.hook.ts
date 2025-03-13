import {
	IBaseWorkspaceRo,
	ICreateWorkspaceRo,
	TGetOwnersWorkspacesRo,
} from '~libs/ro/highlight-extension';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';

import { useCrossBrowserState } from '~/highlight-extension-fe/shared/model';
import { api } from '~/highlight-extension-fe/shared/api';

interface IWorkspacesHookReturn {
	data: {
		currentWorkspace: IBaseWorkspaceRo | null;
	};
	actions: {
		getWorkspaces(jwt?: string): Promise<TGetOwnersWorkspacesRo>;
		createWorkspace(dto: CreateWorkspaceDto, jwt?: string): Promise<ICreateWorkspaceRo>;
	};
}

export function useWorkspaces(): IWorkspacesHookReturn {
	const [currentWorkspace, setCurrentWorkspace] = useCrossBrowserState('currentWorkspace');

	function getWorkspaces(jwt?: string): Promise<TGetOwnersWorkspacesRo> {
		return api.get<null, TGetOwnersWorkspacesRo>(WORKSPACES_URLS.getAllOwners, null, { jwt });
	}

	async function createWorkspace(
		dto: CreateWorkspaceDto,
		jwt?: string
	): Promise<ICreateWorkspaceRo> {
		const workspace = await api.post<CreateWorkspaceDto, ICreateWorkspaceRo>(
			WORKSPACES_URLS.create,
			dto,
			{ jwt }
		);
		setCurrentWorkspace(workspace);
		return workspace;
	}

	return {
		data: { currentWorkspace },
		actions: { getWorkspaces, createWorkspace },
	};
}

import { useRef, useState } from 'react';

import { browserAdapter, getPageUrl } from '~libs/client-core';
import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';

import { useWorkspaces } from '../../workspace';

interface ITabHookReturn {
	data: { canUseContentScriptInTab: boolean };
	actions: {
		updateActiveTabInfo: (onActiveTabChanged: () => Promise<void>) => Promise<void>;
		updateActiveTabInfoOnWindowChange: (
			windowId: number,
			onActiveTabChanged: () => Promise<void>
		) => Promise<void>;
	};
	selectors: { getActiveTabUrl: () => string };
}

export function useTabs(): ITabHookReturn {
	const { currentWorkspace } = useWorkspaces().data;

	const activeTabUrl = useRef('');
	const activeWindowId = useRef(browserAdapter.windows.WINDOW_ID_NONE);
	const activeWorkspace = useRef<IBaseWorkspaceRo | null>(null);

	const [canUseContentScriptInTab, setCanUseContentScriptInTab] = useState(false);

	async function updateActiveTabInfo(onActiveTabChanged: () => Promise<void>): Promise<void> {
		const [currentTab] = await browserAdapter.tabs.query({
			active: true,
			currentWindow: true,
		});

		if (!currentTab.url) return;
		const currentTabUrl = getPageUrl(currentTab.url);
		if (currentTabUrl === activeTabUrl.current && activeWorkspace.current === currentWorkspace)
			return;

		if (!currentTabUrl.startsWith('https://') && !currentTabUrl.startsWith('http://')) {
			setCanUseContentScriptInTab(false);
			activeWorkspace.current = currentWorkspace;
			activeTabUrl.current = currentTabUrl;
			return;
		}
		setCanUseContentScriptInTab(true);

		activeWorkspace.current = currentWorkspace;
		activeTabUrl.current = currentTabUrl;
		await onActiveTabChanged();
	}

	async function updateActiveTabInfoOnWindowChange(
		windowId: number,
		onActiveTabChanged: () => Promise<void>
	): Promise<void> {
		if (activeWindowId.current === windowId || windowId === browserAdapter.windows.WINDOW_ID_NONE)
			return;
		activeWindowId.current = windowId;
		activeTabUrl.current = '';
		await updateActiveTabInfo(onActiveTabChanged);
	}

	function getActiveTabUrl(): string {
		return activeTabUrl.current;
	}

	return {
		data: { canUseContentScriptInTab },
		actions: { updateActiveTabInfo, updateActiveTabInfoOnWindowChange },
		selectors: { getActiveTabUrl },
	};
}

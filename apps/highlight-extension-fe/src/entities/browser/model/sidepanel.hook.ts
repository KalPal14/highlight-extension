import { browserAdapter } from '~libs/client-core';

export interface ISidePanelHookReturn {
	actions: { openSidePanel(): Promise<void> };
}

export function useSidePanel(): ISidePanelHookReturn {
	async function openSidePanel(): Promise<void> {
		if (browserAdapter.browserName === 'firefox') {
			browserAdapter.sidePanel.open();
			return;
		}

		const window = await browserAdapter.windows.getCurrent();
		if (!window.id) return;
		browserAdapter.sidePanel.open({ windowId: window.id });
	}

	return { actions: { openSidePanel } };
}

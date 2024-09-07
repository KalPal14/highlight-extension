export interface ITabsQueryInfo {
	active?: boolean;
	currentWindow?: boolean;
	lastFocusedWindow?: boolean;
	status?: 'loading' | 'complete';
	title?: string;
	url?: string | string[];
	windowId?: number;
	openerTabId?: number;
}

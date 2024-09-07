import { IMessageSender } from './types/message-sender.interface';
import { IOnActivatedActiveTabInfo } from './types/om-activated-active-tab-info.interface';
import { IOnUpdatedTabChangeInfo } from './types/on-updated-tab-change-info.interface';
import { TOpenTabOptions } from './types/open-tab-options.type';
import { ITab } from './types/tab.interface';
import { ITabsQueryInfo } from './types/tabs-query-info.interface';
import { IWebExtEvent } from './types/web-ext-event.interface';
import { IWindow } from './types/window.interface';

interface IChromeBrowser {
	browserName: 'chrome';
	sidePanel: {
		open: (options: TOpenTabOptions) => Promise<void>;
	};
}

interface IFirefoxBrowser {
	browserName: 'firefox';
	sidePanel: {
		open: () => Promise<void>;
	};
}

export type TBrowser = (IFirefoxBrowser | IChromeBrowser) & {
	windows: {
		WINDOW_ID_NONE: number;
		getCurrent: () => Promise<IWindow>;
		getLastFocused: () => Promise<IWindow>;
		onFocusChanged: WebExtEvent<(windowId: number) => void>;
	};
	tabs: {
		onUpdated: IWebExtEvent<(tabId: number, info: IOnUpdatedTabChangeInfo, tab: ITab) => void>;
		onActivated: WebExtEvent<(activeInfo: IOnActivatedActiveTabInfo) => void>;
		sendMessage: (tabId: number, msg: any) => Promise<any>;
		create: (tabInfo: { url: string }) => Promise<ITab>;
		query: (queryInfo: ITabsQueryInfo) => Promise<ITab[]>;
	};
	storage: {
		local: {
			get: (key: string) => Promise<Record<string, any>>;
			set: (state: Record<string, any>) => Promise<void>;
			onChanged: IWebExtEvent<
				(changes: Record<string, { oldValue?: any; newValue?: any }>) => void
			>;
		};
	};
	runtime: {
		onMessage: IWebExtEvent<
			(
				message: any,
				sender: IMessageSender,
				sendResponse: (response?: any) => void
			) => boolean | Promise<any> | void
		>;
		sendMessage: (message: any) => Promise<any>;
		getURL: (path: string) => string;
	};
};

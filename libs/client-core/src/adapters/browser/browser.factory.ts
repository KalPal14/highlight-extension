import { BrowserInfo, detect } from 'detect-browser';

import { TBrowser } from './browser.type';

export class BrowserFactory {
	browserInfo: BrowserInfo;

	constructor() {
		const browserInfo = detect();

		if (browserInfo instanceof BrowserInfo) {
			this.browserInfo = browserInfo;
		} else {
			throw new Error('failed to detect browser');
		}
	}

	create(): TBrowser {
		switch (this.browserInfo.name) {
			case 'firefox':
				return {
					browserName: 'firefox',
					windows: browser.windows,
					storage: browser.storage,
					sidePanel: browser.sidebarAction,
					tabs: browser.tabs,
					runtime: browser.runtime,
				};
			default:
				return {
					browserName: 'chrome',
					windows: chrome.windows,
					storage: chrome.storage,
					sidePanel: chrome.sidePanel,
					tabs: chrome.tabs,
					runtime: chrome.runtime,
				};
		}
	}
}

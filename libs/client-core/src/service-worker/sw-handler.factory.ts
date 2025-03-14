import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';

import { openTabHandler } from './handlers/open-tab/open-tab.handler';

export function swHandlerFactory(): void {
	browserAdapter.runtime.onMessage.addListener((msg, sender) => {
		switch (msg.serviceWorkerHandler) {
			case 'openTab':
				openTabHandler(msg);
				return;
		}
	});
}

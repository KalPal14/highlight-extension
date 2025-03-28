import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';

import { apiRequestHandler } from './handlers/api-request/api-request.handler';
import { openTabHandler } from './handlers/open-tab/open-tab.handler';

export function swHandlerFactory(): void {
	browserAdapter.runtime.onMessage.addListener((msg, sender) => {
		switch (msg.serviceWorkerHandler) {
			case 'apiRequest':
				apiRequestHandler(msg, sender);
				return;
			case 'openTab':
				openTabHandler(msg);
				return;
		}
	});
}

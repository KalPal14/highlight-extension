import { BrowserStorageBaseApiService } from '~libs/client-core/services/api-service/infrastracture/browser-storage-base-api.service';
import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';
import { IMessageSender } from '~libs/client-core/adapters/browser/types/message-sender.interface';

import { IApiRequestIncomeMsg } from './types/api-request.income-msg.interface';
import { IApiRequestOutcomeMsg } from './types/api-request.outcome-msg.interface';

export async function apiRequestHandler<DTO>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<DTO>,
	sender: IMessageSender
): Promise<void> {
	const api = new BrowserStorageBaseApiService();
	const resp = await api[method](url, data).catch((err) => err);

	const outcomeMsg: IApiRequestOutcomeMsg = {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		exceptionName: resp instanceof Error ? resp.name : null,
		incomeData: data,
	};

	if (sender.tab?.id) {
		browserAdapter.tabs.sendMessage(sender.tab.id, outcomeMsg);
	} else {
		browserAdapter.runtime.sendMessage(outcomeMsg);
	}
}

import { v4 } from 'uuid';

import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';

import { IApiRequestOutcomeMsg } from './types/api-request.outcome-msg.interface';
import { IApiRequestIncomeMsg } from './types/api-request.income-msg.interface';

export const dispatchApiRequest = {
	get: <DTO, RO>(url: string, data?: DTO): Promise<RO> =>
		dispatchApiRequestLayout({ method: 'get', url, data }),
	post: <DTO, RO>(url: string, data?: DTO): Promise<RO> =>
		dispatchApiRequestLayout({ method: 'post', url, data }),
	patch: <DTO, RO>(url: string, data?: DTO): Promise<RO> =>
		dispatchApiRequestLayout({ method: 'patch', url, data }),
	delete: <DTO, RO>(url: string, data?: DTO): Promise<RO> =>
		dispatchApiRequestLayout({ method: 'delete', url, data }),
};

function dispatchApiRequestLayout<DTO, RO>(
	msg: Omit<IApiRequestIncomeMsg<DTO>, 'serviceWorkerHandler' | 'contentScriptsHandler'>
): Promise<RO> {
	return new Promise((resolve, reject) => {
		browserAdapter.runtime.onMessage.addListener(apiResponseMsgHandler);

		const contentScriptsHandler = `apiHandler_${v4()}`;
		browserAdapter.runtime.sendMessage({
			serviceWorkerHandler: 'apiRequest',
			contentScriptsHandler,
			...msg,
		});

		function apiResponseMsgHandler(outcomeMsg: IApiRequestOutcomeMsg): void {
			if (outcomeMsg.contentScriptsHandler !== contentScriptsHandler) return;
			if (outcomeMsg.exceptionName) {
				reject(outcomeMsg.data as Error);
			} else {
				resolve(outcomeMsg.data as RO);
			}
			browserAdapter.runtime.onMessage.removeListener(apiResponseMsgHandler);
		}
	});
}

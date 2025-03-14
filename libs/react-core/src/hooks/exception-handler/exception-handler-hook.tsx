import React from 'react';
import { UseFormSetError } from 'react-hook-form';
import { uniq } from 'lodash';
import { useToast } from '@chakra-ui/react';
import hotToast from 'react-hot-toast';

import { Exception, HttpException, HttpValidationException } from '~libs/common';

import { Toast } from '../../content-scripts-ui/toasts/toast';
import { toastDefOptions } from '../../ui/toasts/toasts-options';

interface IExceptionMsg {
	title?: string;
	description?: string;
}

interface IExceptionHandlerOptions {
	title?: string;
	unexpectedMsg?: IExceptionMsg;
	onValidation?:
		| UseFormSetError<any>
		| ((property: string, error: { message: string }) => void)
		| IExceptionMsg;
}

interface IUseExceptionHandlerReturn {
	toastException: (err: any, options?: IExceptionHandlerOptions) => void;
	toastContentScriptsException: (err: any, options?: IExceptionHandlerOptions) => void;
}

export function useExceptionHandler(): IUseExceptionHandlerReturn {
	const toast = useToast(toastDefOptions);

	function toastException(err: any, options: IExceptionHandlerOptions = {}): void {
		handleException(err, toast, options);
	}

	function toastContentScriptsException(err: any, options: IExceptionHandlerOptions = {}): void {
		handleException(
			err,
			({ title, description }) =>
				hotToast(
					<Toast
						title={title}
						description={description}
					/>
				),
			options
		);
	}

	function handleException(
		err: any,
		trigger: (content: IExceptionMsg) => void,
		{ title, unexpectedMsg, onValidation }: IExceptionHandlerOptions
	): void {
		if (err instanceof Exception || err instanceof HttpException) {
			trigger({
				title: title ?? err.payload,
				description: title ? err.payload : undefined,
			});
			return;
		}

		if (err instanceof HttpValidationException) {
			if (onValidation instanceof Function) {
				err.payload.forEach(({ property, errors }: Record<string, any>) => {
					onValidation(property, { message: uniq(errors).join() });
				});
				return;
			}
			if (onValidation) {
				trigger(onValidation);
				return;
			}
		}

		const defaultUnexpectedMsg = 'Something went wrong. Please try again';
		trigger({
			title: title ?? defaultUnexpectedMsg,
			description: title ? defaultUnexpectedMsg : undefined,
			...unexpectedMsg,
		});
	}

	return { toastException, toastContentScriptsException };
}

export type THttpValidationExceptionPayload = {
	errors: string[];
	property: string;
}[];

export class HttpValidationException extends Error {
	name = 'HttpValidationException';
	statusCode = 400;
	payload: THttpValidationExceptionPayload;

	constructor(payload: THttpValidationExceptionPayload) {
		super('Http Validation Exception');
		this.payload = payload;
	}
}

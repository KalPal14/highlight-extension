export class HttpException extends Error {
	name = 'HttpException';
	statusCode: number;
	payload: string;

	constructor(statusCode: number, msg: string) {
		super(msg);
		this.statusCode = statusCode;
		this.payload = msg;
	}
}

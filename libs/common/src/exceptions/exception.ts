export class Exception extends Error {
	name = 'Exception';
	payload: string;

	constructor(msg: string) {
		super(msg);
		this.payload = msg;
	}
}

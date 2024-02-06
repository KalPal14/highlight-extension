export class Page {
	constructor(
		private _userId: number,
		private _url: string,
		private _highlights: number[] = [],
	) {}

	get userId(): number {
		return this._userId;
	}
	get url(): string {
		return this._url;
	}
	get highlights(): number[] {
		return this._highlights;
	}
}

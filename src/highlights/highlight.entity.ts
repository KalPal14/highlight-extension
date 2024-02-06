export class Highlight {
	constructor(
		private _pageId: number,
		private _text: string,
		private _color: string,
		private _note?: string,
	) {}

	get pageId(): number {
		return this._pageId;
	}
	get text(): string {
		return this._text;
	}
	get color(): string {
		return this._color;
	}
	get note(): string | null {
		return this._note || null;
	}
}

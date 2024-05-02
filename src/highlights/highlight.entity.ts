export class Highlight {
	constructor(
		private _pageId: number,
		private _startContainerId: number,
		private _endContainerId: number,
		private _startOffset: number,
		private _endOffset: number,
		private _text: string,
		private _color: string,
		private _note?: string,
	) {}

	get pageId(): number {
		return this._pageId;
	}
	get startContainerId(): number {
		return this._startContainerId;
	}
	get endContainerId(): number {
		return this._endContainerId;
	}
	get startOffset(): number {
		return this._startOffset;
	}
	get endOffset(): number {
		return this._endOffset;
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

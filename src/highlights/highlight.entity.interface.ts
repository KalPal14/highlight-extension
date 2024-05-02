export interface IHighlight {
	pageId: number;
	startContainerId: number;
	endContainerId: number;
	startOffset: number;
	endOffset: number;
	text: string;
	color: string;
	note: string | null;
}

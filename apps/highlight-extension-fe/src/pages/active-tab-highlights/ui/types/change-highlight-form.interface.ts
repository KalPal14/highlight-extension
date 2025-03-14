import { IBaseHighlightRo } from '~libs/ro/highlight-extension';

export interface IChangeHighlightForm {
	highlights: {
		highlight: IBaseHighlightRo;
	}[];
}

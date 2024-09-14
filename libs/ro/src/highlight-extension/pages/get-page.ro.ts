import { IBaseHighlightRo } from '../highlights/common/base-highlight.ro';

import { IBasePageRo } from './common/base-page.ro';

export interface IGetPageRoEmpty {
	id: null;
}

export type TGetPageRo = IGetPageRoEmpty | (IBasePageRo & { highlights: IBaseHighlightRo[] });

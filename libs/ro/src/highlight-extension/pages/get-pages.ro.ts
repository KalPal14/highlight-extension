import { IBasePageRo } from './common/base-page.ro';

export interface IGetPagesRoItem extends IBasePageRo {
	highlightsCount: number;
	notesCount: number;
}

export type TGetPagesRo = IGetPagesRoItem[];

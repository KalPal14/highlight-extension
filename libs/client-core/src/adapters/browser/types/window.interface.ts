import { ITab } from './tab.interface';

export interface IWindow {
	tabs?: ITab[];
	top?: number;
	height?: number;
	width?: number;
	focused: boolean;
	alwaysOnTop: boolean;
	incognito: boolean;
	id?: number;
	left?: number;
	sessionId?: string;
}

import {
	IBaseWorkspaceRo,
	ICreateHighlightRo,
	IDeleteHighlightRo,
	IUpdateHighlightRo,
} from '~libs/ro/highlight-extension';
import { IBaseUserRo } from '~libs/ro/iam';

export interface ICrossBrowserStateDescriptor {
	jwt: string | null;
	currentUser: IBaseUserRo | null;
	currentWorkspace: IBaseWorkspaceRo | null;
	isExtActive: boolean;
	createdHighlight: { highlight: ICreateHighlightRo; pageUrl: string } | null;
	deletedHighlight: { highlight: IDeleteHighlightRo; pageUrl: string } | null;
	updatedHighlight: { highlight: IUpdateHighlightRo; pageUrl: string } | null;
}

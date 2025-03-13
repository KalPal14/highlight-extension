import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';
import { IBaseUserRo } from '~libs/ro/iam';

export interface ICrossBrowserStateDescriptor {
	jwt: string | null;
	currentUser: IBaseUserRo | null;
	currentWorkspace: IBaseWorkspaceRo | null;
}

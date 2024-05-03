import { TPageShortInfo } from './page-short-info.type';

import { PageModel } from '@prisma/client';
import { IJwtPayload } from '@/common/types/jwt-payload.interface';

export interface IPagesServise {
	createPage: (pageUrl: string, userData: IJwtPayload) => Promise<PageModel | Error>;
	getPageInfo: (url: string, userId: number) => Promise<PageModel | null>;
	getPagesInfo: (userId: number) => Promise<TPageShortInfo[]>;
}
